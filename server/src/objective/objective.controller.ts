import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { ObjectiveFilter } from './objective-not-found/objective.filter';

@UseFilters(ObjectiveFilter)
@Controller('objectives')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Get()
  async getAll() {
    return this.objectiveService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return this.objectiveService.getById(objectiveId);
  }

  @Get(':id/is-complete')
  async isComplete(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return await this.objectiveService.checkObjectiveCompleted(objectiveId);
  }

  @Post()
  async create(@Body() createObjectiveDto: CreateObjectiveDto) {
    return this.objectiveService.create(createObjectiveDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) objectiveId: string,
    @Body() updateObjectiveDto: CreateObjectiveDto,
  ) {
    return this.objectiveService.update(objectiveId, updateObjectiveDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return this.objectiveService.delete(objectiveId);
  }
}
