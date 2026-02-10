import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveController } from './objective.controller';

describe('ObjectiveController', () => {
  let controller: ObjectiveController;
  const objectiveServiceMock = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectiveController],
      providers: [
        {
          provide: 'ObjectiveService',
          useValue: objectiveServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ObjectiveController>(ObjectiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call objective service update method', async () => {
    const updateObjectiveDto = {
      title: 'Updated Objective',
      description: 'Updated description',
      keyResults: [],
    };

    const objectiveId = 'some-uuid';
    objectiveServiceMock.update.mockResolvedValue(updateObjectiveDto);

    const result = await controller.update(objectiveId, updateObjectiveDto);

    expect(objectiveServiceMock.update).toHaveBeenCalledWith(
      objectiveId,
      updateObjectiveDto,
    );
  });
});
