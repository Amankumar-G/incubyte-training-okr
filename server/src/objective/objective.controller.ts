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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectiveService } from './objective.service';
import { CreateObjectiveDto } from './dto/create-objective.dto';
import { ObjectiveFilter } from './objective-not-found/objective.filter';

@UseFilters(ObjectiveFilter)
@ApiTags('Objectives')
@Controller('objectives')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Get()
  @ApiOperation({ summary: 'List all objectives' })
  @ApiResponse({ status: 200, description: 'Objectives fetched successfully.' })
  async getAll() {
    return this.objectiveService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get objective by id' })
  @ApiParam({ name: 'id', description: 'Objective id (UUID)' })
  @ApiResponse({ status: 200, description: 'Objective fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async getById(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return this.objectiveService.getById(objectiveId);
  }

  @Get(':id/is-complete')
  @ApiOperation({ summary: 'Check if an objective is complete' })
  @ApiParam({ name: 'id', description: 'Objective id (UUID)' })
  @ApiResponse({ status: 200, description: 'Completion status resolved.' })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async isComplete(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return await this.objectiveService.checkObjectiveCompleted(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new objective' })
  @ApiBody({ type: CreateObjectiveDto })
  @ApiResponse({ status: 201, description: 'Objective created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createObjectiveDto: CreateObjectiveDto) {
    return this.objectiveService.create(createObjectiveDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing objective' })
  @ApiParam({ name: 'id', description: 'Objective id (UUID)' })
  @ApiBody({ type: CreateObjectiveDto })
  @ApiResponse({ status: 200, description: 'Objective updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async update(
    @Param('id', new ParseUUIDPipe()) objectiveId: string,
    @Body() updateObjectiveDto: CreateObjectiveDto,
  ) {
    return this.objectiveService.update(objectiveId, updateObjectiveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an objective' })
  @ApiParam({ name: 'id', description: 'Objective id (UUID)' })
  @ApiResponse({ status: 200, description: 'Objective deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  async delete(@Param('id', new ParseUUIDPipe()) objectiveId: string) {
    return this.objectiveService.delete(objectiveId);
  }

  @Post('/ai')
  async generateObjective(@Body('query') query: string) {
    return this.objectiveService.generateObjective(query);
  }
}
