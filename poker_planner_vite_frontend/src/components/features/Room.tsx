import CreatedRoomList from "./room/CreatedRoomList";
import CreateRoom from "./room/CreateRoom";
import JoinedRoomList from "./room/JoinedRoomList";
import JoinRoom from "./room/JoinRoom";

export default function Room() {
  return (
    <div className="p-5 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 place-items-start">
        <CreateRoom />
        <JoinRoom />
      </div>
      <div className="space-y-6">
        <CreatedRoomList />
        <JoinedRoomList />
      </div>
    </div>
  );
}
