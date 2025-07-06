import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { StoriesService } from './stories.service';

@WebSocketGateway({
  cors: {
    origin: process.env.WS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class StoriesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly storiesService: StoriesService) {}

  @SubscribeMessage('stories:check')
  check(@ConnectedSocket() socket: Socket) {
    // return this.storiesService.check();
    this.server.emit('stories:client:check', 'true');
  }
}
