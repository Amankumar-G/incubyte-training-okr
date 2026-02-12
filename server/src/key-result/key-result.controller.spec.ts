import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultController } from './key-result.controller';
import { KeyResultService } from './key-result.service';
import { PrismaService } from '../lib/prisma.service';

describe('KeyResultController', () => {
  let controller: KeyResultController;
  let service: KeyResultService;

  const mockPrismaService = {
    keyResult: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultController],
      providers: [
        KeyResultService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<KeyResultController>(KeyResultController);
    service = module.get<KeyResultService>(KeyResultService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests...
});
