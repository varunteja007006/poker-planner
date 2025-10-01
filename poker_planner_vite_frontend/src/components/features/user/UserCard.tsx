import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import { useLocation } from "react-router";
import RegistrationDialog from "./RegistrationDialog";

const avatars = [
  { name: "ape", path: "/ape.png" },
  { name: "bunny", path: "/bunny.png" },
  { name: "confused monkey", path: "/confused monkey.png" },
  { name: "dodge challenger", path: "/dodge challenger.png" },
  { name: "dolphin", path: "/dolphin.png" },
  { name: "gollum", path: "/gollum.png" },
  { name: "kingfisher", path: "/kingfisher.png" },
  { name: "lab", path: "/lab.png" },
  { name: "meercat", path: "/meercat.png" },
  { name: "moodeng", path: "/moodeng.png" },
  { name: "pup", path: "/pup.png" },
  { name: "spacemarine", path: "/spacemarine.png" },
  { name: "teddy", path: "/teddy.png" },
  { name: "wiz", path: "/wiz.png" },
];

export function UserCard() {
  const location = useLocation();
  const { userToken } = useUserStore();

  const [openDialog, setOpenDialog] = React.useState(false);

  const user = useQuery(
    api.user.getUserByToken,
    userToken ? { token: userToken } : "skip"
  );

  React.useEffect(() => {
    if (!user) {
      return;
    }

    if (location.pathname !== "/" && !user?.success && !openDialog) {
      setOpenDialog(true);
    }
  }, [user?.success, location]);

  if (!userToken || !user?.success) {
    return <RegistrationDialog defaultOpen={openDialog} />;
  }

  const avatar = avatars[Math.floor(Math.random() * avatars.length)];

  return (
    <div className="mr-5 flex flex-row items-center gap-2">
      <Avatar className="text-primary">
        <AvatarImage src={avatar.path} />
        <AvatarFallback>
          {user?.username?.split("").slice(0, 2).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="text-primary font-semibold capitalize">{user?.username}</p>
    </div>
  );
}
