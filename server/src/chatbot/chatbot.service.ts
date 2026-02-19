import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Chat } from '@google/genai';
import { MessageEvent } from '@nestjs/common';
import { CHATBOT_PROMPT } from './prompt/chat.prompt';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from 'src/gemini/gemini.service';
import { Observable } from 'rxjs';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private client: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly geminiService: GeminiService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined');
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  async onModuleInit(): Promise<void> {
    await this.startNewSession();
  }

  private async buildContextualMessage(message: string): Promise<string> {
    const store = await this.geminiService.getVectorStore();
    const similarDocs = await store.similaritySearch(message, 5);

    const context = similarDocs?.length
      ? similarDocs
          .map((doc: any) => doc.pageContent ?? JSON.stringify(doc))
          .join('\n\n')
      : 'No relevant documents found.';

    return `
Relevant Context:
${context}

User Question:
${message}

If the question is unrelated to the context, answer normally.
    `.trim();
  }

  async handleChat(message: string): Promise<string> {
    if (!this.chatSession) {
      await this.startNewSession();
    }

    const contextualMessage = await this.buildContextualMessage(message);
    const result = await this.chatSession!.sendMessage({
      message: contextualMessage,
    });

    return result.text ?? '';
  }

  async resetChat(): Promise<void> {
    await this.startNewSession();
  }

  handleChatStream(message: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          if (!this.chatSession) {
            await this.startNewSession();
          }

          const contextualMessage = await this.buildContextualMessage(message);

          const stream = await this.chatSession!.sendMessageStream({
            message: contextualMessage,
          });

          for await (const chunk of stream) {
            if (chunk.text) {
              subscriber.next({ data: { text: chunk.text } } as MessageEvent);
            }
          }

          subscriber.next({ data: '[DONE]' } as MessageEvent);
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
        }
      })();
    });
  }

  private async startNewSession(): Promise<void> {
    this.chatSession = this.client.chats.create({
      model: 'gemini-flash-lite-latest',
      config: {
        temperature: 0.7,
        systemInstruction: CHATBOT_PROMPT,
      },
      history: [],
    });
  }
}
