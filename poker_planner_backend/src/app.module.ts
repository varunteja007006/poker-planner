import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config/configuration';

// modules
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { TeamsModule } from './teams/teams.module';
import { ClientsModule } from './clients/clients.module';
import { StoriesModule } from './stories/stories.module';
import { StoryPointsModule } from './story_points/story_points.module';
import { CommonModule } from './common/common.module';
import { CleanupModule } from './utils/cleanup.module';

//entities
import { User as UserEntities } from './users/entities/user.entity';
import { Client as ClientEntities } from './clients/entities/client.entity';
import { Room as RoomEntities } from './rooms/entities/room.entity';
import { Team as TeamEntities } from './teams/entities/team.entity';
import { Story as StoryEntities } from './stories/entities/story.entity';
import { StoryPoint as StoryPointEntities } from './story_points/entities/story_point.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [
        UserEntities,
        ClientEntities,
        RoomEntities,
        TeamEntities,
        StoryEntities,
        StoryPointEntities,
      ],
      synchronize: true,
    }),
    UsersModule,
    RoomsModule,
    TeamsModule,
    ClientsModule,
    StoriesModule,
    StoryPointsModule,
    CommonModule,
    CleanupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
