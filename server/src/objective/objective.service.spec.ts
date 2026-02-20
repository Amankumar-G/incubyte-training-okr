import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ObjectiveService } from './objective.service';
import { PrismaService } from '../lib/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { ObjectiveNotFoundException } from './exceptions/objective-not-found-exception';

describe('ObjectiveService', () => {
  let service: ObjectiveService;

  const prismaMock = {
    objective: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const geminiMock = {
    generateContent: vi.fn(),
  };

  const eventEmitterMock = {
    emit: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectiveService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: GeminiService, useValue: geminiMock },
        { provide: EventEmitter2, useValue: eventEmitterMock },
      ],
    }).compile();

    service = module.get<ObjectiveService>(ObjectiveService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const getMockObjective = (progressValues: number[]) => ({
    id: '1',
    title: 'Objective 1',
    keyResults: progressValues.map((progress, index) => ({
      id: `${index + 1}`,
      description: `KR${index + 1}`,
      progress,
    })),
  });

  describe('getAll', () => {
    it('should return all objectives with keyResults', async () => {
      const mockObjectives = [getMockObjective([100, 50])];

      prismaMock.objective.findMany.mockResolvedValue(mockObjectives);

      const result = await service.getAll();

      expect(prismaMock.objective.findMany).toHaveBeenCalledWith({
        include: { keyResults: true },
      });

      expect(result).toEqual(mockObjectives);
    });
  });

  describe('getById', () => {
    it('should return objective when found', async () => {
      const mockObjective = getMockObjective([100]);
      prismaMock.objective.findUnique
        .mockResolvedValueOnce(mockObjective)
        .mockResolvedValueOnce(mockObjective);

      const result = await service.getById('1');

      expect(result).toEqual(mockObjective);
    });

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(service.getById('999')).rejects.toThrow(
        ObjectiveNotFoundException,
      );
    });
  });

  // ===============================
  // CREATE
  // ===============================
  describe('create', () => {
    it('should create objective and emit event', async () => {
      const created = getMockObjective([50]);

      prismaMock.objective.create.mockResolvedValue(created);

      const result = await service.create({
        title: 'New Objective',
        keyResults: [{ description: 'KR1', progress: 50 }],
      });

      expect(prismaMock.objective.create).toHaveBeenCalled();
      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        'okr.changed',
        created,
      );
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update objective and emit event', async () => {
      const existing = getMockObjective([50]);
      const updated = getMockObjective([100]);

      prismaMock.objective.findUnique.mockResolvedValue(existing);
      prismaMock.objective.update.mockResolvedValue(updated);

      const result = await service.update('1', {
        title: 'Updated',
        keyResults: [{ description: 'KR1', progress: 100 }],
      });

      expect(prismaMock.objective.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated',
          keyResults: {
            deleteMany: {},
            create: [{ description: 'KR1', progress: 100 }],
          },
        },
        include: { keyResults: true },
      });

      expect(eventEmitterMock.emit).toHaveBeenCalledWith(
        'okr.changed',
        updated,
      );

      expect(result).toEqual(updated);
    });

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid', {
          title: 'Test',
          keyResults: [],
        }),
      ).rejects.toThrow(ObjectiveNotFoundException);

      expect(prismaMock.objective.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete objective when found', async () => {
      const existing = getMockObjective([50]);

      prismaMock.objective.findUnique.mockResolvedValue(existing);
      prismaMock.objective.delete.mockResolvedValue(existing);

      const result = await service.delete('1');

      expect(prismaMock.objective.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { keyResults: true },
      });

      expect(result).toEqual(existing);
    });

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(prismaMock.objective.delete).not.toHaveBeenCalled();
    });
  });

  describe('checkObjectiveCompleted', () => {
    it.each([
      {
        progressValues: [],
        expected: { isCompleted: false, average_progress: 0 },
      },
      {
        progressValues: [100, 100],
        expected: { isCompleted: true, average_progress: 100 },
      },
      {
        progressValues: [100, 50],
        expected: { isCompleted: false, average_progress: 75 },
      },
    ])(
      'should calculate completion correctly',
      async ({ progressValues, expected }) => {
        prismaMock.objective.findUnique.mockResolvedValue(
          getMockObjective(progressValues),
        );

        const result = await service.checkObjectiveCompleted('1');
        expect(result).toEqual(expected);
      },
    );

    it('should throw if objective not found', async () => {
      prismaMock.objective.findUnique.mockResolvedValue(null);

      await expect(service.checkObjectiveCompleted('1')).rejects.toThrow(
        ObjectiveNotFoundException,
      );
    });
  });
});
