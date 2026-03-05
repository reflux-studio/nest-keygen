import { Test, TestingModule } from '@nestjs/testing';
import { KeygenModule, KeygenService } from '../src/index';

describe('KeygenModule (e2e)', () => {
  let service: KeygenService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        KeygenModule.forRoot({
          account: 'test-account',
          token: 'test-token',
        }),
      ],
    }).compile();

    service = moduleRef.get<KeygenService>(KeygenService);
  });

  it('should instantiate KeygenService', () => {
    expect(service).toBeDefined();
    expect(service.licenses).toBeDefined();
    expect(service.machines).toBeDefined();
    expect(service.tokens).toBeDefined();
  });
});
