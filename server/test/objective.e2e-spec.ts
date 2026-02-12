import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { beforeEach, describe, afterEach, it, expect } from 'vitest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/lib/prisma.service';
import { Objective } from '../generated/prisma/client';

describe('Objectives', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /objectives', () => {
    it('should return all the objectives ', async () => {
      await request(app.getHttpServer()).get('/objectives').expect(200);
    });
  });

  describe('POST /objectives', () => {
    it('should create a new objective', async () => {
      const prismaService = app.get(PrismaService);

      const reqBody = {
        title: 'nestJS',
      };

      const response = await request(app.getHttpServer())
        .post('/objectives')
        .send(reqBody)
        .expect(201);

      const body = response.body as Objective;

      expect(body).toHaveProperty('id');
      expect(body.title).toBe(reqBody.title);
      expect(body.isCompleted).toBe(false);

      const createdObjective = await prismaService.objective.findUnique({
        where: { id: body.id },
      });

      expect(createdObjective).toBeDefined();
      expect(createdObjective?.title).toBe(reqBody.title);
      expect(createdObjective?.isCompleted).toBe(false);
    });
  });
});
