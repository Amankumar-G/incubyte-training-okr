import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveController } from './objective.controller';

describe('ObjectiveController', () => {
  let controller: ObjectiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectiveController],
    }).compile();

    controller = module.get<ObjectiveController>(ObjectiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
