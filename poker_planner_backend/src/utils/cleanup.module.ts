import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './cleanup.service';
import { CleanupController } from './cleanup.controller';

// Import all entities that the cleanup service needs
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { Team } from '../teams/entities/team.entity';
import { Story } from '../stories/entities/story.entity';
import { Client } from '../clients/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Room,
      Team,
      Story,
      Client,
    ]),
  ],
  controllers: [CleanupController],
  providers: [CleanupService],
  exports: [CleanupService],
})
export class CleanupModule {}