import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { PrismaService } from '../lib/prisma.service';
import { vi } from 'vitest';

describe('KeyResultService', () => {
  let service: KeyResultService;
  let prisma: {
    keyResult: {
      findUnique: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      keyResult: {
        findUnique: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyResultService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<KeyResultService>(KeyResultService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* -------------------------------------------------- */
  /* GET BY ID */
  /* -------------------------------------------------- */

  describe('getById', () => {
    it('should return key result when found', async () => {
      const mockKeyResult = {
        id: 'kr-1',
        progress: 50,
        isCompleted: false,
      };

      prisma.keyResult.findUnique.mockResolvedValue(mockKeyResult);

      const result = await service.getById('kr-1');

      expect(result).toEqual(mockKeyResult);
      expect(prisma.keyResult.findUnique).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.getById('kr-404')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  /* -------------------------------------------------- */
  /* DELETE */
  /* -------------------------------------------------- */

  describe('deleteById', () => {
    it('should delete key result when exists', async () => {
      prisma.keyResult.findUnique.mockResolvedValue({ id: 'kr-1' });

      prisma.keyResult.delete.mockResolvedValue({ id: 'kr-1' });

      const result = await service.deleteById('kr-1');

      expect(prisma.keyResult.delete).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });

      expect(result).toEqual({ id: 'kr-1' });
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.deleteById('kr-404')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.keyResult.delete).not.toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------- */
  /* UPDATE PROGRESS */
  /* -------------------------------------------------- */

  describe('updateProgress', () => {
    it('should update progress and mark complete when progress is 100', async () => {
      prisma.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: false,
      });

      prisma.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        progress: 100,
        isCompleted: true,
      });

      const result = await service.updateProgress('kr-1', 100);

      expect(prisma.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          progress: 100,
          isCompleted: true,
        },
      });

      expect(result.isCompleted).toBe(true);
    });

    it('should update progress and mark incomplete when progress < 100', async () => {
      prisma.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: true,
      });

      prisma.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        progress: 10,
        isCompleted: false,
      });

      const result = await service.updateProgress('kr-1', 10);

      expect(prisma.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          progress: 10,
          isCompleted: false,
        },
      });

      expect(result.isCompleted).toBe(false);
    });

    it('should throw NotFoundException when key result does not exist', async () => {
      prisma.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.updateProgress('kr-404', 10)).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.keyResult.update).not.toHaveBeenCalled();
    });
  });

  /* -------------------------------------------------- */
  /* TOGGLE COMPLETE */
  /* -------------------------------------------------- */

  describe('toggleComplete', () => {
    it('should toggle from incomplete to complete', async () => {
      prisma.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: false,
      });

      prisma.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        isCompleted: true,
        progress: 100,
      });

      const result = await service.toggleComplete('kr-1');

      expect(prisma.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          isCompleted: true,
          progress: 100,
        },
      });

      expect(result.isCompleted).toBe(true);
      expect(result.progress).toBe(100);
    });

    it('should toggle from complete to incomplete', async () => {
      prisma.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: true,
      });

      prisma.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        isCompleted: false,
        progress: 0,
      });

      const result = await service.toggleComplete('kr-1');

      expect(prisma.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          isCompleted: false,
          progress: 0,
        },
      });

      expect(result.isCompleted).toBe(false);
      expect(result.progress).toBe(0);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.toggleComplete('kr-404')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.keyResult.update).not.toHaveBeenCalled();
    });
  });
});
