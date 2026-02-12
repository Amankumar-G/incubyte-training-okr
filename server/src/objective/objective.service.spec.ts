import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveService } from './objective.service';
import { PrismaService } from '../lib/prisma.service';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';
import { describe, vi, beforeEach, afterEach, it, expect } from 'vitest';

describe('ObjectiveService', () => {
  let service: ObjectiveService;

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
        ObjectiveService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ObjectiveService>(ObjectiveService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should return objective when found', async () => {
      prismaMock.objective.findUnique
        .mockResolvedValueOnce({ id: 'obj-1' })
        .mockResolvedValueOnce({ id: 'obj-1', keyResults: [] });

      const result = await service.getById('obj-1');

      expect(result?.id).toBe('obj-1');
    });

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(service.getById('obj-x')).rejects.toThrow(
        ObjectiveNotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create objective with key results', async () => {
      prismaMock.objective.create.mockResolvedValue({
        id: 'obj-1',
        keyResults: [],
      });

      const result = await service.create({
        title: 'Objective',
        keyResults: [],
      });

      expect(prismaMock.objective.create).toHaveBeenCalled();
      expect(result.id).toBe('obj-1');
    });
  });

  describe('getAll', () => {
    it('should return objectives with key results', async () => {
      prismaMock.objective.findMany.mockResolvedValue([
        { id: 'obj-1', keyResults: [] },
      ]);

      const result = await service.getAll();

      expect(prismaMock.objective.findMany).toHaveBeenCalledWith({
        include: { keyResults: true },
      });
      expect(result).toEqual([{ id: 'obj-1', keyResults: [] }]);
    });
  });

  describe('update', () => {
    it('should replace title and key results', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.objective.update.mockResolvedValue({
        id: 'obj-1',
        keyResults: [{ id: 'kr-1' }],
      });

      const result = await service.update('obj-1', {
        title: 'New title',
        keyResults: [{ description: 'KR', progress: 30 }],
      });

      expect(prismaMock.objective.update).toHaveBeenCalledWith({
        where: { id: 'obj-1' },
        data: {
          title: 'New title',
          keyResults: {
            deleteMany: {},
            create: [{ description: 'KR', progress: 30 }],
          },
        },
        include: { keyResults: true },
      });
      expect(result.id).toBe('obj-1');
    });

    it('should clear key results when none provided', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.objective.update.mockResolvedValue({ id: 'obj-1' });

      await service.update('obj-1', { title: 'Only title', keyResults: [] });

      expect(prismaMock.objective.update).toHaveBeenCalledWith({
        where: { id: 'obj-1' },
        data: {
          title: 'Only title',
          keyResults: {
            deleteMany: {},
            create: [],
          },
        },
        include: { keyResults: true },
      });
    });
  });

  describe('delete', () => {
    it('should delete objective', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.objective.delete.mockResolvedValue({ id: 'obj-1' });

      const result = await service.delete('obj-1');

      expect(result.id).toBe('obj-1');
    });

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(service.delete('obj-x')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(prismaMock.objective.delete).not.toHaveBeenCalled();
    });
  });
});
