import { Room } from "./room.types";
import { User } from "./user.types";

export type StoryPointEvaluationStatus =
  | "pending"
  | "in progress"
  | "completed";

export interface Story {
  id: number;
  title: string;
  description: string;
  finalized_story_points: number | null;
  story_point_evaluation_status: StoryPointEvaluationStatus;
  room: Room;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: User;
  updated_by: User;
}
