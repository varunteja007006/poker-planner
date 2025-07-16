import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
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
    this.server.emit('story-points:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'story points ws ok',
        body: body,
      },
    });
  }

  @SubscribeMessage('story-points:create')
  async created(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    body: {
      story_point: number;
      story_id: number;
      room_code: string;
    } & { token: string | undefined },
  ) {
    const storyPointCreated = await this.storyPointsService.create(
      {
        story_point: body.story_point,
        story_id: body.story_id,
      },
      body.token,
    );

    socket.emit('story-points:private:created', {
      clientId: socket.id,
      message: 'Story point saved!!!',
      body: storyPointCreated,
    });

    // ! This should  send all the story points
    this.server.to(body.room_code).emit('story-points:created', {
      clientId: socket.id,
      message: '',
      body: storyPointCreated,
    });
  }
}
