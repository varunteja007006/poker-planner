import { Controller, Get, Post } from '@nestjs/common';
import { CleanupService } from './cleanup.service';

@Controller('cleanup')
export class CleanupController {
  constructor(private readonly cleanupService: CleanupService) {}

  /**
   * Get cleanup statistics without performing cleanup
   */
  @Get('stats')
  async getCleanupStats() {
    try {
      const stats = await this.cleanupService.getCleanupStatistics();
      return {
        success: true,
        data: stats,
        message: 'Cleanup statistics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve cleanup statistics',
      };
    }
  }

  /**
   * 🎯 Get nuclear cleanup preview - see what's about to be OBLITERATED
   */
  @Get('nuclear-preview')
  async getNuclearPreview() {
    try {
      const stats = await this.cleanupService.getNuclearStats();
      return {
        success: true,
        data: stats,
        message: '💣 Nuclear cleanup preview - ALL THESE RECORDS WILL BE DELETED!',
        warning: '🚨 This shows ALL records that will be permanently deleted by nuclear cleanup',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to get nuclear preview',
      };
    }
  }

  /**
   * Manually trigger cleanup (for testing/administrative purposes)
   */
  @Post('manual')
  async manualCleanup() {
    try {
      await this.cleanupService.manualCleanup();
      return {
        success: true,
        message: 'Manual cleanup completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Manual cleanup failed',
      };
    }
  }

  /**
   * 💥 NUCLEAR OPTION 💥
   * Deletes ALL data regardless of status - USE WITH EXTREME CAUTION!
   */
  @Post('nuclear')
  async nuclearCleanup() {
    try {
      await this.cleanupService.nuclearCleanup();
      return {
        success: true,
        message: '💥 NUCLEAR CLEANUP COMPLETED - ALL DATA OBLITERATED! 💥',
        warning: 'All records have been permanently deleted regardless of status',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '🔥 Nuclear cleanup failed - some data may have survived the blast 🔥',
      };
    }
  }
}