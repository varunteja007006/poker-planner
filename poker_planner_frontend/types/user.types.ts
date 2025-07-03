export interface User {
  id: number;
  username: string;
  user_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string;
  updated_by: string;
}
