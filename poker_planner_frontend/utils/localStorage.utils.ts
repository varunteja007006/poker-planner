"use client";

import { Room } from "@/types/room.types";
import { Team } from "@/types/team.types";
import { Story } from "@/types/story.types";
import { User } from "@/types/user.types";

const USER = "user";

const ROOM = "room";

const TEAM = "team";

const STORY = "story";

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

export const setTeamInLocalStorage = (team: Team): void => {
  localStorage.setItem(TEAM, JSON.stringify(team));
};

export const getTeamFromLocalStorage = (): Team | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const team = localStorage.getItem(TEAM);
  return team ? JSON.parse(team) : null;
};

export const removeTeamFromLocalStorage = (): void => {
  localStorage.removeItem(TEAM);
};

export const setStoryInLocalStorage = (story: Story): void => {
  localStorage.setItem(STORY, JSON.stringify(story));
};

export const getStoryFromLocalStorage = (): Story | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const story = localStorage.getItem(STORY);
  return story ? JSON.parse(story) : null;
};

export const removeStoryFromLocalStorage = (): void => {
  localStorage.removeItem(STORY);
};
