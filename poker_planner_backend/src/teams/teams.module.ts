import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';

import { Team } from './entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { TeamsGateway } from './teams.gateway';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, TeamsGateway],
  imports: [TypeOrmModule.forFeature([Team, User, Room])],
})
export class TeamsModule {}
