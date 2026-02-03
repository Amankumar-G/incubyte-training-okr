import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Objective } from '../../generated/prisma/client';

export interface ObjectiveDtoType {
  objective: string;
}

@Injectable()
export class ObjectiveService {
  constructor(private prisma: PrismaService) {}

  fetchAll(): Promise<Objective[]> {
    return this.prisma.objective.findMany();
  }

  create(data: ObjectiveDtoType): Promise<Objective> {
    return this.prisma.objective.create({ data });
  }

  delete(id: string): Promise<Objective> {
    return this.prisma.objective.delete({ where: { id } });
  }

  update(id: string, data: ObjectiveDtoType): Promise<Objective> {
    return this.prisma.objective.update({ where: { id }, data });
  }
}
