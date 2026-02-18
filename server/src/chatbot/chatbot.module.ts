import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

@Module({
  providers: [ChatbotService, PrismaService, GeminiService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
