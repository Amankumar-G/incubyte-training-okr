import { Module } from '@nestjs/common';
import { KeyResultsService } from './key-results.service';
import { KeyResultsController } from './key-results.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [KeyResultsController],
  providers: [KeyResultsService, PrismaService],
})
export class KeyResultsModule {}
