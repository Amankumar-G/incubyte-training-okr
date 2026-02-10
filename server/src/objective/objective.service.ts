import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';
import { CreateKeyResultDto } from './dto/create-key-result.dto';

@Injectable()
export class ObjectiveService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateObjectiveDto) {
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

  async getAllKeyResults(objectiveId: string) {
    await this.getObjectiveOrThrow(objectiveId);

    return this.prisma.keyResult.findMany({
      where: { objectiveId },
    });
  }

  async createKeyResult(objectiveId: string, dto: CreateKeyResultDto) {
    await this.getObjectiveOrThrow(objectiveId);

    return this.prisma.keyResult.create({
      data: {
        description: dto.description,
        progress: dto.progress,
        objective: {
          connect: { id: objectiveId },
        },
      },
    });
  }

  async deleteAllKeyResults(objectiveId: string) {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { keyResults: true },
    });

    if (!objective) {
      throw new ObjectiveNotFoundException(
        `Objective with id ${objectiveId} not found`,
      );
    }

    const deleted = await this.prisma.keyResult.deleteMany({
      where: { objectiveId },
    });

    return {
      count: deleted.count,
      data: objective.keyResults,
    };
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
      is_completed: averageProgress === 100,
      average_progress: averageProgress,
    };
  }
}
