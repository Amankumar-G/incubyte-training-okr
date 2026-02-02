import { Module } from '@nestjs/common';

import { OkrModule } from './okr/okr.module';
import { KeyResultsModule } from './key-results/key-results.module';

@Module({
  imports: [OkrModule, KeyResultsModule],
})
export class AppModule {}
