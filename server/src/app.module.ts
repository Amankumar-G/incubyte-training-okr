import { Module } from '@nestjs/common';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';
import { KeyResultModule } from './key-result/key-result.module';
import { ObjectivesKeyResultsModule } from './objectives-key-results/objectives-key-results.module';
import { GeminiService } from './gemini/gemini.service';

@Module({
  imports: [
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KeyResultModule,
    ObjectivesKeyResultsModule,
  ],
  providers: [GeminiService],
})
export class AppModule {}
