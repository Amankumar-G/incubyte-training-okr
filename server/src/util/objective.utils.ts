import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../lib/prisma.service';

export async function getObjectiveOrThrow(prisma: PrismaService, id: string) {
  const objective = await prisma.objective.findUnique({
    where: { id },
  });

  if (!objective) {
    throw new NotFoundException('Objective not found');
  }

  return objective;
}
