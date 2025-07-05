import { Module } from '@nestjs/common';
import { WsHealthService } from './ws_health.service';
import { WsHealthGateway } from './ws_health.gateway';
// import { ConfigModule } from '@nestjs/config';

@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),
  // ],
  providers: [WsHealthGateway, WsHealthService],
})
export class WsHealthModule {}
