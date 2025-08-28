import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  check(): { message: string } {
    return { message: 'backend is ok!' };
  }

  async checkDatabase(): Promise<{ status: string; message: string }> {
    try {
      // Simple query to check if database is responsive
      await this.dataSource.query('SELECT 1');
      return {
        status: 'success',
        message: 'Database is up and running!'
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Database connection failed: ${error.message}`
      };
    }
  }
}
