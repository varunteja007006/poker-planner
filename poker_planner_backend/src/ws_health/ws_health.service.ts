import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsHealthService {
  check() {
    return 'Ok';
  }
}
