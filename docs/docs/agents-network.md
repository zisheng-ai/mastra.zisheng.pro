---
order: 5
title: Agents 网络
description: 'Mastra 中的 Agent 网络通过协调多个 Agent 、工作流和工具，处理那些事前未明确定义、但可从用户消息或上下文中推断出的任务。'
keywords: [Mastra, AI, Agents, Tools, Network]
toc: content
group:
  title: Agents
  order: 2
---

Mastra 中的 Agent 网络通过协调多个 Agent 、工作流和工具，处理那些事前未明确定义、但可从用户消息或上下文中推断出的任务。定义路由代理（即已配置其他 Agent 、工作流和工具的 Mastra Agents）利用大语言模型（LLM）解析请求，并决定调用哪些基本组件（子 Agent 、工作流或工具）、调用顺序以及数据传输方式。

## 何时使用网络

对于需要跨多个基本单元进行协调的复杂任务，请使用网络。与遵循预定义序列的工作流不同，网络依赖于大语言模型的推理能力来解释请求并决定执行内容。

## 核心原则

Mastra Agents 网络遵循以下原则运行：

- 使用 `.network()` 时需要 Memory，用于存储任务历史记录并判断任务何时完成。
- 基于描述选择基本组件。清晰具体的描述有助于优化路由。对于工作流和工具，输入 schema 有助于在运行时确定正确的输入。
- 若多个基本功能存在重叠， Agent 将优先选择更具体的基元，通过结合 schema 和描述来决定运行哪个基元。

## 创建 Agent 网络

 Agent 网络围绕顶级路由 Agent 构建，该 Agent 将任务委派给其配置中定义的 Agent 、工作流和工具。路由 Agent 的内存配置通过 `memory` 选项实现，而 `instruction` 则定义 Agent 的路由行为。

```ts
// src/mastra/agents/routing-agent.ts
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { libSQLStore } from "@mastra/libsql";

import { researchAgent } from "./research-agent";
import { writingAgent } from "./writing-agent";

import { cityWorkflow } from "../workflows/city-workflow";
import { weatherTool } from "../tools/weather-tool";

export const routingAgent = new Agent({
  id: "routing-agent",
  name: "Routing Agent",
  instructions: `
    You are a network of writers and researchers.
    The user will ask you to research a topic.
    Always respond with a complete report-no bullet points.
    Write in full paragraphs, like a blog post.
    Do not answer with incomplete or uncertain information.`,
  model: "openai/gpt-5,1",
  agents: {
    researchAgent,
    writingAgent,
  },
  workflows: {
    cityWorkflow,
  },
  tools: {
    weatherTool,
  },
  memory: new Memory({
    storage: new libSQLStore({
      id: "mastra-storage",
      url: "file:../mastra.db",
    }),
  }),
});
```

## 为网络基本组件编写描述

配置 Mastra Agents 网络时，每个基本组件（代理、工作流或工具）都需要清晰的描述，以帮助路由决定使用哪个。路由 Agent 使用每个基本组件的描述和 schema 来确定它的作用以及如何使用它。清晰的描述和明确定义的输入和输出模式可提高路由准确性。

### Agents 说明

网络中的每个 Agent 都应该明确 `description` 以说明该 Agent 的作用。

```ts
// src/mastra/agents/research-agent.ts
export const researchAgent = new Agent({
  id: "research-agent",
  name: "Research Agent",
  description: `This agent gathers concise research insights in bullet-point form.
    It's designed to extract key facts without generating full
    responses or narrative content.`,
});
```

```ts
// src/mastra/agents/writing-agent.ts
export const writingAgent = new Agent({
  id: "writing-agent",
  name: "Writing Agent",
  description: `This agent turns researched material into well-structured
    written content. It produces full-paragraph reports with no bullet points,
    suitable for use in articles, summaries, or blog posts.`,
});
```

### 工具说明

网络中的工具应包括 `description` 来解释其目的以及 `outputSchema` 来描述预期的数据格式。

