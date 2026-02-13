import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateKeyResultDto } from '../objective/dto/create-key-result.dto';
import { ObjectivesKeyResultsService } from './objectives-key-results.service';

@ApiTags('Objective Key Results')
@Controller('objective/:objectiveId/key-results')
export class ObjectivesKeyResultsController {
  constructor(
    private readonly ObjectivesKeyResultsService: ObjectivesKeyResultsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List key results for an objective' })
  @ApiParam({ name: 'objectiveId', description: 'Objective id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Key results fetched successfully.',
  })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async getAllKeyResult(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.ObjectivesKeyResultsService.getAllKeyResults(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a key result for an objective' })
  @ApiParam({ name: 'objectiveId', description: 'Objective id (UUID)' })
  @ApiBody({ type: CreateKeyResultDto })
  @ApiResponse({ status: 201, description: 'Key result created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
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
  @ApiOperation({ summary: 'Delete all key results for an objective' })
  @ApiParam({ name: 'objectiveId', description: 'Objective id (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Key results deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async deleteAllKeyResults(
    @Param('objectiveId', new ParseUUIDPipe()) objectiveId: string,
  ) {
    return this.ObjectivesKeyResultsService.deleteAllKeyResults(objectiveId);
  }
}
