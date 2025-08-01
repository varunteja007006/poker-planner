import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async check() {
    return 'common service is responding!!';
  }
}
