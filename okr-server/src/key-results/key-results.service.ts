import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { KeyResult } from '../../generated/prisma/client';
import { KeyResultDtoType } from './dto/key-result-dto.type';

@Injectable()
export class KeyResultsService {
  constructor(private readonly prisma: PrismaService) {}

  fetchAll(): Promise<KeyResult[]> {
    return this.prisma.keyResult.findMany();
  }

  getByObjectiveId(objectiveId: string): Promise<KeyResult[]> {
    return this.prisma.keyResult.findMany({
      where: {
        objectiveId,
      },
    });
  }

  getById(keyResultId: string) {
    return this.prisma.keyResult.findUnique({
      where: {
        id: keyResultId,
      },
    });
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
