import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { CommonGateway } from './common.gateway';

import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Story } from 'src/stories/entities/story.entity';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';

@Module({
  controllers: [CommonController],
  providers: [CommonService, CommonGateway],
  imports: [TypeOrmModule.forFeature([Room, User, Team, Story, StoryPoint])],
})
export class CommonModule {}
