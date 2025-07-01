import { Test, TestingModule } from '@nestjs/testing';
import { StoryPointsController } from './story_points.controller';
import { StoryPointsService } from './story_points.service';

describe('StoryPointsController', () => {
  let controller: StoryPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoryPointsController],
      providers: [StoryPointsService],
    }).compile();

    controller = module.get<StoryPointsController>(StoryPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
