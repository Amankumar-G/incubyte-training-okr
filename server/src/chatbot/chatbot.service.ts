import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { Chat, Tool, FunctionCall, Type } from '@google/genai';
import { MessageEvent } from '@nestjs/common';
import { CHATBOT_PROMPT } from './prompt/chat.prompt';
import { GeminiService } from '../gemini/gemini.service';
import { ObjectiveService } from '../objective/objective.service';
import { Observable } from 'rxjs';

const MODEL_NAME = 'gemini-2.5-flash' as const;
const TEMPERATURE = 0.7;
const CREATE_OKR_TOOL_NAME = 'create_okr' as const;

@Injectable()
export class ChatbotService implements OnModuleInit {
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
    private readonly geminiService: GeminiService,
    private readonly objectiveService: ObjectiveService,
  ) {}

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

          for await (const chunk of stream) {
            if (chunk.functionCalls?.length) {
              functionCall = chunk.functionCalls[0];
              okrData = await this.handleFunctionCall(functionCall);
              continue;
            }

            if (chunk.text) {
              subscriber.next({ data: { text: chunk.text } } as MessageEvent);
            }
          }

          if (functionCall && okrData) {
            try {

              subscriber.next({
                data: { type: 'okr_data', data: okrData },
              } as MessageEvent);


              let hasReceivedText = false;
              for await (const text of this.streamFunctionCallResponse(
                functionCall,
              )) {
                hasReceivedText = true;
                subscriber.next({
                  data: { text },
                } as MessageEvent);
              }

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
    this.chatSession = this.geminiService.createChat({
      model: MODEL_NAME,
      temperature: TEMPERATURE,
      systemInstruction: CHATBOT_PROMPT,
      tools: this.tools,
      history: [],
    });
  }
}
