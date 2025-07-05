import { Room } from "./room.types";
import { User } from "./user.types";

export interface Team {
  id: number;
  user: User;
  room: Room;
  is_room_owner: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: User;
  updated_by: User;
  deleted_by: User | null;
}
