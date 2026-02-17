import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PrismaService } from '../lib/prisma.service';

@Module({
  providers: [ChatbotService, PrismaService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
