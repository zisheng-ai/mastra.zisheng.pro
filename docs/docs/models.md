---
order: 5
title: 模型
description: 'Mastra 为跨多个 Provider 使用 LLM 提供了一个统一的接口，是你可以通过单个 API 访问来自 79 个 Provider 的 2147 个模型。'
keywords: [Mastra, AI, Agents, Model]
toc: content
group:
  title: 入门
  order: 1
---

Mastra 为跨多个 Provider 使用 LLM 提供了一个统一的接口，使您可以通过单个 API 访问来自 79 个 Provider 的 2147 个模型。

## 功能

- **一个 API 即可访问任何大模型** - 无需安装和管理额外的 Provider 依赖项即可访问任何模型。
- **获取最新 AI 技术** - 无论模型来自哪个 Provider，你都能在新模型发布后立即使用。 Mastra 的 Provider 无关接口让你避免被 Provider 锁定。
- **模型混搭** - 针对不同的任务使用不同的模型。例如，先运营 GPT-4o-mini 处理大上下文信息，然后切换到 Claude Opus 4.1 执行推理任务。
- **模型回退** - 如果某个 Provider 发生故障，Mastra 可以在应用程序级别自动切换到另一个 Provider，与 API 网关相比，可最大限度地减少延迟。

## 基本用法

无论你使用的是 OpenAI、Anthropic、Google 还是像硅基流动和 OpenRouter 这样的网关，只需将模型指定为 `"provider/model-name"`，Mastra 就会处理其余部分。

Mastra 会读取相关的环境变量（例如 `ANTHROPIC_API_KEY`），并将请求路由到相应的 API Provider。如果缺少 API 密钥，你将收到清晰的运行时错误信息，明确支持需要设置哪个变量。

:::code-group
```ts [OpenAI]
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant",
  model: "openai/gpt-5"
})
```

```ts [硅基流动]
import { Agent } from "@mastra/core/agent";

const agent = new Agent({
  id: "my-agent",
  name: "My Agent",
  instructions: "You are a helpful assistant",
  model: "siliconflow-cn/Qwen/Qwen3-Coder-30B-A3B-Instruct"
})
```
:::

## 模型混搭

有些模型速度更快但功能较弱，而另一些模型则提供更大的上下文窗口或更强大的推理能力。可以使用同一供应商的不同模型，也可以混合搭配不同供应商的模型，以适应不同的任务需求。

```ts
// src/mastra/agents/reasoning-agent.ts
import { Agent } from "@mastra/core/agent";

// Use a cost-effective model for document processing
const documentProcessor = new Agent({
  id: "document-processor",
  name: "Document Processor",
  instructions: "Extract and summarize key information from documents",
  model: "openai/gpt-4o-mini"
})

// Use a powerful reasoning model for complex analysis
const reasoningAgent = new Agent({
  id: "reasoning-agent",
  name: "Reasoning Agent",
  instructions: "Analyze data and provide strategic recommendations",
  model: "anthropic//claude-opus-4-1"
})
```

由于模型只是字符串，一次你可以根据[请求上下文](/docs/server-request-context)、变量或任何其他逻辑动态地选择它们。

```ts
// src/mastra/agents/dynamic-assistant-agent.ts
const agent = new Agent({
  id: "dynamic-assistant",
  name: "Dynamic Assistant",
  model: () => {
    const provider = requestContext.get("provider-id");
    const model = requestContext.get("model-id");
    return `${provider}/${model}`;
  },
});
```

这可以实现强大的模式：

- A/B 测试 - 比较模型在生产环境中的性能。
- 用户可选模型 - 允许用户在你的应用程序中选择他们喜欢的型号。
- 多租户应用程序 - 每个用户都可以自带 API 密钥和模型偏好。

## Provider 特定选项

不同迷行提供商会提供各自的配置选项。例如，使用 OpenAI，你可以调整 `reasoningEffort` 参数；使用 `Anthropic`，你可以调整 `cacheControl`；Mastra 允许你在 Agent
