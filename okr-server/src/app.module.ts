import { Module } from '@nestjs/common';
import { KeyResultsModule } from './key-results/key-results.module';
import { OkrModule } from './okr/okr.module';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    OkrModule,
    KeyResultsModule,
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
