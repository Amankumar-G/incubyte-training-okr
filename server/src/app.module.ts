import { Module } from '@nestjs/common';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';
import { KeyResultModule } from './key-result/key-result.module';
import { ObjectivesKeyResultsModule } from './objectives-key-results/objectives-key-results.module';
import { GeminiService } from './gemini/gemini.service';
import { ChatbotModule } from './chatbot/chatbot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OKREmbeddingListener } from './listeners/okr-embedding.listener';
import { PrismaService } from './lib/prisma.service';

@Module({
  imports: [
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    KeyResultModule,
    ObjectivesKeyResultsModule,
    ChatbotModule,
  ],
  providers: [PrismaService, GeminiService, OKREmbeddingListener],
})
export class AppModule {}
