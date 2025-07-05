import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { WsHealthService } from './ws_health.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.WS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class WsHealthGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsHealthService: WsHealthService) {}

  @SubscribeMessage('check')
  check() {
    return this.wsHealthService.check();
  }

  @SubscribeMessage('poker:disconnect')
  disconnect(@ConnectedSocket() client: Socket) {
    console.log(
      'Disconnected',
      client.id,
      '\nDisconnected: ',
      client.disconnected,
      '\nconnected: ',
      client.connected,
    );
    // return this.wsHealthService.disconnect(socket);
  }
}
