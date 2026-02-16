---
order: 2
title: 使用工具
description: ' Agent 使用工具调用应用程序接口、查询数据库或运行代码库中的自定义功能。'
keywords: [Mastra, AI, Agents, Tools]
toc: content
group:
  title: Agents
  order: 2
---

# 使用工具

 Agent 使用工具来调用 API、查询数据库或从代码库运行自定义函数。工具通过提供对数据的结构化访问和执行明确定义的操作，为 Agent 提供了超越文本生成的功能。你还可以从 [远程 MCP 服务器](/docs/mcp-overview) 加载工具来扩展 Agent 的功能。

## 何时实用工具

当 Agent 需要来自远程资源的额外上下文或信息，或者需要运行执行特定操作的代码时，请使用工具。这包括模型无法自行可靠地处理的任务，例如获取实时数据或返回一致的、定义良好的输出。

:::warning
有些模型已经内置支持联网搜索，比如 qwen3-max，如果不支持可以基于 DuckDuckGo 编写 web search 工具。
:::

## 创建一个工具

创建工具时，请保持描述简单并重点关注工具的用途，强调其主要用例。描述性 Schema 名称还可以帮助指导 Agent 如何使用该工具。

此示例演示如何创建一个从 API 获取天气数据的工具。当代理调用该工具时，它会提供该工具的 `inputSchema`。该工具通过 `inputData` 参数访问此数据，在此示例中包括天气 API 查询用到的 `location` 参数。

```ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "weather-tool",
  description: "Fetches weather for a location",
  inputSchema: z.object({
    location: z.string(),
  }),
  outputSchema: z.object({
    weather: z.string(),
  }),
  execute: async (inputData) => {
    const { location } = inputData;

    const response = await fetch(`https://wttr.in/${location}?format=3`);
    const weather = await response.text();

    return { weather };
  },
});
```

## 向 Agent 添加工具

要使用 Agent 可以使用工具，请将其添加到 `tools` 中。**在 Agent 的系统提示中提及可用工具及其一般用途有助于代理决定何时调用工具以及何时不调用**。

通过将特定部分委托给各个工具， Agent 可以使用多个工具来处理更复杂的任务。代理根据用户的消息、 Agent 的指令以及工具描述和 Schema 来决定使用哪些工具。

```ts
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: `
    You are a helpful weather assistant.
    Use the weatherTool to fetch current weather data.
  `,
  model: "siliconflow-cn/Qwen/Qwen3-Coder-30B-A3B-Instruct",
  tools: { weatherTool }
});
```

## 调用 Agent 

 Agent 使用工具的 `inputSchema` 来推断该工具期望的数据。在本示例中，它从 `location` 消息中提取并将其传递给工具的 `inputData` 参数。

```ts
import { mastra } from "./mastra";
import "dotenv/config";

const agent = mastra.getAgent("weatherAgent");

const result = await agent.generate("What's the weather in Lindon?");
```

## 使用多个工具

当有多种工具可用时， Agent 可以选择使用一种、多种或不使用，具体取决于回答查询所需的内容。

```ts
import { weatherTool } from "../tools/weather-tool";
import { activitiesTool } from "../tools/activities-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  tools: { weatherTool, activitiesTool },
});
```

## 将工作流作为工具使用

工作流可以通过 `workflows` 配置添加到 Agent 重。添加工作流时，Mastra 会自动将其转换为 Agent 可调用的工具，生成的工具被命名为 `workflow-<workflowName>`，并采用工作流的 `inputSchema` 参数和 `outputSchema` 参数。

```ts
// src/mastra/agents/research-agent.ts
import { Agent } from "@mastra/core/agent";
import { researchWorkflow } from "../workflows/research-workflow";

export const researchAgent = new Agent({
  id: "research-agent",
  name: "Research Agent",
  instructions: `
    You are a research assistant.
    Use the research workflow to gather and compile information on
    topics.
  `,
  model: "siliconflow-cn/Qwen/Qwen3-Coder-30B-A3B-Instruct",
  tools: {
    weatherTool,
  },
  workflows: {
    researchWorkflow,
  },
});
```

工作流应包含一个说明，以帮助 Agent 理解何时使用它：

```ts
// src/mastra/workflows/research-workflow.ts
import { createWorkflow } form "@mastra/core/workflows";
import { z } from "zod";

export const researchWorkflow = createWorkflow({
  id: "research-workflow",
  description: "Gathers information on a topic and compiles a summary report.",
  inputSchema: z.object({
    topic: z.string(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    sources: z.array(z.string()),
  }),
})
  .then(gatherSourceStep)
  .then(compileReportStep)
  .commit();
;
```

当 Agent 调用一个工作流工具时，它会收到一个响应，响应内容包含工作流结果和一个可用于跟踪执行的 `runID`：

```ts
{
  result: {
    summary: "...",
    sources: ["..."],
  },
  runId: "abc-123"
}
```
