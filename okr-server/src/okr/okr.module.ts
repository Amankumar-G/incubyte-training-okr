import { Module } from '@nestjs/common';
import { OkrController } from './okr.controller';
import { OkrService } from './okr.service';

@Module({
  controllers: [OkrController],
  providers: [OkrService],
})
export class OkrModule {}
