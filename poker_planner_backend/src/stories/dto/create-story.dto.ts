import { StoryPointEvaluationStatus } from "../entities/story.entity";

export class CreateStoryDto {
  title: string;
  description: string;
  room_code: string;
  story_point_evaluation_status?: StoryPointEvaluationStatus;
}
