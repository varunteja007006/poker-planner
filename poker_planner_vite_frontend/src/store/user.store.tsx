import React from "react";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export type User = ReturnType<typeof useQuery<typeof api.user.getUserByToken>>;

const userStore = React.createContext<{
  userToken: string;
  handleSetUserToken?: (token: string) => void;
  user: User;
}>({
  userToken: "",
  user: undefined,
});

export const UserStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userToken, setUserToken] = React.useState("");

  const user = useQuery(
    api.user.getUserByToken,
    userToken ? { token: userToken } : "skip"
  );

  const handleSetUserToken = React.useCallback(
    (token: string) => setUserToken(token),
    [setUserToken]
  );

  React.useEffect(() => {
    const token = localStorage.getItem("userToken") ?? "";
    if (token) {
      setUserToken(token);
    }
  }, []);

  const valueObj = React.useMemo(() => {
    return {
      userToken,
      handleSetUserToken,
      user,
    };
  }, [userToken, handleSetUserToken, user]);

  return <userStore.Provider value={valueObj}>{children}</userStore.Provider>;
};

export const useUserStore = () => {
  const context = React.useContext(userStore);

  if (!context) {
    throw new Error("User store should be within the provider");
  }

  return context;
};
