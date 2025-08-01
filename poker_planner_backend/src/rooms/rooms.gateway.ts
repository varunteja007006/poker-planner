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
import { RoomsService } from './rooms.service';
import { TeamsService } from 'src/teams/teams.service';
import { StoriesService } from 'src/stories/stories.service';
import {
  Story,
  STORY_POINT_EVALUATION_STATUSES,
} from 'src/stories/entities/story.entity';
import { StoryPointsService } from 'src/story_points/story_points.service';
import { Team } from 'src/teams/entities/team.entity';

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

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly roomsService: RoomsService,

    private readonly teamsService: TeamsService,

    private readonly storiesService: StoriesService,

    private readonly storyPointsService: StoryPointsService,
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

  @SubscribeMessage('room:check')
  check(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
    this.server.emit('room:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'room ws ok',
        body: body,
      },
    });
  }

  @SubscribeMessage('room:join')
  async join(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: { room_code: string; user_token: string },
  ) {
    if (!body.room_code || !body.user_token) {
      return;
    }
    const user = await this.checkToken(body.user_token);

    const room = await this.roomsService.findAll(body.room_code);

    let result: {
      clientId: string;
      message: string;
      success: boolean;
      myTeamRecord: Team | null;
    };

    result = {
      clientId: socket.id,
      message: `room does not exist`,
      success: false,
      myTeamRecord: null, // inserted team record
    };

    if (!room || room.length === 0) {
      return result;
    }

    socket.join(body.room_code);

    const team = await this.teamsService.create(
      {
        room_code: body.room_code,
      },
      body.user_token,
    );

    result = {
      clientId: socket.id,
      message: `room joined successfully`,
      success: true,
      myTeamRecord: team,
    };

    this.server.to(body.room_code).emit('room:joined');
    return result;
  }
}
