---
order: 3
title: Memory
description: ' Agent 使用 Memory 来维护交互中的上下文。LLM 是无状态的，不会在调用之间保留信息，因此 Agent 需要 Memory 来跟踪消息历史记录并调用相关信息。'
keywords: [Mastra, AI, Agents, Memory]
toc: content
group:
  title: Agents
  order: 2
---

# 记忆 Memory

 Agent 使用 Memory 来维护交互中的上下文。LLM 是无状态的，不会在调用之间保留信息，因此 Agent 需要 Memory 来跟踪消息历史记录并调用相关信息。

Mastra Agents 可以配置为存储消息历史记录，并使用可选的工作记忆（Working Memory）来维护最近的上下文或语义召回（semantic recall）以根据语义检索过去的消息。

## 何时使用 Memory

当你的 Agent 需要进行多轮对话（涉及引用先前交流内容、召回用户偏好或会话早期的事实，或在对话中逐步构建上下文）时，请启用记忆功能。对于单轮请求（每次交互独立），则无需启用记忆功能。

:::warn
单轮会话的 Agent 想不到有什么实际应用场景，所以记忆功能是 Agent 的核心出装才对，并不是可选项。
:::

## 设置记忆

要在 Mastra 中启用内存功能，请安装 `@mastra/memory` 包并配置存储提供程序（provider）。

```sh
npm install @mastra/memory @mastra/libsql
```

## 存储提供程序

memory 需要存储提供程序来持久化消息历史记录，包括用户消息和客服响应。有关可用提供程序以及 Mastra 中存储机制的详细信息，请参阅 [存储](/docs/memory-storage) 文档。

## 配置 Memory

**1、通过创建一个 Memory 实例并将其传递给 Agent 的 `memory` 选项来启用：**

```ts
// src/mastra/agents/memory-agent.ts
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

export const memoryAgent = new Agent({
  id: "memory-agent",
  name: "Memory Agent",
  memory: new Memory({
    options: {
      lastMessages: 20,
    }
  })
});
```

:::info
访问 [Memory Class](https://mastra.ai/reference/v1/memory/memory-class) 获取完整的配置选项。
:::

**2、向你的主 Mastra 实例添加存储提供程序，以在所有已配置的 Agent 重启用内存功能：**

```ts
// src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: ":memory:"
  }),
});
```

:::info
访问 [libSQL Storage](https://mastra.ai/reference/v1/storage/libsql) 获取完整的配置选项。
:::

或者，可以将存储直接添加到 Agent 的 memory 中以保持数据分离，你也可以为每个 Agent 使用不同的提供程序：

```ts
// src/mastra/agents/memory-agent.ts
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { libSQLStore } from "@mastra/libsql";

export const memoryAgent = new Agent({
  id: "memory-agent",
  name: "Memory Agent",
  memory: new Memory({
    storage: new LibSQLStore({
      id: "mastra-storage",
      url: ":memory:"
    })
  })
});
```

## 消息历史记录

同时包含一个 `memory`、`resource` 和 `thread` 对象，用于在 Agent 期间跟踪消息历史记录。

- `resource`：用户或实体的稳定标识符
- `thread`：用于隔离特定对话或会话的标识符。

这些字段告知 Agent 在何处存储或检索上下文，从而在整个对话过程中实现持久化、支持线程的记忆管理。

```ts
const response = await memoryAgent.generate(
  "Remember my favorite color is blue.",
  {
    memory: {
      resource: "user-123",
      thread: "conversation-123",
  }
);
```

要调用存储在 memory 中的信息，请使用与原始对话相同的 `resource` 和 `thread` 值调用该 Agent 。

```ts
const response = await memoryAgent.generate("What's my favorite color?", {
  memory: {
    resource: "user-123",
    thread: "conversation-123",
  }
})
```

要了解更多关于内存的信息，请参阅 [Memory](docs/memory-overview) 文档。

## 使用 `RequestContext`

使用 [RequestContext](docs/server-request-context) 访问请求特有的值。这使你能够根据请求上下文条件性地选择不同的 memory 或存储配置。

```ts
// src/mastra/agents/memory-agent.ts
export type UserTier = {
  "user-tier": "enterprise" | "pro";
}

const premiumMemory = new Memory();

const standardMemory = new Memory();

export const memoryAgent = new Agent({
  id: "memory-agent",
  name: "Memory Agent",
  memory: ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    return userTier === "enterprise" ? premiumMemory : standardMemory;
  },
});
```
