import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { PrismaService } from '../prisma.service';

describe('KeyResultService', () => {
  let service: KeyResultService;
  const mockPrismaService = {
    keyResult: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeyResultService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<KeyResultService>(KeyResultService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should return key result when found', async () => {
      const mockKeyResult = {
        id: 'kr-1',
        progress: 50,
        isCompleted: false,
      };

      mockPrismaService.keyResult.findUnique.mockResolvedValue(mockKeyResult);

      const result = await service.getById('kr-1');

      expect(result).toEqual(mockKeyResult);
      expect(mockPrismaService.keyResult.findUnique).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });
    });

    it('should throw NotFoundException if key result not found', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.getById('kr-404')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteById', () => {
    it('should delete key result by id', async () => {
      mockPrismaService.keyResult.delete.mockResolvedValue({ id: 'kr-1' });

      const result = await service.deleteById('kr-1');

      expect(result).toEqual({ id: 'kr-1' });
      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
      });
    });

    it('should throw NotFoundException if key result not found', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.deleteById('kr-404')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.keyResult.delete).not.toHaveBeenCalled();
    });
  });

  describe('updateProgress', () => {
    it('should update progress and mark complete when progress is 100', async () => {
      mockPrismaService.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        progress: 100,
        isCompleted: true,
      });

      const result = await service.updateProgress('kr-1', 100);

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          progress: 100,
          isCompleted: true,
        },
      });

      expect(result.isCompleted).toBe(true);
    });

    it('should update progress and mark incomplete when progress is less than 100', async () => {
      mockPrismaService.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        progress: 10,
        isCompleted: false,
      });

      const result = await service.updateProgress('kr-1', 10);

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          progress: 10,
          isCompleted: false,
        },
      });

      expect(result.isCompleted).toBe(false);
    });

    it('should throw NotFoundException when updating non-existing key result', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue(null);

      const result = await service.updateProgress('kr-404', 10);

      await expect(result).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.keyResult.update).not.toHaveBeenCalled();
    });
  });

  describe('toggleComplete', () => {
    it('should toggle from incomplete to complete', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: false,
      });

      mockPrismaService.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        isCompleted: true,
        progress: 100,
      });

      const result = await service.toggleComplete('kr-1');

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: 'kr-1' },
        data: {
          isCompleted: true,
          progress: 100,
        },
      });

      expect(result.isCompleted).toBe(true);
    });

    it('should toggle from complete to incomplete', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue({
        id: 'kr-1',
        isCompleted: true,
      });

      mockPrismaService.keyResult.update.mockResolvedValue({
        id: 'kr-1',
        isCompleted: false,
        progress: 0,
      });

      const result = await service.toggleComplete('kr-1');

      expect(result.isCompleted).toBe(false);
      expect(result.progress).toBe(0);
    });

    it('should throw NotFoundException when toggling non-existing key result', async () => {
      mockPrismaService.keyResult.findUnique.mockResolvedValue(null);

      await expect(service.toggleComplete('kr-404')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
