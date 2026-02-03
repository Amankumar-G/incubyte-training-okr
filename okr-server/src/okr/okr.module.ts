import { Module } from '@nestjs/common';
import { OkrController } from './okr.controller';
import { OkrService } from './okr.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [OkrController],
  providers: [OkrService, PrismaService],
})
export class OkrModule {}
