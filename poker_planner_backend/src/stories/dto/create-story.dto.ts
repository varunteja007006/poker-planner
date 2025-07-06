export class CreateStoryDto {
  title: string;
  description: string;
  room_code: string;
  story_point_evaluation_status?: 'pending' | 'in progress' | 'completed';
}