```ts
// src/mastra/tools/weather-tool.ts
export const weatherTool = createTool({
  id: "weather-tool",
  description: `Retrieves current weather information using the wttr.in API.
    Accepts a city or location name as input and returns a shorts weather summary.
    Use this tool whenever up-to-date weather data is requested.
  `,
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
});
```

## 调用 Agent 网络

使用带用户消息的 `.network()` 调用 Mastra Agents。该方法返回一个事件流，你可以对其进行迭代以跟踪执行进度并检索最终结果。

## Agents 示例

在此示例中，网络解释消息并将请求路由到和 `researchAgent` 和 `writingAgent` 以生成完整的响应。

```ts
const result = await routingAgent.network(
  "Tell me three cool ways to use Mastra",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### Agent 输出

在请求期间会发出下面的 `chunk.type` 事件：

```txt
routing-agent-start
routing-agent-end
agent-execution-start
agent-execution-event-start
agent-execution-event-step-start
agent-execution-event-text-start
agent-execution-event-text-delta
agent-execution-event-text-end
agent-execution-event-step-finish
agent-execution-event-finish
agent-execution-end
network-execution-event-step-finish
```

## 工作流示例

在此示例中，路由 Agent 识别消息中的城市名称并运行 `cityWorkflow`。该工作流定义了调用 `researchAgent` 来收集事实，然后调用 `writingAgent` 来生成最终文本的步骤。

```ts
const result = await routingAgent.network(
  "Tell me some historical facts about London",
);

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### 工作流输出

在请求期间，会发出以下 `chunk.type` 事件：

```txt
routing-agent-end
workflow-execution-start
workflow-execution-event-workflow-start
workflow-execution-event-workflow-step-start
workflow-execution-event-workflow-step-result
workflow-execution-event-workflow-finish
workflow-execution-end
workflow-agent-start
network-execution-event-step-finish
```

## 工具示例

在本示例中，路由 Agent 跳过 `researchAgent`、`writingAgent` 和 `weatherTool` 来完成任务。

```ts
const result = await routingAgent.network("What's the weather in London?");

for await (const chunk of result) {
  console.log(chunk.type);
  if (chunk.type === "network-execution-event-step-finish") {
    console.log(chunk.payload.result);
  }
}
```

### 工具输出

在此请求期间会发出以下 `chunk.type` 事件：

```txt
routing-agent-start
routing-agent-end
tool-execution-start
tool-execution-end
network-execution-event-step-finish
```

## 结构化输出

当你需要从网络输入有类型的、经过验证的结果时，请使用 `structuredOutput` 选项，网络完成其任务后，它会生成与你的 schema 匹配的结构化响应。

```ts
import { z } from "zod";

const resultSchema = z.object({
  summary: z.string().describe("A brief summary of the findings"),
  recommendations: z.array(z.string()).describe("List of recommendations"),
  confidence: z.number().min(0).max(1).describe("Confidence score")
});

const stream = await routingAgent.network("Research AI trends", {
  structuredOutput: {
    schema: resultScheme,
  },
})

// Consume the stream
for await (const chunk of stream) {
  if (chunk.type === "network-object") {
    // Partial object during generation
    console.log("Partial:", chunk.payload.object);
  }
  if (chunk.type === "network-object-result") {
    // Final structured object
    console.log("Final:", chunk.payload.object);
  }
}

// Get the typed result
const result = await stream.object;
console.log(result?.summary);
console.log(result?.recommendations);
console.log(result?.confidence);
```

### 流式输出部分对象

对于结构化输出生成期间的实时更新，请使用 `objectStream`：

```ts
const stream = await routingAgent.network("Analyze market data", {
  structuredOutput: { schema: resultSchema }
});

// Stream partial objects as they're generated
for await (const partial of stream.objectStream) {
  console.log("Building result:", partial);
}

// Get the final typed result
const final = await stream.object;
```
