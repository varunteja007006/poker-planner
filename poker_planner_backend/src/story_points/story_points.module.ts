import { Module } from '@nestjs/common';
import { StoryPointsService } from './story_points.service';
import { StoryPointsController } from './story_points.controller';
import { StoryPointsGateway } from './story_points.gateway';
import { StoryPoint } from './entities/story_point.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Story } from 'src/stories/entities/story.entity';

@Module({
  controllers: [StoryPointsController],
  providers: [StoryPointsService, StoryPointsGateway],
  imports: [TypeOrmModule.forFeature([StoryPoint, User, Story])],
})
export class StoryPointsModule {}
