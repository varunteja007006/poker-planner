import { Headers } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
// import { StoriesService } from './stories.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  // constructor(private readonly storiesService: StoriesService) {}

  @SubscribeMessage('room:check')
  check(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { message: string },
  ) {
    this.server.emit('room:checked', {
      clientId: socket.id,
      message: { connected: true, message: 'room ws ok', body },
    });
  }

  @SubscribeMessage('room:join')
  join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { room_code: string; username: string },
  ) {
    if (!body.room_code) {
      return;
    }

    socket.join(body.room_code);

    let rooms: string[] = [];

    socket.rooms.forEach((room: string) => {
      rooms.push(room);
    });

    // emit to the whole room with callback
    this.server.to(body.room_code).emit('room:joined', {
      clientId: socket.id,
      message: `${body.username} joined the room`,
      rooms,
    });

    // if there is a callback for emit event it can receive this
    return {
      clientId: socket.id,
      message: `${body.username} joined the room`,
      rooms,
    };
  }
}
