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
import { TeamsService } from './teams.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
export class TeamsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly teamService: TeamsService) {}

  @SubscribeMessage('teams:heart-beat')
  async teamsHeartBeat(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    body: {
      room_code: string;
      user_token: string;
      is_online: boolean;
    },
  ) {
    await this.teamService.updateHeartbeat(
      body.user_token,
      body.room_code,
      body.is_online,
    );

    const teams = await this.teamService.findAll(
      body.room_code,
      body.user_token,
    );

    this.server.emit('teams:team_updated', teams);
  }
}
