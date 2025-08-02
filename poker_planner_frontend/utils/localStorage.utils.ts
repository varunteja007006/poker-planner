"use client";

import { Room } from "@/types/room.types";
import { User } from "@/types/user.types";

const USER = "user";

const ROOM = "room";

export const clearLocalStorage = (): void => {
  removeUserFromLocalStorage();
  removeRoomFromLocalStorage();
  // localStorage.clear() // ! Maybe we do not want to reset users preferences
};

export const setUserInLocalStorage = (user: User): void => {
  localStorage.setItem(USER, JSON.stringify(user));
};

export const getUserFromLocalStorage = (): User | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }
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
  if (typeof localStorage === "undefined") {
    return null;
  }
  const room = localStorage.getItem(ROOM);
  return room ? JSON.parse(room) : null;
};

export const removeRoomFromLocalStorage = (): void => {
  localStorage.removeItem(ROOM);
};
