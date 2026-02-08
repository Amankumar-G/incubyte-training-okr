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
import { CreateKeyResultDto } from './dto/create-key-result.dto';

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

  @Get(':objectiveId/key-results')
  async getAllKeyResult(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.objectiveService.getAllKeyResults(objectiveId);
  }

  @Post(':objectiveId/key-results')
  async createKeyResult(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
    @Body() createKeyResultDto: CreateKeyResultDto,
  ) {
    return this.objectiveService.createKeyResult(
      objectiveId,
      createKeyResultDto,
    );
  }

  @Delete('objectiveId/key-results')
  async deleteAllKeyResults(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.objectiveService.deleteAllKeyResults(objectiveId);
  }
}
