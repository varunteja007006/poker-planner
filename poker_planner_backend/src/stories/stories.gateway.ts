import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { StoriesService } from './stories.service';
import { Story } from './entities/story.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
export class StoriesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly storiesService: StoriesService) {}

  @SubscribeMessage('stories:check')
  check(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { message: string },
  ) {
    this.server.emit('stories:checked', {
      clientId: socket.id,
      message: { connected: true, message: 'stories ws ok', body },
    });
  }

  @SubscribeMessage('stories:create')
  created(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    console.log(body);
    this.server.to(body.room.room_code).emit('stories:created', {
      clientId: socket.id,
      message: `${body.created_by.username} created a new story`,
      body,
    });
  }
}
