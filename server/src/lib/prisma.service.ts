import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    console.log(
      'Initializing PrismaService with DATABASE_URL:',
      process.env.DATABASE_URL,
    );
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({
      adapter,
      // log: ['query', 'info', 'warn', 'error']
    });
  }
}
