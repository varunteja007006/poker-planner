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
}