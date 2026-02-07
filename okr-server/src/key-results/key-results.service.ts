import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { KeyResult } from '../../generated/prisma/client';
import { KeyResultDtoType } from './dto/key-result-dto.type';
import { ObjectiveNotFoundError } from '../objective/error/objectiveNotFoundError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class KeyResultsService {
  constructor(private readonly prisma: PrismaService) {}

  fetchAll(): Promise<KeyResult[]> {
    return this.prisma.keyResult.findMany();
  }

  async getByObjectiveId(objectiveId: string): Promise<KeyResult[]> {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
    });

    if (!objective) {
      throw new ObjectiveNotFoundError(objectiveId);
    }

    return this.prisma.keyResult.findMany({
      where: {
        objectiveId: objectiveId,
      },
    });
  }

  async getById(keyResultId: string) {
    try {
      return await this.prisma.keyResult.findUniqueOrThrow({
        where: {
          id: keyResultId,
        },
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error(`KeyResult with id ${keyResultId} not found`);
      }
      throw error;
    }
  }

  update(keyResultId: string, keyResultDto: KeyResultDtoType) {
    return this.prisma.keyResult.update({
      where: {
        id: keyResultId,
      },
      data: {
        ...keyResultDto,
      },
    });
  }
}
