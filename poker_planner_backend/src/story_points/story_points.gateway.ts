import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { StoryPointsService } from './story_points.service';
import { StoryPoint } from './entities/story_point.entity';
import { Story } from 'src/stories/entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class StoryPointsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private storyPointsService: StoryPointsService,

    @InjectRepository(StoryPoint)
    private storyPointsRepository: Repository<StoryPoint>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  @SubscribeMessage('story-points:check')
  check(@ConnectedSocket() socket: Socket) {
    this.server.emit('story-points:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'story points ws ok',
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
    // create token by calling the create service
    const storyPointCreated = await this.storyPointsService.create(
      {
        story_point: body.story_point,
        story_id: body.story_id,
      },
      body.token,
    );

    // using find all we will try to get the story points for particular story
    const storyPoints = await this.storyPointsRepository.find({
      where: { story: { id: body.story_id } },
      relations: {
        story: true,
        user: true,
      },
    });

    // send the newly created story point and all story points to the room
    this.server.to(body.room_code).emit('story-points:created', {
      clientId: socket.id,
      message: '',
      storyPoint: storyPointCreated,
      storyPoints,
    });

    return storyPointCreated;
  }
}
