import { Outlet } from "react-router";

import { useUserStore } from "@/store/user.store";
import RegistrationDialog from "./user/RegistrationDialog";

export default function RoomWrapper() {
  const { userToken } = useUserStore();

  return (
    <div>
      <Outlet />
      <RegistrationDialog defaultOpen={!userToken} />
    </div>
  );
}
