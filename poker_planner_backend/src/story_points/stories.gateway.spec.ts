import { Test, TestingModule } from '@nestjs/testing';
import { StoryPointsGateway } from './story_points.gateway';
import { StoryPointsService } from './story_points.service';

describe('StoryPointsGateway', () => {
  let gateway: StoryPointsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryPointsGateway, StoryPointsService],
    }).compile();

    gateway = module.get<StoryPointsGateway>(StoryPointsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
