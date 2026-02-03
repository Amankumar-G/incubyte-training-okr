import { Module } from '@nestjs/common';
import { ObjectiveController } from './objective.controller';
import { ObjectiveService } from './objective.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ObjectiveController],
  providers: [ObjectiveService, PrismaService],
})
export class ObjectiveModule {}
