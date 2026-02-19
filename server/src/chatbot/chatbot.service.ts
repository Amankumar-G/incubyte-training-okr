import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Chat, Tool, FunctionCall, Type } from '@google/genai';
import { MessageEvent } from '@nestjs/common';
import { CHATBOT_PROMPT } from './prompt/chat.prompt';
import { GeminiService } from 'src/gemini/gemini.service';
import { ObjectiveService } from '../objective/objective.service';
import { Observable } from 'rxjs';

const MODEL_NAME = 'gemini-2.5-flash' as const;
const TEMPERATURE = 0.7;
const CREATE_OKR_TOOL_NAME = 'create_okr' as const;

@Injectable()
export class ChatbotService implements OnModuleInit {
  private client: GoogleGenAI;
  private chatSession: Chat | null = null;
  private readonly tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: CREATE_OKR_TOOL_NAME,
          description:
            'Creates a new OKR (Objective and Key Results) based on user input. Use this when the user asks to create, generate, or suggest OKRs.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              query: {
                type: Type.STRING,
                description:
                  "The user's description or request for creating an OKR. Include all context about what they want to achieve.",
              },
            },
            required: ['query'],
          },
        },
      ],
    },
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService,
    private readonly objectiveService: ObjectiveService,
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

  async resetChat(): Promise<void> {
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

  private async ensureSession(): Promise<void> {
    if (!this.chatSession) {
      await this.startNewSession();
    }
  }

  private async handleFunctionCall(
    functionCall: FunctionCall,
  ): Promise<Record<string, unknown> | null> {
    if (functionCall.name !== CREATE_OKR_TOOL_NAME) {
      return null;
    }

    const query = functionCall.args?.query as string;
    if (!query) {
      throw new InternalServerErrorException(
        'Missing query parameter in function call',
      );
    }

    return await this.objectiveService.suggestObjective(query);
  }

  private async processFunctionCallResponse(
    functionCall: FunctionCall,
  ): Promise<string> {
    const response = await this.handleFunctionCall(functionCall);
    if (!response) {
      return 'Sorry, I was unable to process your request.';
    }

    const functionResponse = await this.chatSession!.sendMessage({
      message: {
        functionResponse: {
          name: functionCall.name,
          response,
        },
      },
    });

    return functionResponse.text ?? '';
  }

  private async *streamFunctionCallResponse(
    functionCall: FunctionCall,
  ): AsyncGenerator<string> {
    const response = await this.handleFunctionCall(functionCall);
    if (!response) {
      return;
    }

    const functionStream = await this.chatSession!.sendMessageStream({
      message: {
        functionResponse: {
          name: functionCall.name,
          response,
        },
      },
    });

    for await (const chunk of functionStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }

  async handleChat(message: string): Promise<string> {
    await this.ensureSession();

    const contextualMessage = await this.buildContextualMessage(message);
    const result = await this.chatSession!.sendMessage({
      message: contextualMessage,
    });

    // Handle function calls if present
    if (result.functionCalls?.length) {
      return await this.processFunctionCallResponse(result.functionCalls[0]);
    }

    return result.text ?? '';
  }

  handleChatStream(message: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          await this.ensureSession();

          const contextualMessage = await this.buildContextualMessage(message);
          const stream = await this.chatSession!.sendMessageStream({
            message: contextualMessage,
          });

          let functionCall: FunctionCall | null = null;
          let okrData: Record<string, unknown> | null = null;

          // Fully consume the stream — never break early
          for await (const chunk of stream) {
            if (chunk.functionCalls?.length) {
              // Capture the function call but keep iterating
              functionCall = chunk.functionCalls[0];
              // Execute the function immediately to get OKR data
              okrData = await this.handleFunctionCall(functionCall);
              // Don't emit text for function call chunks
              continue;
            }

            if (chunk.text) {
              subscriber.next({ data: { text: chunk.text } } as MessageEvent);
            }
          }

          // Now safe to send function response after stream is complete
          if (functionCall && okrData) {
            try {
              // Send OKR data as metadata first so the button appears
              subscriber.next({
                data: { type: 'okr_data', data: okrData },
              } as MessageEvent);

              // Stream the AI's formatted response about the OKR
              const functionStream = await this.chatSession!.sendMessageStream({
                message: {
                  functionResponse: {
                    name: functionCall.name,
                    response: okrData,
                  },
                },
              });

              let hasReceivedText = false;
              for await (const chunk of functionStream) {
                if (chunk.text) {
                  hasReceivedText = true;
                  subscriber.next({
                    data: { text: chunk.text },
                  } as MessageEvent);
                }
              }

              // If no text was received, send a default message
              if (!hasReceivedText) {
                subscriber.next({
                  data: {
                    text: "✅ I've created an OKR suggestion for you! Click the button below to add it to your objectives.",
                  },
                } as MessageEvent);
              }
            } catch (functionError) {
              console.error(
                'Error processing function response:',
                functionError,
              );
              // Still send a success message even if AI response fails
              subscriber.next({
                data: {
                  text: "✅ I've created an OKR suggestion for you! Click the button below to add it to your objectives.",
                },
              } as MessageEvent);
            }
          }

          subscriber.next({ data: '[DONE]' } as MessageEvent);
          subscriber.complete();
        } catch (err) {
          console.error('Chat stream error:', err);
          subscriber.error(err);
        }
      })();
    });
  }

  private async startNewSession(): Promise<void> {
    this.chatSession = this.client.chats.create({
      model: MODEL_NAME,
      config: {
        temperature: TEMPERATURE,
        systemInstruction: CHATBOT_PROMPT,
        tools: this.tools,
      },
      history: [],
    });
  }
}
