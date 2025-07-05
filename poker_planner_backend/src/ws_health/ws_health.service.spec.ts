import { Test, TestingModule } from '@nestjs/testing';
import { WsHealthService } from './ws_health.service';

describe('WsHealthService', () => {
  let service: WsHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsHealthService],
    }).compile();

    service = module.get<WsHealthService>(WsHealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
