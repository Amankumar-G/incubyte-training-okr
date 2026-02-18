import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { Prisma } from '../../generated/prisma/client';
import type { Document } from '../../generated/prisma/client';
import { PrismaService } from '../lib/prisma.service';

export interface GenerateContentOptions {
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: Record<string, unknown>;
  modelName?: string;
}

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenAI;
  private readonly embeddings: GoogleGenerativeAIEmbeddings;
  private vectorStore: PrismaVectorStore<
    Document,
    'Document',
    any,
    any
  > | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    this.genAI = new GoogleGenAI({ apiKey });

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'gemini-embedding-001',
      apiKey,
    });
  }

  async generateContent(
    prompt: string,
    options?: GenerateContentOptions,
  ): Promise<string> {
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new InternalServerErrorException(
        'Prompt must be a non-empty string',
      );
    }

    try {
      const result = await this.genAI.models.generateContent({
        model: options?.modelName ?? 'gemini-1.5-flash',
        contents: prompt,
        config: {
          ...(options?.systemInstruction && {
            systemInstruction: options.systemInstruction,
          }),
          ...(options?.responseSchema && {
            responseMimeType: 'application/json',
            responseSchema: options.responseSchema,
          }),
        },
      });

      return (result.text || '').replace(/```(?:json)?\n?/g, '').trim();
    } catch (error) {
      console.error('Gemini processing error:', error);
      throw new InternalServerErrorException('Failed to generate content');
    }
  }

  async generateEmbedding(input: string): Promise<number[]> {
    if (!input || typeof input !== 'string' || !input.trim()) {
      throw new InternalServerErrorException(
        'Input must be a non-empty string',
      );
    }

    try {
      return await this.embeddings.embedQuery(input);
    } catch (error) {
      console.error('Gemini embedding error:', error);
      throw new InternalServerErrorException('Failed to generate embeddings');
    }
  }

  async getVectorStore(): Promise<
    PrismaVectorStore<Document, 'Document', any, any>
  > {
    if (this.vectorStore) return this.vectorStore;

    this.vectorStore = PrismaVectorStore.withModel<Document>(
      this.prisma,
    ).create(this.embeddings, {
      prisma: Prisma,
      tableName: 'Document',
      vectorColumnName: 'embedding',
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
        metadata: true,
      },
    });

    return this.vectorStore;
  }
}
