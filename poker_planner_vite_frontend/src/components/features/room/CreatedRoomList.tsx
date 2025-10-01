import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import RoomHistoryItem from "./RoomListItem";

export default function CreatedRoomList() {
  const { userToken } = useUserStore();
  const rooms = useQuery(
    api.rooms.getUserRooms,
    userToken ? { userToken } : "skip"
  );

  if (!userToken || !rooms?.success) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Created Rooms</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.rooms.length === 0 ? (
          <div className="text-base">No rooms created yet.</div>
        ) : null}

        {rooms.rooms.map((room) => (
          <RoomHistoryItem
            key={room._id}
            label={room.room_name}
            roomCode={room.room_code}
          />
        ))}
      </div>
    </div>
  );
}
