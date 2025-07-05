import { User } from "./user.types";

export interface Room {
  id: number;
  room_code: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  deleted_by: User | null;
  created_by: User;
  updated_by: User;
}
