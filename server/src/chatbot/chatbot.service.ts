import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Chat } from '@google/genai';
import { CHATBOT_PROMPT } from './prompt/chat.prompt';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private client: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined');
    }

    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Lifecycle hook - runs once the module is initialized
   */
  async onModuleInit(): Promise<void> {
    await this.startNewSession();
  }

  /**
   * Sends a message to the active chat session.
   * Conversation history is preserved automatically.
   */
  async handleChat(message: string) {
    if (!this.chatSession) {
      await this.startNewSession();
    }

    const result = await this.chatSession!.sendMessage({ message });
    return result.text;
  }

  /**
   * Resets the conversation history.
   */
  async resetChat(): Promise<void> {
    await this.startNewSession();
  }

  /**
   * Creates a fresh Gemini chat session
   */
  private async startNewSession(): Promise<void> {
    const okrContext = await this.prismaService.objective.findMany({
      include: { keyResults: true },
    });
    const formattedOkrContext = `${okrContext
      .map((obj) => {
        const keyResults = obj.keyResults
          .map((kr) => `    - ${kr.description} (Progress: ${kr.progress}%) `)
          .join('\n');
        return `Objective: ${obj.title}\nKey Results:\n${keyResults}`;
      })
      .join('\n\n')}`;

    const systemInstruction = `
${CHATBOT_PROMPT}

Current OKRs:
${formattedOkrContext}
`;

    this.chatSession = this.client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        temperature: 0.7,
        systemInstruction,
      },
      history: [],
    });
  }
}
