import { Test, TestingModule } from '@nestjs/testing';
import { Auth2Service } from './auth2.service';

describe('Auth2Service', () => {
  let service: Auth2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Auth2Service],
    }).compile();

    service = module.get<Auth2Service>(Auth2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
