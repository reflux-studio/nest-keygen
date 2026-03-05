<div align="center">

# nest-keygen

**[Keygen](https://keygen.sh) 软件许可 API 的 NestJS 绑定**

[![npm version](https://img.shields.io/npm/v/nest-keygen.svg)](https://www.npmjs.com/package/nest-keygen)
[![license](https://img.shields.io/npm/l/nest-keygen.svg)](./LICENSE)
[![keygen API](https://img.shields.io/badge/keygen-API-4F46E5.svg)](https://keygen.sh/docs/api/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E.svg)](https://nestjs.com)

[English](./README.md) / 简体中文

</div>

---

## 简介

`nest-keygen` 是一个 NestJS 动态模块，完整封装了 [Keygen REST API](https://keygen.sh/docs/api/)。全部 23 种资源类型均已支持，并通过统一的 `KeygenService` 门面暴露，提供一个一致的注入入口，涵盖许可证管理、机器激活、制品分发等功能。

## 安装

```bash
pnpm add nest-keygen
# 或
npm install nest-keygen
# 或
yarn add nest-keygen
```

> **要求** Node.js ≥ 18（使用原生 `fetch` API）以及 NestJS ≥ 10。

## 快速上手

### 1. 注册模块

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { KeygenModule } from 'nest-keygen';

@Module({
  imports: [
    KeygenModule.forRoot({
      account: 'your-account-id',
      token: 'your-api-token',
      isGlobal: true, // 全局可用
    }),
  ],
})
export class AppModule {}
```

### 2. 异步配置（如结合 ConfigService）

```typescript
KeygenModule.forRootAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    account: config.get('KEYGEN_ACCOUNT'),
    token: config.get('KEYGEN_TOKEN'),
    environment: config.get('KEYGEN_ENV'), // 例如 'sandbox'
  }),
  inject: [ConfigService],
})
```

### 3. 注入并调用

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

## 配置项

| 选项 | 类型 | 必填 | 默认值 | 说明 |
|---|---|:---:|---|---|
| `account` | `string` | ✅ | — | 账户 ID 或 slug |
| `token` | `string` | — | — | API Token（Bearer 认证） |
| `licenseKey` | `string` | — | — | 许可证密钥（License 认证） |
| `environment` | `string` | — | — | 附加 `Keygen-Environment` 请求头 |
| `apiVersion` | `string` | — | — | 附加 `Keygen-Version` 请求头 |
| `baseUrl` | `string` | — | `https://api.keygen.sh` | 自定义 API 基础 URL |
| `isGlobal` | `boolean` | — | `false` | 是否注册为 NestJS 全局模块 |

### 认证方式

| 方式 | 配置方法 | 发送的请求头 |
|---|---|---|
| Token（Bearer） | 设置 `token` | `Authorization: Bearer <token>` |
| 许可证密钥 | 设置 `licenseKey` | `Authorization: License <key>` |
| Basic（生成 Token） | 向 `tokens.generate()` 传入 `{ email, password }` | 自动处理 |

## 资源列表

所有资源均通过 `keygen.<resource>.<method>()` 访问。

| 属性 | 资源 | 方法 |
|---|---|---|
| `keygen.tokens` | Token | `generate` · `list` · `retrieve` · `regenerate` · `revoke` |
| `keygen.environments` | 环境 | `create` · `retrieve` · `update` · `delete` · `list` · `generateToken` |
| `keygen.products` | 产品 | `create` · `retrieve` · `update` · `delete` · `list` · `generateToken` |
| `keygen.entitlements` | 权益 | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.policies` | 策略 | `create` · `retrieve` · `update` · `delete` · `list` · `popPool` · `attachEntitlements` · `detachEntitlements` · `listEntitlements` |
| `keygen.groups` | 分组 | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.licenses` | 许可证 | `create` · `retrieve` · `update` · `delete` · `list` · `validate` · `validateKey` · `suspend` · `reinstate` · `renew` · `revoke` · `checkOut` · `attachEntitlements` · `detachEntitlements` · `listEntitlements` · `changeOwner` · `changePolicy` · `changeGroup` |
| `keygen.machines` | 机器 | `activate` · `retrieve` · `update` · `deactivate` · `list` · `checkOut` · `ping` · `reset` · `changeOwner` · `changeGroup` |
| `keygen.components` | 组件 | `add` · `retrieve` · `update` · `remove` · `list` |
| `keygen.processes` | 进程 | `spawn` · `retrieve` · `update` · `kill` · `list` · `ping` |
| `keygen.users` | 用户 | `create` · `retrieve` · `update` · `delete` · `list` · `updatePassword` · `ban` · `unban` · `changeGroup` |
| `keygen.packages` | 包 | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.releases` | 发布版本 | `create` · `retrieve` · `update` · `delete` · `list` · `upgrade` · `publish` · `yank` · `attachConstraints` · `detachConstraints` · `listConstraints` · `listArtifacts` · `changePackage` |
| `keygen.artifacts` | 制品 | `upload` · `getDownloadUrl` · `retrieve` · `update` · `yank` · `list` |
| `keygen.platforms` | 平台 *(只读)* | `retrieve` · `list` |
| `keygen.architectures` | 架构 *(只读)* | `retrieve` · `list` |
| `keygen.channels` | 频道 *(只读)* | `retrieve` · `list` |
| `keygen.webhookEndpoints` | Webhook 端点 | `create` · `retrieve` · `update` · `delete` · `list` |
| `keygen.webhookEvents` | Webhook 事件 | `retrieve` · `delete` · `list` · `retry` |
| `keygen.requestLogs` | 请求日志 | `retrieve` · `list` |
| `keygen.eventLogs` | 事件日志 | `retrieve` · `list` |
| `keygen.profiles` | 个人资料 | `me` |
| `keygen.passwords` | 密码 | `forgotPassword` |

## 分页

所有 `list` 方法均支持 `page` 参数：

```typescript
await this.keygen.licenses.list({
  limit: 25,
  page: { size: 25, number: 2 },
});
```

## 错误处理

API 错误会以 NestJS `HttpException` 的形式抛出，保留 Keygen 原始状态码和 JSON:API 错误体：

```typescript
import { HttpException } from '@nestjs/common';

try {
  await this.keygen.licenses.retrieve('bad-id');
} catch (err) {
  if (err instanceof HttpException) {
    console.log(err.getStatus());   // 例如 404
    console.log(err.getResponse()); // Keygen JSON:API 错误对象
  }
}
```

## 许可证

[MIT](./LICENSE)
