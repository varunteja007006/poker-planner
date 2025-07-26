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
import { StoryPointsService } from 'src/story_points/story_points.service';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';

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

  constructor(
    private readonly storiesService: StoriesService,
    private readonly storyPointsService: StoryPointsService,
  ) {}

  @SubscribeMessage('stories:check')
  check(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
    this.server.emit('stories:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'stories ws ok',
        body: body,
      },
    });
  }

  @SubscribeMessage('stories:create')
  created(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    this.server.to(body.room.room_code).emit('stories:created', {
      clientId: socket.id,
      message: `${body.created_by.username} started poker session`,
      body,
    });
  }

  @SubscribeMessage('stories:update')
  async updated(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    const isCompleted = body.story_point_evaluation_status === 'completed';

    const message = isCompleted
      ? 'ended poker session'
      : 'started poker session';

    const storyPoints = isCompleted
      ? await this.storyPointsService.findAll(
          socket.handshake.auth.token,
          body.id.toString(),
        )
      : [];

    const groupByStoryPoint = storyPoints.reduce(
      (acc, storyPoint) => {
        if (!acc[storyPoint.story_point]) {
          acc[storyPoint.story_point] = 0;
        }
        acc[storyPoint.story_point] += 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    const averageStoryPoint =
      storyPoints.reduce((acc, storyPoint) => {
        return acc + storyPoint.story_point;
      }, 0) / storyPoints.length;

    if (!body.room?.room_code) {
      console.error('Room code is missing in the request body');
      return;
    }

    this.server.to(body.room.room_code).emit('stories:updated', {
      clientId: socket.id,
      message: `${body.created_by.username} ${message}`,
      body,
      storyPoints,
      groupByStoryPoint,
      averageStoryPoint,
    });
  }
}
