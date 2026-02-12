import { Injectable } from '@nestjs/common';
import { CreateKeyResultDto } from '../objective/dto/create-key-result.dto';
import { ObjectiveNotFoundException } from '../objective/exceptions/objective-not-found-exception';
import { PrismaService } from '../lib/prisma.service';
import { getObjectiveOrThrow } from '../util/objective.utils';

@Injectable()
export class ObjectivesKeyResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllKeyResults(objectiveId: string) {
    await getObjectiveOrThrow(this.prisma, objectiveId);

    return this.prisma.keyResult.findMany({
      where: { objectiveId },
    });
  }

  async createKeyResult(objectiveId: string, dto: CreateKeyResultDto) {
    await getObjectiveOrThrow(this.prisma, objectiveId);

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
}
