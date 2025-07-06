import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { Story } from './entities/story.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService],
  imports: [TypeOrmModule.forFeature([Story, User, Room])],
})
export class StoriesModule {}
