import { Module } from '@nestjs/common';
import { ObjectivesKeyResultsController } from './objectives-key-results.controller';
import { ObjectivesKeyResultsService } from './objectives-key-results.service';
import { PrismaService } from '../lib/prisma.service';

@Module({
  controllers: [ObjectivesKeyResultsController],
  providers: [ObjectivesKeyResultsService, PrismaService],
})
export class ObjectivesKeyResultsModule {}
