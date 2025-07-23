import { Story } from "./story.types";
import { User } from "./user.types";

export interface StoryPoint {
  id: number;
  story_point: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by?: User;
  updated_by?: User;
  deleted_by?: User | null;
  story: Story;
  user: User;
}
