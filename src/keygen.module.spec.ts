import { Test } from '@nestjs/testing';
import { KeygenModule } from './keygen.module';
import { KeygenService } from './keygen.service';
import { KEYGEN_OPTIONS } from './keygen.constants';
import { KeygenOptionsFactory } from './interfaces/keygen-options.interface';

describe('KeygenModule', () => {
  describe('forRoot', () => {
    it('returns DynamicModule with module set', () => {
      const mod = KeygenModule.forRoot({ account: 'acc', token: 'tok' });
      expect(mod.module).toBe(KeygenModule);
    });

    it('exports KeygenService', () => {
      const mod = KeygenModule.forRoot({ account: 'acc', token: 'tok' });
      expect(mod.exports).toContain(KeygenService);
    });

    it('sets global=false by default', () => {
      const mod = KeygenModule.forRoot({ account: 'acc', token: 'tok' });
      expect(mod.global).toBe(false);
    });

    it('sets global=true when isGlobal=true', () => {
      const mod = KeygenModule.forRoot({
        account: 'acc',
        token: 'tok',
        isGlobal: true,
      });
      expect(mod.global).toBe(true);
    });

    it('instantiates KeygenService via Test module', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [KeygenModule.forRoot({ account: 'acc', token: 'tok' })],
      }).compile();
      const service = moduleRef.get(KeygenService);
      expect(service).toBeDefined();
      expect(service.licenses).toBeDefined();
    });
  });

  describe('forRootAsync - useFactory', () => {
    it('exports KeygenService', () => {
      const mod = KeygenModule.forRootAsync({
        useFactory: () => ({ account: 'acc', token: 'tok' }),
      });
      expect(mod.exports).toContain(KeygenService);
    });

    it('instantiates KeygenService via Test module', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          KeygenModule.forRootAsync({
            useFactory: () => ({ account: 'acc', token: 'tok' }),
          }),
        ],
      }).compile();
      const service = moduleRef.get(KeygenService);
      expect(service).toBeDefined();
    });

    it('resolves options from async factory', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          KeygenModule.forRootAsync({
            useFactory: async () => ({ account: 'async-acc', token: 'tok' }),
          }),
        ],
      }).compile();
      const opts = moduleRef.get(KEYGEN_OPTIONS);
      expect(opts.account).toBe('async-acc');
    });
  });

  describe('forRootAsync - useClass', () => {
    class TestFactory implements KeygenOptionsFactory {
      createKeygenOptions() {
        return { account: 'class-acc', token: 'tok' };
      }
    }

    it('instantiates KeygenService via Test module', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [KeygenModule.forRootAsync({ useClass: TestFactory })],
      }).compile();
      const service = moduleRef.get(KeygenService);
      expect(service).toBeDefined();
    });

    it('uses factory class to create options', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [KeygenModule.forRootAsync({ useClass: TestFactory })],
      }).compile();
      const opts = moduleRef.get(KEYGEN_OPTIONS);
      expect(opts.account).toBe('class-acc');
    });
  });

  describe('forRootAsync - useExisting', () => {
    class ExistingFactory implements KeygenOptionsFactory {
      createKeygenOptions() {
        return { account: 'existing-acc', token: 'tok' };
      }
    }

    it('uses existing provider to create options', async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          KeygenModule.forRootAsync({
            useExisting: ExistingFactory,
            imports: [
              {
                module: class ExtraModule {},
                providers: [ExistingFactory],
                exports: [ExistingFactory],
              },
            ],
          }),
        ],
      }).compile();
      const opts = moduleRef.get(KEYGEN_OPTIONS);
      expect(opts.account).toBe('existing-acc');
    });
  });

  describe('forRootAsync - invalid options', () => {
    it('fails to compile when no async provider strategy is provided', async () => {
      await expect(
        Test.createTestingModule({
          imports: [KeygenModule.forRootAsync({} as any)],
        }).compile(),
      ).rejects.toThrow();
    });
  });
});
