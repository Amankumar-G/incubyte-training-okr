import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { Objective } from '../../generated/prisma/client';
import type { ObjectiveDtoType } from './objective.service';

@Controller('objective')
export class ObjectiveController {
  constructor(private objectiveService: ObjectiveService) {}

  @Get()
  async getAll(): Promise<Objective[]> {
    return this.objectiveService.fetchAll();
  }

  @Post()
  async create(@Body() objective: ObjectiveDtoType): Promise<Objective> {
    return this.objectiveService.create(objective);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() objective: ObjectiveDtoType,
  ): Promise<Objective> {
    return this.objectiveService.update(id, objective);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Objective> {
    return this.objectiveService.delete(id);
  }
}
