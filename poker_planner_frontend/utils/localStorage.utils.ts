import { Room } from "@/types/room.types";
import { User } from "@/types/user.types";

const USER = "user";

const ROOM = "room";

export const setUserInLocalStorage = (user: User): void => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const getUserFromLocalStorage = (): User | null => {
  const user = localStorage.getItem(USER);
  return user ? JSON.parse(user) : null;
};

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem(USER);
};

export const setRoomInLocalStorage = (room: Room): void => {
  localStorage.setItem(ROOM, JSON.stringify(room));
};

export const getRoomFromLocalStorage = (): Room | null => {
  const room = localStorage.getItem(ROOM);
  return room ? JSON.parse(room) : null;
};

export const removeRoomFromLocalStorage = (): void => {
  localStorage.removeItem(ROOM);
};
