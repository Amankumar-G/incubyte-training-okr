import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveService } from './objective.service';
import { PrismaService } from '../prisma.service';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';

describe('ObjectiveService', () => {
  let service: ObjectiveService;

  const prismaMock = {
    objective: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    keyResult: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
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
    jest.clearAllMocks();
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

  describe('getAllKeyResults', () => {
    it('should return all key results of objective', async () => {
      prismaMock.objective.findUnique.mockResolvedValue({ id: 'obj-1' });
      prismaMock.keyResult.findMany.mockResolvedValue([{ id: 'kr-1' }]);

      const result = await service.getAllKeyResults('obj-1');

      expect(result.length).toBe(1);
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

  const getMockObjective = (progress: number[]) => {
    return {
      id: 1,
      title: 'Objective 1',
      keyResults: progress.map((key, index) => ({
        id: index,
        description: '',
        progress: key,
        objectiveId: 1,
      })),
    };
  };

  describe('checkObjectiveCompleted', () => {
    it.each([
      {
        progress: [100, 100],
        msg: 'progress of every key result is 100',
        expected: true,
      },
      {
        progress: [99, 100],
        msg: 'progress of one key result is not 100',
        expected: false,
      },
      {
        progress: [],
        msg: 'key results list is empty',
        expected: false,
      },
    ])('should return $expected when $msg', async ({ progress, expected }) => {
      prismaMock.objective.findUnique.mockResolvedValue(
        getMockObjective(progress),
      );
      const averageProgress =
        progress.reduce((sum, key) => sum + key, 0) / progress.length || 0;

      const result = await service.checkObjectiveCompleted('obj-1');

      expect(result.is_completed).toBe(expected);
      expect(result.average_progress).toBe(averageProgress);
    });
  });
});
