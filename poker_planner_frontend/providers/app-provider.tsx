import React from "react";

import { User } from "@/types/user.types";
import {
  getUserFromLocalStorage,
  setUserInLocalStorage,
  performReset,
} from "@/utils/localStorage.utils";
import { usePathname, useRouter } from "next/navigation";
import {
  useCheckBackendHealth,
  useCheckDatabaseHealth,
} from "@/api/health/query";
import { useGetUserById } from "@/api/user/query";
import { toast } from "sonner";

interface AppContextType {
  user: User | null;
  handleSetUser: (user: User | null) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

// To manage the user and room created. Store in context and local storage.

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: backendHealth } = useCheckBackendHealth();
  const { data: databaseHealth } = useCheckDatabaseHealth();

  console.log("Backend Health:", backendHealth);
  console.log("Database Health:", databaseHealth);

  const [user, setUser] = React.useState<User | null>(null);
  const [shouldValidateUser, setShouldValidateUser] = React.useState<boolean>(false);
  const [userToValidate, setUserToValidate] = React.useState<User | null>(null);

  // Query to validate user existence in backend
  const { data: validatedUser, isError: isUserValidationError } = useGetUserById(
    userToValidate?.id || null,
    shouldValidateUser
  );

  const handleSetUser = React.useCallback((user: User | null) => {
    if (user) {
      setUserInLocalStorage(user);
      setUser(user);
    } else {
      setUser(null);
    }
  }, []);

  // To load the user from localstorage and validate with backend
  function loadUser() {
    const localUser = getUserFromLocalStorage();
    
    // if user is available from localstorage then validate with backend
    if (localUser) {
      setUserToValidate(localUser);
      setShouldValidateUser(true);
    }
    
    // if the pathname is room and user does not exist from localstorage then we can redirect him to root
    if (pathname !== "/" && !localUser) {
      router.push("/");
    }
  }

  // Handle user validation response
  React.useEffect(() => {
    if (shouldValidateUser && userToValidate) {
      if (isUserValidationError || !validatedUser) {
        // User not found in backend, clear localStorage and reset
        console.log("User not found in backend, performing reset...");
        toast.error("User session expired. Redirecting to home page.");
        performReset();
      } else {
        // User exists, set in state
        setUser(userToValidate);
        // if the pathname is root and user exists then redirect to room
        if (pathname === "/" && userToValidate) {
          router.push("/room");
        }
      }
      // Reset validation state
      setShouldValidateUser(false);
      setUserToValidate(null);
    }
  }, [shouldValidateUser, userToValidate, isUserValidationError, validatedUser, pathname, router]);

  React.useEffect(() => {
    loadUser();
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      handleSetUser,
    }),
    [user],
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
