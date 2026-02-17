import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface GenerateContentOptions {
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
  modelName?: string;
}

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')!;
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateContent(
    prompt: string,
    options?: GenerateContentOptions,
  ): Promise<string> {
    if (!prompt) {
      throw new InternalServerErrorException(
        'Prompt is required and must be a string',
      );
    }

    try {
      const result = await this.genAI.models.generateContent({
        model: options?.modelName || 'gemini-flash-lite-latest',
        contents: prompt,
        config: {
          systemInstruction: options?.systemInstruction,
          responseMimeType: options?.responseMimeType || 'application/json',
          responseSchema: options?.responseSchema,
        },
      });

      const text = result.text || '';

      return text.replaceAll(/```json|```/g, '').trim();
    } catch (error) {
      console.error('Gemini processing error:', error);
      throw new InternalServerErrorException('Failed to generate content');
    }
  }
}
