import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

import { TeamsService } from 'src/teams/teams.service';

import { Room } from './entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { RoomsGateway } from './rooms.gateway';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, TeamsService, RoomsGateway],
  imports: [TypeOrmModule.forFeature([Room, User, Team])],
})
export class RoomsModule {}
