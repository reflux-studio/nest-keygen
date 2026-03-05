import { ModuleMetadata, Type } from '@nestjs/common';

export interface KeygenOptions {
  account: string;
  token?: string;
  licenseKey?: string;
  environment?: string;
  apiVersion?: string;
  baseUrl?: string;
  isGlobal?: boolean;
}

export interface KeygenOptionsFactory {
  createKeygenOptions(): Promise<KeygenOptions> | KeygenOptions;
}

export interface KeygenAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useFactory?: (...args: any[]) => Promise<KeygenOptions> | KeygenOptions;
  inject?: any[];
  useClass?: Type<KeygenOptionsFactory>;
  useExisting?: Type<KeygenOptionsFactory>;
}
