import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesKeyResultsService } from './objectives-key-results.service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../lib/prisma.service';

describe('ObjectivesKeyResultsService', () => {
  let service: ObjectivesKeyResultsService;

  const prismaMock = {
    objective: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
    keyResult: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectivesKeyResultsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ObjectivesKeyResultsService>(
      ObjectivesKeyResultsService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllKeyResults', () => {
    it('should return all key results of objective', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.keyResult.findMany.mockResolvedValue([{ id: 'kr-1' }]);

      const result = await service.getAllKeyResults('obj-1');

      expect(result.length).toBe(1);
    });
  });

  describe('createKeyResult', () => {
    it('should create key result for objective', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.keyResult.create.mockResolvedValue({ id: 'kr-1' });

      const result = await service.createKeyResult('obj-1', {
        description: 'KR',
        progress: 20,
      });

      expect(prismaMock.keyResult.create).toHaveBeenCalledWith({
        data: {
          description: 'KR',
          progress: 20,
          objective: { connect: { id: 'obj-1' } },
        },
      });
      expect(result).toEqual({ id: 'kr-1' });
    });
  });

  describe('deleteAllKeyResults', () => {
    it('should delete all key results and return count + data', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({
        id: 'obj-1',
        keyResults: [{ id: 'kr-1' }],
      });

      prismaMock.keyResult.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteAllKeyResults('obj-1');

      expect(result.count).toBe(1);
      expect(result.data.length).toBe(1);
    });
  });
});
