<div align="center">

# nest-keygen

**NestJS bindings for the [Keygen](https://keygen.sh) software licensing API**

[![npm version](https://img.shields.io/npm/v/nest-keygen)](https://www.npmjs.com/package/nest-keygen)
[![license](https://img.shields.io/npm/l/nest-keygen)](./LICENSE)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E.svg)](https://nestjs.com)

English / [简体中文](./README_CN.md)

</div>

---

## Overview

`nest-keygen` is a NestJS dynamic module that wraps the full [Keygen REST API](https://keygen.sh/docs/api/). All 23 resource types are supported and exposed through a single `KeygenService` facade, so you get one consistent injection point for licensing, machine activation, artifact distribution, and more.

## Installation

```bash
pnpm add nest-keygen
# or
npm install nest-keygen
# or
yarn add nest-keygen
```

## Quick Start

### 1. Register the module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { KeygenModule } from 'nest-keygen';

@Module({
  imports: [
    KeygenModule.forRoot({
      account: 'your-account-id',
      token: 'your-api-token',
      isGlobal: true, // make KeygenService available everywhere
    }),
  ],
})
export class AppModule {}
```

### 2. With environment variables

```typescript
KeygenModule.forRoot({
  account: process.env.KEYGEN_ACCOUNT!,
  token: process.env.KEYGEN_TOKEN,
  environment: process.env.KEYGEN_ENV,
  isGlobal: true,
})
```

### 3. Inject and call

```typescript
import { Injectable } from '@nestjs/common';
import { KeygenService } from 'nest-keygen';

@Injectable()
export class LicensingService {
  constructor(private readonly keygen: KeygenService) {}

  ping() {
    return this.keygen.ping();
  }

  issueLicense(policyId: string, userId: string) {
    return this.keygen.licenses.create({ policyId, userId });
  }

  validateKey(key: string, fingerprint?: string) {
    return this.keygen.licenses.validateKey(key, {
      scope: { fingerprint },
    });
  }

  activateMachine(licenseId: string, fingerprint: string) {
    return this.keygen.machines.activate({
      fingerprint,
      licenseId,
      platform: process.platform,
    });
  }
}
```

## Configuration

| Option | Type | Required | Default | Description |
|---|---|:---:|---|---|
| `account` | `string` | ✅ | — | Account ID or slug |
| `token` | `string` | — | — | API token (`Bearer` auth) |
| `licenseKey` | `string` | — | — | License key (`License` auth) |
| `environment` | `string` | — | — | Adds `Keygen-Environment` header |
| `apiVersion` | `string` | — | — | Adds `Keygen-Version` header |
| `baseUrl` | `string` | — | `https://api.keygen.sh` | Custom API base URL |
| `isGlobal` | `boolean` | — | `false` | Register as a global NestJS module |

### Authentication

| Method | How to configure | Header sent |
|---|---|---|
| Token (Bearer) | set `token` | `Authorization: Bearer <token>` |
| License key | set `licenseKey` | `Authorization: License <key>` |
| Basic (token generate) | pass `{ email, password }` to `tokens.generate()` | handled automatically |

## Resources

All resources are accessed via `keygen.<resource>.<method>()`.

| Property | Resource | Methods |
|---|---|---|
| `keygen.tokens` | Tokens | `generate` · `list` · `retrieve` · `regenerate` · `revoke` |
| `keygen.environments` | Environments | `create` · `retrieve` · `update` · `delete` · `list` · `generateToken` |
| `keygen.products` | Products | `create` · `retrieve` · `update` · `delete` · `list` · `generateToken` |
| `keygen.entitlements` | Entitlements | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.policies` | Policies | `create` · `retrieve` · `update` · `delete` · `list` · `popPool` · `attachEntitlements` · `detachEntitlements` · `listEntitlements` |
| `keygen.groups` | Groups | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.licenses` | Licenses | `create` · `retrieve` · `update` · `delete` · `list` · `validate` · `validateKey` · `suspend` · `reinstate` · `renew` · `revoke` · `checkOut` · `attachEntitlements` · `detachEntitlements` · `listEntitlements` · `changeOwner` · `changePolicy` · `changeGroup` |
| `keygen.machines` | Machines | `activate` · `retrieve` · `update` · `deactivate` · `list` · `checkOut` · `ping` · `reset` · `changeOwner` · `changeGroup` |
| `keygen.components` | Components | `add` · `retrieve` · `update` · `remove` · `list` |
| `keygen.processes` | Processes | `spawn` · `retrieve` · `update` · `kill` · `list` · `ping` |
| `keygen.users` | Users | `create` · `retrieve` · `update` · `delete` · `list` · `updatePassword` · `ban` · `unban` · `changeGroup` |
| `keygen.packages` | Packages | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.releases` | Releases | `create` · `retrieve` · `update` · `delete` · `list` · `upgrade` · `publish` · `yank` · `attachConstraints` · `detachConstraints` · `listConstraints` · `listArtifacts` · `changePackage` |
| `keygen.artifacts` | Artifacts | `upload` · `getDownloadUrl` · `retrieve` · `update` · `yank` · `list` |
| `keygen.platforms` | Platforms *(read-only)* | `retrieve` · `list` |
| `keygen.architectures` | Architectures *(read-only)* | `retrieve` · `list` |
| `keygen.channels` | Channels *(read-only)* | `retrieve` · `list` |
| `keygen.webhookEndpoints` | Webhook Endpoints | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.webhookEvents` | Webhook Events | `retrieve` · `delete` · `list` · `retry` |
| `keygen.requestLogs` | Request Logs | `retrieve` · `list` |
| `keygen.eventLogs` | Event Logs | `retrieve` · `list` |
| `keygen.profiles` | Profiles | `me` |
| `keygen.passwords` | Passwords | `forgotPassword` |

## Pagination

All `list` methods accept a `page` parameter:

```typescript
await this.keygen.licenses.list({
  limit: 25,
  page: { size: 25, number: 2 },
});
```

## Error Handling

API errors are thrown as NestJS `HttpException`, preserving the original Keygen status code and JSON:API error body:

```typescript
import { HttpException } from '@nestjs/common';

try {
  await this.keygen.licenses.retrieve('bad-id');
} catch (err) {
  if (err instanceof HttpException) {
    console.log(err.getStatus());   // e.g. 404
    console.log(err.getResponse()); // Keygen JSON:API error object
  }
}
```

## License

[MIT](./LICENSE)
