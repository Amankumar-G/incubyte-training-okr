import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { Objective } from '../../generated/prisma/client';
import { ObjectiveDtoType } from './dto/objectiveDtoType';
import { ObjectiveFilter } from './objectiveFilter';

@UseFilters(ObjectiveFilter)
@Controller('objectives')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Get()
  async getAll(): Promise<Objective[]> {
    return this.objectiveService.fetchAll();
  }

  @Get(':objectiveId')
  async getById(@Param('objectiveId') objectiveId: string): Promise<Objective> {
    return this.objectiveService.getById(objectiveId);
  }

  @Post()
  async create(@Body(new ValidationPipe()) objective: ObjectiveDtoType) {
    return await this.objectiveService.create(objective);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) objective: ObjectiveDtoType,
  ): Promise<Objective> {
    return this.objectiveService.update(id, objective);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Objective> {
    return this.objectiveService.delete(id);
  }
}
