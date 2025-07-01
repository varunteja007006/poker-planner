import { Module } from '@nestjs/common';
import { StoryPointsService } from './story_points.service';
import { StoryPointsController } from './story_points.controller';

@Module({
  controllers: [StoryPointsController],
  providers: [StoryPointsService],
})
export class StoryPointsModule {}
