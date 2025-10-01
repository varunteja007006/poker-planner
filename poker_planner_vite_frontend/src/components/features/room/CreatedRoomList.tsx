import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUserStore } from "@/store/user.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export default function CreatedRoomList() {
  const { userToken } = useUserStore();
  const navigate = useNavigate();

  const rooms = useQuery(
    api.rooms.getUserRooms,
    userToken ? { userToken } : "skip"
  );

  if (!userToken || !rooms?.success) {
    return null;
  }

  if (rooms.rooms.length === 0) {
    return <div>No rooms created yet.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Created Rooms</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.rooms.map((room) => (
          <Card key={room._id}>
            <CardHeader>
              <CardTitle>{room.room_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Code: {room.room_code}</p>
              <Button onClick={() => navigate(`/room/${room.room_code}`)}>
                Go to Room
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
