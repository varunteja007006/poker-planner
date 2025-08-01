import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Story } from './entities/story.entity';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
@Injectable()
export class StoriesGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(StoryPoint)
    private storyPointsRepository: Repository<StoryPoint>,
  ) {}

  @SubscribeMessage('stories:check')
  check(@ConnectedSocket() socket: Socket) {
    this.server.emit('stories:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'stories ws ok',
      },
    });
  }

  @SubscribeMessage('stories:create')
  created(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    this.server.to(body.room.room_code).emit('stories:created', {
      clientId: socket.id,
      message: `${body.created_by.username} started the game`,
      body,
    });
  }

  @SubscribeMessage('stories:update')
  async updated(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    const isCompleted = body.story_point_evaluation_status === 'completed';

    const message = isCompleted ? 'ended game' : 'started game';

    let storyPoints = await this.storyPointsRepository.find({
      where: { story: { id: body.id } },
      relations: {
        story: true,
        user: true,
      },
    });

    // if storyPoints is not an array or is empty, set it to an empty array
    if (!storyPoints || !Array.isArray(storyPoints)) {
      storyPoints = [];
    }

    // key is the story point number and value is the count
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

    // average story point
    const averageStoryPoint =
      storyPoints.reduce((acc, storyPoint) => {
        return acc + storyPoint.story_point;
      }, 0) / storyPoints.length;

    if (!body.room?.room_code) {
      console.error('Room code is missing in the request body');
      return;
    }

    // emit the updated story to the room
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
