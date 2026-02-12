import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateKeyResultDto } from '../objective/dto/create-key-result.dto';
import { ObjectivesKeyResultsService } from './objectives-key-results.service';

@Controller('objective/:objectiveId/key-results')
export class ObjectivesKeyResultsController {
  constructor(
    private readonly ObjectivesKeyResultsService: ObjectivesKeyResultsService,
  ) {}

  @Get()
  async getAllKeyResult(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.ObjectivesKeyResultsService.getAllKeyResults(objectiveId);
  }

  @Post()
  async createKeyResult(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
    @Body() createKeyResultDto: CreateKeyResultDto,
  ) {
    return this.ObjectivesKeyResultsService.createKeyResult(
      objectiveId,
      createKeyResultDto,
    );
  }

  @Delete()
  async deleteAllKeyResults(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.ObjectivesKeyResultsService.deleteAllKeyResults(objectiveId);
  }
}
