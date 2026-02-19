import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { ObjectiveService } from '../objective/objective.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  providers: [
    ChatbotService,
    PrismaService,
    GeminiService,
    ObjectiveService,
    EventEmitter2,
  ],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
