import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from './entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { StoriesGateway } from './stories.gateway';
import { StoryPointsService } from 'src/story_points/story_points.service';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, StoriesGateway, StoryPointsService],
  imports: [TypeOrmModule.forFeature([Story, User, Room, StoryPoint])],
})
export class StoriesModule {}
