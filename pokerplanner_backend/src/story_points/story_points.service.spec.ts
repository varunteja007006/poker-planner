import { Test, TestingModule } from '@nestjs/testing';
import { StoryPointsService } from './story_points.service';

describe('StoryPointsService', () => {
  let service: StoryPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoryPointsService],
    }).compile();

    service = module.get<StoryPointsService>(StoryPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
