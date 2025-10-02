import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";

export function UserCard() {
  const { userToken } = useUserStore();

  const user = useQuery(
    api.user.getUserByToken,
    userToken ? { token: userToken } : "skip"
  );

  if (!userToken || !user?.success) {
    return null;
  }

  return (
    <div className="mr-5 flex flex-row items-center gap-2">
      <Avatar className="text-primary">
        <AvatarImage src={''} />
        <AvatarFallback>
          {user?.username?.split("").slice(0, 2).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-primary font-semibold capitalize">{user?.username}</p>
    </div>
  );
}
