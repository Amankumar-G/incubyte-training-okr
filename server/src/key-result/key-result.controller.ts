import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { KeyResultService } from './key-result.service';
import { ProgressDto } from './dto/progress.dto';

@ApiTags('Key Results')
@Controller('key-results/:keyResult')
export class KeyResultController {
  constructor(private readonly keyResultService: KeyResultService) {}

  @Get()
  @ApiOperation({ summary: 'Get key result by id' })
  @ApiParam({ name: 'keyResult', description: 'Key result id (UUID)' })
  @ApiResponse({ status: 200, description: 'Key result fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Key result not found.' })
  async getById(@Param('keyResult', new ParseUUIDPipe()) keyResultId: string) {
    return this.keyResultService.getById(keyResultId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete key result by id' })
  @ApiParam({ name: 'keyResult', description: 'Key result id (UUID)' })
  @ApiResponse({ status: 200, description: 'Key result deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Key result not found.' })
  async deleteById(
    @Param('keyResult', new ParseUUIDPipe()) keyResultId: string,
  ) {
    return this.keyResultService.deleteById(keyResultId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update key result progress' })
  @ApiParam({ name: 'keyResult', description: 'Key result id (UUID)' })
  @ApiBody({ type: ProgressDto })
  @ApiResponse({ status: 200, description: 'Key result progress updated.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Key result not found.' })
  async updateProgress(
    @Param('keyResult', new ParseUUIDPipe()) keyResultId: string,
    @Body() ProgressDto: ProgressDto,
  ) {
    return this.keyResultService.updateProgress(
      keyResultId,
      ProgressDto.progress,
    );
  }

  @Patch('/toggle-complete')
  @ApiOperation({ summary: 'Toggle key result completion' })
  @ApiParam({ name: 'keyResult', description: 'Key result id (UUID)' })
  @ApiResponse({ status: 200, description: 'Key result completion toggled.' })
  @ApiResponse({ status: 404, description: 'Key result not found.' })
  async toggleComplete(
    @Param('keyResult', new ParseUUIDPipe()) keyResultId: string,
  ) {
    return this.keyResultService.toggleComplete(keyResultId);
  }
}
