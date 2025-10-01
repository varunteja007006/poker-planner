import React from "react";

const userStore = React.createContext({
  userToken: "",
  handleSetUserToken: (token: string) => {},
});

export const UserStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userToken, setUserToken] = React.useState("");

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
    };
  }, [userToken, handleSetUserToken]);

  return <userStore.Provider value={valueObj}>{children}</userStore.Provider>;
};

export const useUserStore = () => {
  const context = React.useContext(userStore);

  if (!context) {
    throw new Error("User store should be within the provider");
  }

  return context;
};
