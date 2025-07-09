import { Module } from '@nestjs/common';
import { StoryPointsService } from './story_points.service';
import { StoryPointsController } from './story_points.controller';
import { StoryPointsGateway } from './story_points.gateway';
import { StoryPoint } from './entities/story_point.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StoryPointsController],
  providers: [StoryPointsService, StoryPointsGateway],
  imports: [TypeOrmModule.forFeature([StoryPoint])],
})
export class StoryPointsModule {}
