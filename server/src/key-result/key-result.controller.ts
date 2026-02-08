import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { ProgressDto } from './dto/progress.dto';

@Controller('key-results/:keyResult')
export class KeyResultController {
  constructor(private readonly keyResultService: KeyResultService) {}

  @Get()
  async getById(@Param('keyResult', new ParseUUIDPipe()) keyResultId: string) {
    return this.keyResultService.getById(keyResultId);
  }

  @Delete()
  async deleteById(
    @Param('keyResult', new ParseUUIDPipe()) keyResultId: string,
  ) {
    return this.keyResultService.deleteById(keyResultId);
  }

  @Patch()
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
  async toggleComplete(
    @Param('keyResult', new ParseUUIDPipe()) keyResultId: string,
  ) {
    return this.keyResultService.toggleComplete(keyResultId);
  }
}
