import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { TeamsModule } from './teams/teams.module';
import { ClientsModule } from './clients/clients.module';
import { StoriesModule } from './stories/stories.module';
import { StoryPointsModule } from './story_points/story_points.module';

@Module({
  imports: [UsersModule, RoomsModule, TeamsModule, ClientsModule, StoriesModule, StoryPointsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
