import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';

import { extractToken } from 'src/utils/utils';
import { Repository } from 'typeorm';

import { Room } from 'src/rooms/entities/room.entity';
import { Team } from 'src/teams/entities/team.entity';
import {
  Story,
  STORY_POINT_EVALUATION_STATUSES,
} from 'src/stories/entities/story.entity';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
export class CommonGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,

    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(Story)
    private readonly storiesRepository: Repository<Story>,

    @InjectRepository(StoryPoint)
    private readonly storyPointsRepository: Repository<StoryPoint>,
  ) {}

  async checkToken(token: string | undefined): Promise<User> {
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const user_token = extractToken(token);

    const user = await this.usersRepository.findOne({
      where: { user_token },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'User not found',
        },
      );
    }

    return user;
  }

  @SubscribeMessage('common:check')
  check(@ConnectedSocket() socket: Socket) {
    this.server.emit('common:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'common ws ok',
      },
    });
  }

  @SubscribeMessage('common:room-metadata')
  async roomMetadata(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    body: { room_code?: string; user_token?: string; story_id?: string },
  ) {
    if (!body.room_code || !body.user_token) {
      return;
    }

    const user = await this.checkToken(body.user_token);

    const room = await this.roomsRepository.findOne({
      relations: {
        created_by: true,
        updated_by: true,
      },
      where: { room_code: body.room_code },
    });

    const team = await this.teamsRepository.findOne({
      where: {
        room: { room_code: body.room_code },
        user: { user_token: body.user_token },
      },
    });

    const teamMembers = await this.teamsRepository.find({
      relations: {
        room: true,
        user: true,
      },
      where: {
        room: { room_code: body.room_code },
      },
      order: { room: { id: 'DESC' } },
    });

    let inProgressStories: Story[] | null = null;
    let inProgressStoryPoints: StoryPoint[] | null = null;

    if (body.story_id) {
      // find all stories in progress for this room

      const stories = await this.storiesRepository.find({
        where: {
          room: { room_code: body.room_code },
          story_point_evaluation_status:
            STORY_POINT_EVALUATION_STATUSES.IN_PROGRESS,
        },
      });

      inProgressStories = stories;

      const storyPoints = await this.storyPointsRepository.find({
        where: {
          story: { id: body.story_id ? Number(body.story_id) : undefined },
        },
        relations: {
          story: true,
          user: true,
        },
      });

      inProgressStoryPoints = storyPoints;
    }

    const result = {
      clientId: socket.id,
      user,
      room, // room user has joined
      team, // user's record from team
      teamMembers, // all the team members
      inProgressStories, // all the in-progress stories
      inProgressStory: inProgressStories?.[0] ?? null, // story in-progress for this room
      storyPoints: inProgressStoryPoints, // if already voted for the story
    };

    // emit to the whole room with callback
    this.server.to(body.room_code).emit('common:room-metadata-update', {
      clientId: result.clientId,
      teamMembers: result.teamMembers,
      inProgressStories: result.inProgressStories,
      inProgressStory: result.inProgressStory,
      storyPoints: result.storyPoints,
    });

    // if there is a callback for emit event it can receive this
    return result;
  }
}
