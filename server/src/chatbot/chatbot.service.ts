import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Chat } from '@google/genai';
import { CHATBOT_PROMPT } from './prompt/chat.prompt';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from 'src/gemini/gemini.service';

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

  async handleChat(message: string) {
    if (!this.chatSession) {
      await this.startNewSession();
    }

    const store = await this.geminiService.getVectorStore();

    const similarDocs = await store.similaritySearch(message, 5);

    const formattedContext = similarDocs?.length
      ? similarDocs
          .map((doc: any) => doc.pageContent || JSON.stringify(doc))
          .join('\n\n')
      : 'No relevant documents found.';

    const contextualMessage = `
Relevant Context:
${formattedContext}

User Question:
${message}

If the question is unrelated to the context, answer normally.
`;

    const result = await this.chatSession!.sendMessage({
      message: contextualMessage,
    });

    return result.text;
  }

  async resetChat(): Promise<void> {
    await this.startNewSession();
  }

  private async startNewSession(): Promise<void> {
    this.chatSession = this.client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        temperature: 0.7,
        systemInstruction: CHATBOT_PROMPT,
      },
      history: [],
    });
  }
}
