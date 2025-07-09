import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { StoryPoint } from './entities/story_point.entity';
import { StoryPointsService } from './story_points.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
export class StoryPointsGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly storyPointsService: StoryPointsService) {}

  @SubscribeMessage('story-points:check')
  check(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
    let parsedBody: {
      message: string;
    } | null = null;

    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      console.log(error);
    }

    this.server.emit('story-points:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'story points ws ok',
        body: parsedBody?.message,
      },
    });
  }

  //   @SubscribeMessage('stories:create')
  //   created(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
  //     this.server.to(body.room.room_code).emit('stories:created', {
  //       clientId: socket.id,
  //       message: `${body.created_by.username} started poker session`,
  //       body,
  //     });
  //   }
  //   @SubscribeMessage('stories:update')
  //   updated(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
  //     const message =
  //       body.story_point_evaluation_status === 'completed'
  //         ? 'completed poker session'
  //         : 'in progress poker session';
  //     this.server.to(body.room.room_code).emit('stories:updated', {
  //       clientId: socket.id,
  //       message: `${body.created_by.username} ${message}`,
  //       body,
  //     });
  //   }
}
