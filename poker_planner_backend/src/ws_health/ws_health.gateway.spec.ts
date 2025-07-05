import { Test, TestingModule } from '@nestjs/testing';
import { WsHealthGateway } from './ws_health.gateway';
import { WsHealthService } from './ws_health.service';

describe('WsHealthGateway', () => {
  let gateway: WsHealthGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsHealthGateway, WsHealthService],
    }).compile();

    gateway = module.get<WsHealthGateway>(WsHealthGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
