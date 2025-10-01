import { useParams } from "react-router";
import CopyBtn from "../atoms/CopyBtn";
import { Button } from "../ui/button";
import { Copy } from "lucide-react";

export default function PokerBoard() {
  const params = useParams();
  const roomCOde = params?.roomCode ?? "";

  return (
    <div className="p-2 flex flex-col gap-4 w-full">
      <div className="w-full flex justify-end gap-2 items-center">
        <Button variant={"secondary"}>View Results</Button>
        <Button variant={"destructive"}>Leave Room</Button>
        <CopyBtn text={roomCOde}>
          <Copy className="mr-2" />
          Copy Room Code
        </CopyBtn>
      </div>
      <div className="w-full">
        <div>
          Board
          <div>Cards</div>
        </div>
        <div>participants</div>
      </div>
    </div>
  );
}
