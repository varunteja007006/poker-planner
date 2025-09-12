import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

// Import all entities that have soft delete functionality
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { Team } from '../teams/entities/team.entity';
import { Story } from '../stories/entities/story.entity';
import { StoryPoint } from '../story_points/entities/story_point.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(StoryPoint)
    private readonly storyPointRepository: Repository<StoryPoint>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  /**
   * Aggressive cleanup cron job that runs daily at 3:00 AM
   * Since this is a collaborative fun space, we clean up aggressively
   * Cron expression: 0 3 star star star (daily at 3 AM)
   */
  @Cron('0 3 * * *', {
    name: 'daily-aggressive-cleanup',
    timeZone: 'UTC',
  })
  async performAggressiveDailyCleanup() {
    this.logger.log('Starting aggressive daily cleanup job...');
    
    try {
      // Clean up inactive rooms and their related data after 1 day
      await this.cleanupInactiveRooms();

      // Clean up soft-deleted records after just 1 day
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      this.logger.log(`Aggressively cleaning up records deleted before: ${oneDayAgo.toISOString()}`);

      await this.cleanupSoftDeletedRecords('Users', this.userRepository, oneDayAgo);
      await this.cleanupSoftDeletedRecords('Rooms', this.roomRepository, oneDayAgo);
      await this.cleanupSoftDeletedRecords('Teams', this.teamRepository, oneDayAgo);
      await this.cleanupSoftDeletedRecords('Stories', this.storyRepository, oneDayAgo);
      await this.cleanupSoftDeletedRecords('StoryPoints', this.storyPointRepository, oneDayAgo);
      await this.cleanupSoftDeletedRecords('Clients', this.clientRepository, oneDayAgo);

      // Clean up inactive sessions after 2 hours
      await this.cleanupInactiveClients(2);

      this.logger.log('Aggressive daily cleanup job completed successfully');
    } catch (error) {
      this.logger.error('Aggressive daily cleanup job failed:', error);
    }
  }

  /**
   * Hourly cleanup for very short-term data
   * Runs every hour to keep the database lean
   */
  @Cron('0 * * * *', {
    name: 'hourly-cleanup',
    timeZone: 'UTC',
  })
  async performHourlyCleanup() {
    this.logger.log('Starting hourly cleanup job...');
    
    try {
      // Clean up very old client sessions (older than 30 minutes of inactivity)
      await this.cleanupInactiveClients(0.5);
      
      // Clean up completed stories and their points after 6 hours
      await this.cleanupCompletedStories();

      this.logger.log('Hourly cleanup job completed successfully');
    } catch (error) {
      this.logger.error('Hourly cleanup job failed:', error);
    }
  }

  /**
   * Original weekly cleanup for any remaining data
   * Cron expression: 0 2 star star 0 (every Sunday at 2 AM)
   */
  @Cron('0 2 * * 0', {
    name: 'weekly-deep-cleanup',
    timeZone: 'UTC',
  })
  async performWeeklyDeepCleanup() {
    this.logger.log('Starting weekly deep cleanup job...');
    
    try {
      // Clean up everything older than 7 days (final safety net)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      this.logger.log(`Deep cleaning all records older than: ${oneWeekAgo.toISOString()}`);

      // Clean up all old records regardless of delete status
      await this.deepCleanupAllRecords(oneWeekAgo);

      this.logger.log('Weekly deep cleanup job completed successfully');
    } catch (error) {
      this.logger.error('Weekly deep cleanup job failed:', error);
    }
  }

  /**
   * Generic method to clean up soft-deleted records
   */
  private async cleanupSoftDeletedRecords(
    entityName: string,
    repository: Repository<any>,
    cutoffDate: Date,
  ): Promise<void> {
    try {
      const result = await repository
        .createQueryBuilder()
        .delete()
        .where('deleted_at IS NOT NULL')
        .andWhere('deleted_at < :cutoffDate', { cutoffDate })
        .execute();

      this.logger.log(`${entityName}: Permanently deleted ${result.affected || 0} soft-deleted records`);
    } catch (error) {
      this.logger.error(`Failed to cleanup ${entityName}:`, error);
    }
  }

  /**
   * Clean up inactive client sessions
   */
  private async cleanupInactiveClients(hoursThreshold: number = 24): Promise<void> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setHours(thresholdDate.getHours() - hoursThreshold);

      const result = await this.clientRepository
        .createQueryBuilder()
        .delete()
        .where('is_active = :isActive', { isActive: false })
        .andWhere('updated_at < :cutoffDate', { cutoffDate: thresholdDate })
        .execute();

      this.logger.log(`Clients: Removed ${result.affected || 0} inactive client sessions (older than ${hoursThreshold} hours)`);
    } catch (error) {
      this.logger.error('Failed to cleanup inactive clients:', error);
    }
  }

  /**
   * Clean up inactive rooms and their related data
   */
  private async cleanupInactiveRooms(): Promise<void> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Find rooms that haven't had any activity in the last day
      const inactiveRooms = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoin('room.teams', 'team')
        .where('room.updated_at < :cutoffDate', { cutoffDate: oneDayAgo })
        .andWhere('(team.last_active IS NULL OR team.last_active < :cutoffDate)', { cutoffDate: oneDayAgo })
        .getMany();

      for (const room of inactiveRooms) {
        // Soft delete the room (sets deleted_at)
        await this.roomRepository.update(room.id, { 
          deleted_at: new Date(),
          is_active: false 
        });
      }

      this.logger.log(`Rooms: Soft-deleted ${inactiveRooms.length} inactive rooms`);
    } catch (error) {
      this.logger.error('Failed to cleanup inactive rooms:', error);
    }
  }

  /**
   * Clean up completed stories and their story points
   */
  private async cleanupCompletedStories(): Promise<void> {
    try {
      const sixHoursAgo = new Date();
      sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

      // Find completed stories older than 6 hours
      const completedStories = await this.storyRepository
        .createQueryBuilder('story')
        .where('story.story_point_evaluation_status = :status', { status: 'completed' })
        .andWhere('story.updated_at < :cutoffDate', { cutoffDate: sixHoursAgo })
        .getMany();

      for (const story of completedStories) {
        // Soft delete the story
        await this.storyRepository.update(story.id, { 
          deleted_at: new Date(),
          is_active: false 
        });

        // Clean up associated story points
        await this.storyPointRepository
          .createQueryBuilder()
          .update()
          .set({ 
            deleted_at: new Date(),
            is_active: false 
          })
          .where('story = :storyId', { storyId: story.id })
          .execute();
      }

      this.logger.log(`Stories: Soft-deleted ${completedStories.length} completed stories and their story points`);
    } catch (error) {
      this.logger.error('Failed to cleanup completed stories:', error);
    }
  }

  /**
   * Deep cleanup that removes all old records regardless of status
   */
  private async deepCleanupAllRecords(cutoffDate: Date): Promise<void> {
    try {
      const tables = [
        { name: 'StoryPoints', repository: this.storyPointRepository },
        { name: 'Stories', repository: this.storyRepository },
        { name: 'Teams', repository: this.teamRepository },
        { name: 'Clients', repository: this.clientRepository },
        { name: 'Rooms', repository: this.roomRepository },
        { name: 'Users', repository: this.userRepository },
      ];

      for (const table of tables) {
        const result = await table.repository
          .createQueryBuilder()
          .delete()
          .where('created_at < :cutoffDate', { cutoffDate })
          .execute();

        this.logger.log(`${table.name}: Deep cleaned ${result.affected || 0} old records`);
      }
    } catch (error) {
      this.logger.error('Failed to perform deep cleanup:', error);
    }
  }

  /**
   * Manual cleanup method for testing or administrative purposes
   */
  async manualCleanup(): Promise<void> {
    this.logger.log('Manual cleanup initiated...');
    await this.performAggressiveDailyCleanup();
  }

  /**
   * 💥 NUCLEAR CLEANUP 💥
   * Deletes ALL records regardless of age or status - ULTIMATE RESET!
   */
  async nuclearCleanup(): Promise<void> {
    this.logger.warn('🚨 NUCLEAR CLEANUP INITIATED - DELETING ALL DATA! 🚨');
    
    try {
      const tables = [
        { name: 'StoryPoints', repository: this.storyPointRepository },
        { name: 'Stories', repository: this.storyRepository },
        { name: 'Teams', repository: this.teamRepository },
        { name: 'Clients', repository: this.clientRepository },
        { name: 'Rooms', repository: this.roomRepository },
        { name: 'Users', repository: this.userRepository },
      ];

      let totalDeleted = 0;

      for (const table of tables) {
        this.logger.warn(`💣 Obliterating ALL ${table.name} records...`);
        
        const result = await table.repository
          .createQueryBuilder()
          .delete()
          .execute(); // No WHERE clause = DELETE EVERYTHING!

        const deletedCount = result.affected || 0;
        totalDeleted += deletedCount;
        
        this.logger.warn(`💥 ${table.name}: ${deletedCount} records VAPORIZED!`);
      }

      this.logger.warn(`🔥 NUCLEAR CLEANUP COMPLETE: ${totalDeleted} total records OBLITERATED! 🔥`);
      this.logger.warn('🧹 Database is now completely clean - fresh start achieved!');
      
    } catch (error) {
      this.logger.error('💀 Nuclear cleanup failed - some data survived the blast:', error);
      throw error;
    }
  }

  /**
   * 🎯 Get nuclear cleanup statistics - shows ALL records that would be deleted
   */
  async getNuclearStats(): Promise<{
    totalRecords: Record<string, number>;
    grandTotal: number;
  }> {
    try {
      const [
        userCount,
        roomCount,
        teamCount,
        storyCount,
        storyPointCount,
        clientCount,
      ] = await Promise.all([
        this.userRepository.count(),
        this.roomRepository.count(),
        this.teamRepository.count(),
        this.storyRepository.count(),
        this.storyPointRepository.count(),
        this.clientRepository.count(),
      ]);

      const totalRecords = {
        users: userCount,
        rooms: roomCount,
        teams: teamCount,
        stories: storyCount,
        storyPoints: storyPointCount,
        clients: clientCount,
      };

      const grandTotal = Object.values(totalRecords).reduce((sum, count) => sum + count, 0);

      this.logger.warn(`💣 Nuclear preview: ${grandTotal} total records would be OBLITERATED!`);

      return {
        totalRecords,
        grandTotal,
      };
    } catch (error) {
      this.logger.error('Failed to get nuclear statistics:', error);
      throw error;
    }
  }

  /**
   * Get cleanup statistics without performing cleanup
   */
  async getCleanupStatistics(): Promise<{
    softDeletedCounts: Record<string, number>;
    inactiveClientCount: number;
    completedStoriesCount: number;
    inactiveRoomsCount: number;
  }> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const twoHoursAgo = new Date();
    twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    try {
      const [
        userCount,
        roomCount,
        teamCount,
        storyCount,
        storyPointCount,
        clientCount,
        inactiveClientCount,
        completedStoriesCount,
        inactiveRoomsCount,
      ] = await Promise.all([
        this.userRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.roomRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.teamRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.storyRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.storyPointRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.clientRepository.count({
          where: { 
            deleted_at: LessThan(oneDayAgo),
          },
        }),
        this.clientRepository.count({
          where: {
            is_active: false,
            updated_at: LessThan(twoHoursAgo),
          },
        }),
        this.storyRepository.count({
          where: {
            story_point_evaluation_status: 'completed',
            updated_at: LessThan(sixHoursAgo),
          },
        }),
        this.roomRepository
          .createQueryBuilder('room')
          .leftJoin('room.teams', 'team')
          .where('room.updated_at < :cutoffDate', { cutoffDate: oneDayAgo })
          .andWhere('(team.last_active IS NULL OR team.last_active < :cutoffDate)', { cutoffDate: oneDayAgo })
          .getCount(),
      ]);

      return {
        softDeletedCounts: {
          users: userCount,
          rooms: roomCount,
          teams: teamCount,
          stories: storyCount,
          storyPoints: storyPointCount,
          clients: clientCount,
        },
        inactiveClientCount,
        completedStoriesCount,
        inactiveRoomsCount,
      };
    } catch (error) {
      this.logger.error('Failed to get cleanup statistics:', error);
      throw error;
    }
  }
}