import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { PrismaService } from '../src/prisma.service';

describe('Objectives', () => {
  let app: INestApplication<App>;

  describe('GET /objectives', () => {
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = module.createNestApplication();
      await app.init();
    });

    it('should return all the objectives', async () => {
      const prismaService = app.get(PrismaService);

      await prismaService.objective.deleteMany({});

      const objective = {
        title: 'nestJS',
        is_completed: false,
      };

      const createdObjective = await prismaService.objective.create({
        data: objective,
        include: {
          keyResults: true,
        },
      });

      return request(app.getHttpServer())
        .get('/objectives')
        .expect(200)
        .expect([
          {
            id: createdObjective.id,
            title: 'nestJS',
            is_completed: false,
            keyResults: [],
          },
        ]);
    });
  });

  describe('POST /objectives', () => {
    it('should create a new objective', async () => {
      const response = await request(app.getHttpServer())
        .post('/objectives')
        .send({
          title: 'nestJS',
        })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'nestJS',
        keyResults: [],
      });

      expect(response.body).toBeDefined();
    });
  });
});
