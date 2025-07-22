import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryDto } from './create-story.dto';
import { StoryPointEvaluationStatus } from '../entities/story.entity';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {
  title?: string;
  description?: string;
  finalized_story_points?: number;
  story_point_evaluation_status?: StoryPointEvaluationStatus;
}
