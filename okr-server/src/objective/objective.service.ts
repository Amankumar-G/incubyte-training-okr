import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Objective } from '../../generated/prisma/client';
import { ObjectiveDtoType } from './dto/objectiveDtoType';
import { ObjectiveNotFoundError } from './error/objectiveNotFoundError';
import { DuplicateObjectiveError } from './error/duplicateObjectiveError';

@Injectable()
export class ObjectiveService {
  constructor(private readonly prisma: PrismaService) {}

  fetchAll(): Promise<Objective[]> {
    return this.prisma.objective.findMany({
      include: { keyResults: true },
    });
  }

  async create(data: ObjectiveDtoType): Promise<Objective> {
    const objective = await this.prisma.objective.findFirst({
      where: { objective: data.objective },
    });
    if (objective) {
      throw new DuplicateObjectiveError(objective.id, data);
    }
    return this.prisma.objective.create({ data });
  }

  async delete(id: string): Promise<Objective> {
    const objective = await this.prisma.objective.findUnique({
      where: { id },
    });

    if (!objective) {
      throw new ObjectiveNotFoundError(id);
    }
    return this.prisma.objective.delete({ where: { id } });
  }

  async update(id: string, data: ObjectiveDtoType): Promise<Objective> {
    const objective = await this.prisma.objective.findUnique({
      where: { id },
    });

    if (!objective) {
      throw new ObjectiveNotFoundError(id);
    } else if (objective.objective === data.objective) {
      throw new DuplicateObjectiveError(id, data);
    }

    return this.prisma.objective.update({ where: { id }, data });
  }

  async getById(objectiveId: string) {
    const objective = await this.prisma.objective.findUnique({
      where: { id: objectiveId },
      include: { keyResults: true },
    });

    if (!objective) {
      throw new ObjectiveNotFoundError(objectiveId);
    }

    return objective;
  }
}
