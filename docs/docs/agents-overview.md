---
order: 1
title: 概述
description: ' Agent 使用大语言模型和工具来解决开放式任务。它们推理目标，决定使用哪些工具，保留对话记忆，并进行内部迭代，直到模型发出最终答案或满足可选的停止条件。'
keywords: [Mastra, AI, Agents, Tools]
toc: content
group:
  title: Agents
  order: 2
---

# Agent 概述

 Agent 使用大语言模型和工具来解决开放式任务。它们推理目标，决定使用哪些工具，保留对话记忆，并进行内部迭代，直到模型发出最终答案或满足可选的停止条件。

:::info{title="什么是 Agent "}
AI Agent是一种能够**感知环境、自主决策、执行任务并持续学习**的智能软件系统。它不只是被动地响应指令，而是像一个“数字员工”一样，主动思考、规划、调用工具、与外界交互，最终完成复杂目标。

✅ 简单说：AI Agent = LLM（大脑） + 工具（手脚） + 记忆（经验） + 目标（驱动力）

随着 LLM、工具调用（Function Calling）、记忆机制的发展，AI Agent 正从概念走向现实，成为下一代人机交互的核心范式。

参考：[构建高效 AI Agent - Anthropic](https://zhuanlan.zhihu.com/p/14060480822)
:::

![](https://mastra.ai/assets/images/agents-overview-1e3bb3b8cf0d13be675394ad41418ea7.jpg)

## 设置 Agents

### 安装

1、将 Mastra 核心包添加到你的项目中：

```sh
npm install @mastra/core@beta
```

2、Mastra 的模型路由器会自动检测您选择的 Provider 的环境变量。对于硅基流动，设置 SILICONFLOW_API_KEY:

```env
SILICONFLOW_API_KEY=<your-api-key>
```

3、通过使用 系统 `instructions` 和 Agent 类实例化来创建 Agent ：

```ts
import { Agent } from "@mastra/core/agent";

export const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "You are a helpful assistant.",
  model: "siliconflow-cn/Qwen/Qwen3-Coder-30B-A3B-Instruct",
});
```

### 指令格式

指令定义了 Agent 的行为、个性和能力。它们是系统级提示，可建立 Agent 的核心身份和专业知识。

可以以多种格式提供说明，以提高灵活性。下面的示例说明了支持的格式：

```ts
// String (most common)
instructions: "You are a helpful assistant.";

// Array of strings
instructions: [
  "You are a helpful assistant.",
  "Always be polite.",
  "Provide detailed answers.",
];

// Array of system messages
// 这里和 LLM 的格式是一致的s
instructions: [
  { role: "system", content: "You are a helpful assistant." },
  { role: "system", content: "You have expertise in TypeScript." },
];
```

### 特定模型 Provider 选项

每个模型 Provider 会提供一些不同的选项，包括提示缓存和配置推理。我们提供 `providerOptions` 属性来管理。你可以在指令级别设置每个系统指令/提示设置不同的缓存策略。

```ts
// With provider-specific options (e.g., caching, reasoning)
instructions: {
  role: "system",
  content:
    "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
  providerOptions: {
    openai: { reasoningEffort: "high" },        // OpenAI's reasoning models
    anthropic: { cacheControl: { type: "ephemeral" } }  // Anthropic's prompt caching
  }
}
```

:::info
访问 [Agent reference](https://mastra.ai/reference/v1/agents/agent) 获取更多信息。
:::

### 注册 Agent 

在 Mastra 实例中注册你的 Agent ，使其在你的整个应用程序中可用。注册后，它可以从工作流、工具或其他 Agent 重调用，并且可以访问共享资源，例如内存、日志记录和可观察性功能：

```ts
import { Mastra } from "@mastra/core";
import { testAgent } from "./agents/test-agent";

export const mastra = new Mastra({
  agents: { testAgent },
});
```

## 引用 Agent 

你可以从工作流步骤、工具、Mastra 客户端或命令行调用 Agent 。根据你的设置，调用 `mastra` 或 `mastraClient` 的 `getAgent()`：

```ts
const testAgent = mastra.getAgent("testAgent");
```

:::info
`mastra.getAgent()` 优于直接导入，引入它提供对 Mastra 实例配置（logger、telemetry、storage、注册 Agent 和向量存储）的访问。
:::

## 生成响应

 Agent 可以通过两种方式返回结果：在返回之前生成完整的输出或实时流式传输 token。选择适合你的方法：生成简短的内部响应或调试，并流式传输以尽快交付页面给用户。

对于简单提示，传递单个字符串；在提供多个上下文时传递字符串数组；或者使用带有 `role` 和 `content` 的对象数组传递消息。`role` 定义每条消息的发言者。典型的角色是 `user`（人工输入）、`assistant`（ Agent 响应） 和 `system`（指令）。

:::code-group
```ts [Generate]
const response = await testAgent.generate([
  { role: "user", content: "Help me organize my day" },
  { role: "user", content: "My day starts at 9am and finishes at 5.30pm" },
  { role: "user", content: "I take lunch between 12:30 and 13:30" },
  {
    role: "user",
    content: "I have meetings Monday to Friday between 10:30 and 11:30",
  },
]);

console.log(response.text);
```

```ts [Stream]
const stream = await testAgent.stream([
  { role: "user", content: "Help me organize my day" },
  { role: "user", content: "My day starts at 9am and finishes at 5.30pm" },
  { role: "user", content: "I take lunch between 12:30 and 13:30" },
  {
    role: "user",
    content: "I have meetings Monday to Friday between 10:30 and 11:30",
  },
]);

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```
:::

> 访问 [.generate()](https://mastra.ai/reference/v1/agents/generate) 或 [.stream()](https://mastra.ai/reference/v1/streaming/agents/stream) 了解更多信息。

## 结构化输出

 Agent 使用 Zod 或者 JSON Schema 能够返回结构化，类型安全的数据。解析后的结构可以通过 `response.object` 获取。

:::info
访问 [结构化输出](/docs/agents-structured-output) 查看更多信息。
:::

## 分析图片

 Agent 可以通过处理视觉内容和其中的任何文本来分析和描述图像。要启用图像分析，请在 `content` 数组中传递一个 `type` 是 `"image"` 并包含图像 url 的对象。你可以将图像内容与文本提示相结合来指导 Agent 的分析。

:::code-group
```ts [图片分析]
const response = await testAgent.generate([
  {
    role: "user",
    content: [
      {
        type: "image",
        image: "https://placebear.com/cache/395-205.jpg",
        mimeType: "image/jpeg",
      },
      {
        type: "text",
        text: "Describe the image in detail, and extract all the text in the image.",
      }
    ]
  }
]);

console.log(response.text);
```

```ts [Test Agent]
import { Agent } from "@mastra/core/agent";

export const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "You are a helpful assistant.",
  // 选择一个视觉模型
  model: "siliconflow-cn/Qwen/Qwen3-VL-32B-Instruct",
});
```
:::


输出结果：

```txt
The image is a black-and-white photograph depicting a bear standing in water. The bear is shown in profile, facing to the right, with its head slightly raised and its gaze directed forward. Its fur appears thick and textured, with varying shades of gray that suggest a natural, rugged coat. The bear’s body is partially submerged, with water reaching up to its midsection, and ripples are visible around it, indicating gentle movement in the water. The background consists of a calm, rippling water surface that extends to the horizon, with no visible land or other objects. The lighting is soft and even, enhancing the textures of the bear’s fur and the water’s surface. The overall mood of the image is serene and naturalistic.
```

## 使用 `maxSteps`

`maxSteps` 参数控制 Agent 可以进行的连续 LLM 调用的最大数量。每个步骤包括生成响应、执行任何工具调用以及处理结果、限制步骤有助于防止无限循环、减少延迟并控制使用工具使用工具的 Agent  Token 的使用情况。默认为 `1`，但可以增加：

```ts
const response = await testAgent.generate("Help me organize my day", {
  maxSteps: 10,
});

console.log(response.text);
```

## 使用 `onStepFinish`

你可以使用回调监听多步骤操作的进度。这对于调试或向用户提供进度更新很有用。`onStepFinish` 仅在流式传输或生成没有结构化输出的文本时可用。

```ts
const response = await testAgent.generate("Help me organize my day", {
  onStepFinish: ({ text, toolCalls, toolResults, finishReason, usage }) => {
    console.log({ text, toolCalls, toolResults, finishReason, usage });
  },
});
```

## 使用工具

 Agent 可以使用工具，从而实现与外部 API 和服务的结构化交互。工具允许 Agent 以可靠、可重复的方式访问数据并执行明确定义的操作。

```ts
export const testAgent = new Agent({
  id: "test-agent",
  instructions: "You are a helpful assistant.",
  name: "Test Agent",
  tools: { testTool },
});
```

"""info
请访问 [使用工具](/docs/agent-using-tools) 了解更多信息。
"""

## 使用 `RequestContext`

`RequestContext` 用于访问特定请求的值。这使你可以根据请求的上下文有条件地调整行为：

```ts
export type UserTier = {
  "user-tier": "enterprise" | "pro";
};

export const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  model: ({ requestContext }) => {
    const userTier = requestContext.get("user-tier") as UserTier["user-tier"];

    return userTier === "enterprise"
      ? "openai/gpt-5"
      : "openai/gpt-4.1-nano";
  },
});
```

```ts
import { RequestContext } from "@mastra/core/request-context";

export type UserTier = {
  "user-tier": "enterprise" | "pro";
};

const requestContext = new RequestContext<UserTier>();
requestContext.set("user-tier", "enterprise");
const agent = mastra.getAgent("weatherAgent");
await agent.generate("What's the weather in London?", {
  requestContext,
});
```

:::info
有关详细信息，请参阅 [请求上下文 RequestContext](/docs/server-request-context)。
:::

## 使用 Studio 进行测试

在 [Studio](/docs/studio/) 用不同的消息测试 Agent 、检查工具和响应以调试 Agent 的行为。
