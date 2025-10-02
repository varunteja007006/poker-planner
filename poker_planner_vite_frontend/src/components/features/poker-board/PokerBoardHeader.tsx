import { Button } from "@/components/ui/button";

import { Copy } from "lucide-react";

import { Link, useParams } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import CopyBtn from "@/components/atoms/CopyBtn";

export default function PokerBoardHeader() {
  const params = useParams();
  const roomCode = params?.roomCode ?? "";
  const { userToken } = useUserStore();

  const roomDetails = useQuery(api.rooms.getRoomDetails, {
    roomCode,
    userToken,
  });

  return (
    <div className="w-full flex justify-between gap-2 items-center">
      <div>
        <p className="font-semibold text-lg">{roomDetails?.room?.room_name}</p>
      </div>
      <div className="flex flex-row items-center gap-2 justify-end">
        <Link to={"/room"}>
          <Button variant={"destructive"} className="cursor-pointer">
            Leave Room
          </Button>
        </Link>
        <CopyBtn text={roomCode}>
          <Copy className="mr-2" />
          Copy Room Code
        </CopyBtn>
      </div>
    </div>
  );
}
