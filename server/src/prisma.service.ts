import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

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
    super({ adapter, log: ['query', 'info', 'warn', 'error'] });
  }
}
