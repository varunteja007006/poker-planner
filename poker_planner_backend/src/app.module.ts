import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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

//entities
import { User as UserEntities } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.database,
      entities: [UserEntities],
      synchronize: true,
    }),
    UsersModule,
    RoomsModule,
    TeamsModule,
    ClientsModule,
    StoriesModule,
    StoryPointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
