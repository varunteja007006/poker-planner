import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health/backend')
  check(): { message: string } {
    return this.appService.check();
  }

  @Get('health/db')
  async checkDatabase(): Promise<{ status: string; message: string }> {
    return this.appService.checkDatabase();
  }
}
