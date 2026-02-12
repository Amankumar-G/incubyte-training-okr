import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

@Injectable()
export class KeyResultService {
  constructor(private readonly prisma: PrismaService) {}

  private async getKeyResultOrThrow(keyResultId: string) {
    const keyResult = await this.prisma.keyResult.findUnique({
      where: { id: keyResultId },
    });

    if (!keyResult) {
      throw new NotFoundException(`KeyResult with id ${keyResultId} not found`);
    }

    return keyResult;
  }

  async getById(keyResultId: string) {
    return this.getKeyResultOrThrow(keyResultId);
  }

  async deleteById(keyResultId: string) {
    await this.getKeyResultOrThrow(keyResultId);

    return this.prisma.keyResult.delete({
      where: { id: keyResultId },
    });
  }

  async updateProgress(keyResultId: string, progress: number) {
    await this.getKeyResultOrThrow(keyResultId);

    return this.prisma.keyResult.update({
      where: { id: keyResultId },
      data: {
        progress,
        isCompleted: progress === 100,
      },
    });
  }

  async toggleComplete(keyResultId: string) {
    const keyResult = await this.getKeyResultOrThrow(keyResultId);

    const isCompleted = !keyResult.isCompleted;

    return this.prisma.keyResult.update({
      where: { id: keyResultId },
      data: {
        isCompleted,
        progress: isCompleted ? 100 : 0,
      },
    });
  }
}
