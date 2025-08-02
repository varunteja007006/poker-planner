import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('check')
  async Check() {
    const serviceMessage = await this.commonService.check();

    return {
      serviceMessage,
      status: 'ok',
      controllerMessage: 'common controller is responding!!',
    };
  }
}
