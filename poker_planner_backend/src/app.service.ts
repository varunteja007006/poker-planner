import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  check(): string {
    return 'ok!';
  }
}
