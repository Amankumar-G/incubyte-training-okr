import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';
import { OkrResponseSchema, OkrResponse } from './schemas/okr-response.schema';
import { systemPrompt } from '../gemini/prompt/create-objective.prompt';
import { z } from 'zod';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ObjectiveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async getObjectiveOrThrow(objectiveId: string) {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { keyResults: true },
    });

    if (!objective) {
      throw new ObjectiveNotFoundException(
        `Objective with id ${objectiveId} not found`,
      );
    }

    return objective;
  }

  private parseAndValidateOkrResponse(rawResponse: string): OkrResponse {
    try {
      const parsedJson: unknown = JSON.parse(rawResponse);
      return OkrResponseSchema.parse(parsedJson);
    } catch (error) {
      console.error('OKR response parsing/validation error:', error);

      if (error instanceof z.ZodError) {
        console.error('Validation failed:', JSON.stringify(error, null, 2));
        throw new InternalServerErrorException(
          'AI response format invalid for OKR structure',
        );
      }

      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException(
          'Failed to parse AI response as JSON',
        );
      }

      throw new InternalServerErrorException(
        'Failed to process AI-generated OKR',
      );
    }
  }

  async getAll() {
    return this.prisma.objective.findMany({
      include: { keyResults: true },
    });
  }

  async getById(objectiveId: string) {
    await this.getObjectiveOrThrow(objectiveId);

    return this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { keyResults: true },
    });
  }

  async create(dto: CreateObjectiveDto) {
    const createdObjective = await this.prisma.objective.create({
      data: {
        title: dto.title,
        keyResults: dto.keyResults?.length
          ? {
              create: dto.keyResults.map((kr) => ({
                description: kr.description,
                progress: kr.progress,
              })),
            }
          : undefined,
      },
      include: { keyResults: true },
    });

    this.eventEmitter.emit('okr.changed', createdObjective);
    return createdObjective;
  }

  async delete(objectiveId: string) {
    await this.getObjectiveOrThrow(objectiveId);

    return this.prisma.objective.delete({
      where: { id: objectiveId },
      include: { keyResults: true },
    });
  }

  async update(objectiveId: string, dto: CreateObjectiveDto) {
    await this.getObjectiveOrThrow(objectiveId);
    const updatedObjective = await this.prisma.objective.update({
      where: { id: objectiveId },
      data: {
        title: dto.title,
        keyResults: {
          deleteMany: {},
          create:
            dto.keyResults?.map((kr) => ({
              description: kr.description,
              progress: kr.progress,
            })) ?? [],
        },
      },
      include: { keyResults: true },
    });

    this.eventEmitter.emit('okr.changed', updatedObjective);
    return updatedObjective;
  }

  async checkObjectiveCompleted(objectiveId: string) {
    const objective = await this.getObjectiveOrThrow(objectiveId);
    const progress = objective.keyResults.reduce(
      (acc, kr) => acc + kr.progress,
      0,
    );

    const averageProgress = objective.keyResults.length
      ? progress / objective.keyResults.length
      : 0;

    return {
      isCompleted: averageProgress === 100,
      average_progress: averageProgress,
    };
  }

  async suggestObjective(query: string): Promise<OkrResponse> {
    const rawResponse = await this.geminiService.generateContent(query, {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: OkrResponseSchema.toJSONSchema(),
      modelName: 'gemini-2.5-flash',
    });

    return this.parseAndValidateOkrResponse(rawResponse);
  }
}
