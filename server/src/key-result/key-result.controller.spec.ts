import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultController } from './key-result.controller';

describe('KeyResultController', () => {
  let controller: KeyResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultController],
    }).compile();

    controller = module.get<KeyResultController>(KeyResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
