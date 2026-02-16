import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';

@Injectable()
export class ObjectiveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) { }

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
    return this.prisma.objective.create({
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

    return this.prisma.objective.update({
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

  async suggestObjective(query: string) {
    const response = await this.geminiService.generateText(query);
    const parsedResponse = JSON.parse(response);
    return parsedResponse;
  }
}
