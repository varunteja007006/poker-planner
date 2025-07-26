import React from "react";

import { User } from "@/types/user.types";
import {
  getRoomFromLocalStorage,
  getUserFromLocalStorage,
  setRoomInLocalStorage,
  setUserInLocalStorage,
} from "@/utils/localStorage.utils";
import { usePathname, useRouter } from "next/navigation";
import { Room } from "@/types/room.types";
import { Team } from "@/types/team.types";

interface AppContextType {
  user: User | null;
  handleSetUser: (user: User | null) => void;
  room: Room | null;
  handleSetRoom: (room: Room | null) => void;
  userTeam: Team | null;
  handleSetUserTeam: (team: Team | null) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

// To manage the user and room created. Store in context and local storage.

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = React.useState<User | null>(null);
  const [room, setRoom] = React.useState<Room | null>(null);
  const [userTeam, setUserTeam] = React.useState<Team | null>(null);

  const handleSetUser = React.useCallback((user: User | null) => {
    if (user) {
      setUserInLocalStorage(user);
      setUser(user);
    }
  }, []);

  const handleSetRoom = React.useCallback((room: Room | null) => {
    if (room) {
      setRoomInLocalStorage(room);
      setRoom(room);
    }
  }, []);

  const handleSetUserTeam = React.useCallback((team: Team | null) => {
    if (team) {
      setUserTeam(team);
    }
  }, []);

  // To load the user from localstorage
  function loadUser() {
    const user = getUserFromLocalStorage();
    // if user is available from localstorage then set him
    if (user) {
      setUser(user);
    }
    // if the pathname is root and user exists from localstorage then we can redirect him to room directly
    if (pathname === "/" && user) {
      router.push("/room");
    }
    // if the pathname is room and user does not exist from localstorage then we can redirect him to root
    if (pathname !== "/" && !user) {
      router.push("/");
    }
  }

  // To load the room from localstorage
  function loadRoom() {
    const room = getRoomFromLocalStorage();
    // if room is available from localstorage then set it
    if (room) {
      setRoom(room);
    }
  }

  React.useEffect(() => {
    loadUser();
    loadRoom();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      handleSetUser,
      room,
      handleSetRoom,
      userTeam,
      handleSetUserTeam,
    }),
    [user, room, userTeam],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
