import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Module({
  providers: [ObjectiveService, PrismaService, GeminiService],
  controllers: [ObjectiveController],
})
export class ObjectiveModule {}
