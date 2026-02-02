import { Module } from '@nestjs/common';
import { KeyResultsService } from './key-results.service';
import { KeyResultsController } from './key-results.controller';

@Module({
  providers: [KeyResultsService],
  controllers: [KeyResultsController],
})
export class KeyResultsModule {}
