import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ObjectiveService, PrismaService],
  controllers: [ObjectiveController],
})
export class ObjectiveModule {}
