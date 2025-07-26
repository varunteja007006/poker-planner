import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

import { TeamsService } from 'src/teams/teams.service';
import { StoriesService } from 'src/stories/stories.service';
import { StoryPointsService } from 'src/story_points/story_points.service';

import { Room } from './entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Story } from 'src/stories/entities/story.entity';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';

import { RoomsGateway } from './rooms.gateway';

@Module({
  controllers: [RoomsController],
  providers: [
    RoomsService,
    TeamsService,
    RoomsGateway,
    StoriesService,
    StoryPointsService,
  ],
  imports: [TypeOrmModule.forFeature([Room, User, Team, Story, StoryPoint])],
})
export class RoomsModule {}
