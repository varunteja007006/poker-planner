# Aggressive Database Cleanup Service

This service provides aggressive automated database cleanup functionality for the Poker Planner application. Since this is a fun collaborative space with no need for long-term data storage, the cleanup is designed to keep the database lean and fast.

## Features

### Multiple Automated Cleanup Jobs

#### 1. Hourly Cleanup
- **Schedule**: Every hour at minute 0
- **Cron Expression**: `0 * * * *`
- **Purpose**: Clean up very short-term data
- **Actions**:
  - Removes inactive client sessions older than 30 minutes
  - Soft-deletes completed stories and their points after 6 hours

#### 2. Daily Aggressive Cleanup
- **Schedule**: Daily at 3:00 AM UTC
- **Cron Expression**: `0 3 * * *`
- **Purpose**: Main cleanup for all data
- **Actions**:
  - Soft-deletes inactive rooms and related data after 1 day
  - Permanently deletes soft-deleted records after 1 day
  - Removes inactive client sessions after 2 hours

#### 3. Weekly Deep Cleanup
- **Schedule**: Every Sunday at 2:00 AM UTC
- **Cron Expression**: `0 2 * * 0`
- **Purpose**: Safety net deep cleaning
- **Actions**:
  - Permanently deletes ALL records older than 7 days regardless of status

### What Gets Cleaned Up Aggressively

1. **Inactive Client Sessions**:
   - Every 30 minutes: sessions with no activity
   - Every 2 hours: inactive sessions (daily job)

2. **Completed Stories**:
   - After 6 hours: completed stories and their story points

3. **Inactive Rooms**:
   - After 1 day: rooms with no team activity

4. **Soft-deleted Records** (after 1 day):
   - Users, Rooms, Teams, Stories, Story Points, Clients

5. **Deep Cleanup** (weekly):
   - ALL records older than 7 days are permanently removed

## API Endpoints

### GET `/cleanup/stats`
Returns statistics about records that would be cleaned up without actually performing the cleanup.

**Response:**
```json
{
  "success": true,
  "data": {
    "softDeletedCounts": {
      "users": 5,
      "rooms": 12,
      "teams": 8,
      "stories": 25,
      "storyPoints": 150,
      "clients": 30
    },
    "inactiveClientCount": 45,
    "completedStoriesCount": 12,
    "inactiveRoomsCount": 8
  },
  "message": "Cleanup statistics retrieved successfully"
}
```

### POST `/cleanup/manual`
Manually triggers the aggressive daily cleanup process for testing or administrative purposes.

**Response:**
```json
{
  "success": true,
  "message": "Manual cleanup completed successfully"
}
```

## Configuration

### Cron Schedules
The service runs three different cleanup jobs:

```typescript
// Hourly cleanup
@Cron('0 * * * *', {
  name: 'hourly-cleanup',
  timeZone: 'UTC',
})

// Daily aggressive cleanup
@Cron('0 3 * * *', {
  name: 'daily-aggressive-cleanup',
  timeZone: 'UTC',
})

// Weekly deep cleanup
@Cron('0 2 * * 0', {
  name: 'weekly-deep-cleanup',
  timeZone: 'UTC',
})
```

### Cleanup Thresholds
- **Client sessions**: 30 minutes (hourly), 2 hours (daily)
- **Completed stories**: 6 hours
- **Inactive rooms**: 1 day
- **Soft-deleted records**: 1 day
- **Deep cleanup**: 7 days (everything)

To modify these thresholds, update the date calculations in the service methods.

## Logging

The service provides comprehensive logging for all cleanup operations:
- **Hourly cleanup**: Client session and completed story cleanup
- **Daily cleanup**: Inactive rooms, soft-deleted records, and client sessions
- **Weekly cleanup**: Deep cleanup of all old records
- **Record counts** for each entity type cleaned
- **Error handling** and reporting for each cleanup job
- Uses NestJS Logger with `CleanupService` context

## Safety Features

1. **Multiple cleanup tiers** with different frequencies and aggressiveness
2. **Error isolation** - if one cleanup job fails, others continue
3. **Comprehensive logging** for complete audit trail
4. **Statistics endpoint** to preview cleanup impact
5. **Manual trigger** for testing and emergency cleanup
6. **Progressive cleanup** - soft delete first, then permanent deletion

## Aggressive Cleanup Benefits

Since this is a fun collaborative space:
- **Fast performance**: Database stays lean with minimal old data
- **No storage costs**: Aggressive cleanup prevents data accumulation
- **Fresh experience**: Users always work with recent, relevant data
- **Simplified maintenance**: No need for complex data retention policies

## Development Notes

### Testing
- Use `GET /cleanup/stats` to see what would be cleaned up
- Use `POST /cleanup/manual` to test the daily aggressive cleanup
- Monitor logs during cleanup operations
- Check cleanup frequency in development vs production

### Database Impact
- **Minimal impact**: Quick bulk operations during low-traffic hours
- **Progressive deletion**: Soft delete → permanent deletion workflow
- **Optimized queries**: Uses TypeORM query builder for efficiency

### Monitoring
- Check application logs for all three cleanup job executions
- Monitor the `/cleanup/stats` endpoint trends
- Set up alerts for cleanup job failures
- Track database size reduction over time

## Production Considerations

### Performance
- Cleanup jobs run during low-traffic hours (2-3 AM UTC)
- Hourly cleanup is lightweight (sessions and completed stories only)
- Deep cleanup runs weekly during lowest traffic (Sunday 2 AM)

### Data Loss Prevention
- **Warning**: This is designed for ephemeral data only
- Multiple cleanup tiers provide safety nets
- Statistics endpoint allows monitoring before cleanup
- Manual cleanup available for immediate needs

## Security Considerations

- The manual cleanup endpoint should be protected in production
- Consider adding authentication/authorization for admin operations
- Monitor for unusual cleanup patterns that might indicate data issues

## Future Enhancements

Potential improvements:
- Add configuration for cleanup thresholds via environment variables
- Implement backup before cleanup option
- Add email notifications for cleanup summaries
- Create admin dashboard for cleanup management