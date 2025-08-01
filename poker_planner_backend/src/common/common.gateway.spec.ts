import { Test, TestingModule } from '@nestjs/testing';
import { CommonGateway } from './common.gateway';

describe('CommonGateway', () => {
  let gateway: CommonGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonGateway],
    }).compile();

    gateway = module.get<CommonGateway>(CommonGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
