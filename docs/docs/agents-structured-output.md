---
order: 4
title: 结构化输出
description: '结构化输出让 Agent 返回和定义的 schema 格式匹配的对象，而不是一个文本'
keywords: [Mastra, AI, Agents, Tools]
toc: content
group:
  title: Agents
  order: 2
---

# 结构化输出

结构化输出允许 Agent 返回符合 schema 定义的对象，而非文本。schema 告诉模型应生成哪些字段，而模型则确保最终结果符合该结构。

## 何时使用结构化输出

当需要 Agent 返回 JSON 对象而非字符串时，请使用结构化输出。明确定义的字段能简化数据提取流程，便于你为 API 调用、UI 渲染或应用程序逻辑提取所需的值。

## 定义 schema

 Agent 可以通过 Zod 或 JSON Schema 定义预期输出，返回结构化数据。强烈推荐使用 Zod，因其提供 TypeScript 类型推断和运行时验证；而当需要语言无关的格式时，JSON Schema 则更为实用。

:::code-group
```ts [Zod]
import { z } from "zod";

const response = await testAgent.generate("Help me plan my day.", {
  structuredOutput: {
    schema: z.array(
      z.object({
        name: z.string(),
        activities: z.array(z.string()),
      })
    )
  }
});

const.log(response.object);
```

```ts [JSON Schema]
const response = await testAgent.generate("Help me plan my day.", {
  structuredOutput: {
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          activities: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["name", "activities"],
      },
    },
  },
});

console.log(response.object);
```
:::

:::info
访问 [.generate](https://mastra.ai/reference/v1/agents/generate#structuredoutput) 以获取完整的配置选项列表。
:::

## 示例输出

`response.object` 文件将包含由 schema 定义的结构化数据：

```json
[
  {
    "name": "Morning Routine",
    "activities": ["Wake up at 7am", "Exercise", "Shower", "Breakfast"]
  },
  {
    "name": "Work",
    "activities": ["Check emails", "Team meeting", "Lunch break"]
  },
  {
    "name": "Evening",
    "activities": ["Dinner", "Relex", "Read a book", "Sleep by 10pm"]
  }
]
```

## 流式

流式传输同样支持结构化输出。最终的机构化对象可在完成后通过 `stream.fullStream` 和`stream.object` 获取。文本流分块仍会持续输出，但其中包含的是自然语言文本而非结构化数据。

```ts
import { z } from "zod";

const stream = await testAgent.stream("Help me plan my day.", {
  structuredOutput: {
    schema: z.array(
      z.object({
        name: z.string().
        activities: z.array(z.string())
      })
    ),
  },
});

for await (const chunk of stream.fullStream) {
  if(chunk.type === "object-result") {
    console.log("\n", JSON.stringify(chunk, null, 2));
  }
  process.stdout.write(JSON.stringify(chunk));
}

console.log(await stream.object)

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

## 结构化 Agent 

当你的主 Agent 不擅长生成结构化输出时，可以给 `structuredOutput` 提供一个 `model`。此时，Mastra 会在后台调用第二个代理，从主 Agent 的自然语言响应中提取结构化数据。这将触发两次大语言模型调用：一次用于生成响应，另一次将响应转换为结构化对象。虽然会增加延迟和成本，但能显著提升复杂结构化任务的准确性。

```ts
import { z } from "zod";

const response = await testAgent.generate("Analyze the TypeScript programming language.", {
  structuredOutput: {
    schema: z.object({
      overview: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      useCases: z.array(z.object({
        scenario: z.string(),
        reasoning: z.string(),
      })),
      comparison: z.object({
        similarTo: z.array(z.string()),
        differentiators: z.array(z.string()),
      })
    }),
    model: "openai/gpt-4o"
  }
});

console.log(response,object);
```

## LLM 结构化输出支持

由于模型本身的差异，大语言模型对结构化输出的支持程度各不相同。为充分利用结构化输出的全部功能（主要包括返回结构化输出、工具调用以及二者的组合），目前提供了多种变通方案。

### jsonPromptInjection

默认情况下，Mastra 会通过 `response_format` API 参数将模式传递给模型提供者。大多数模型提供者都内置了对此的支持，从而可靠地强制执行 schema。

如果你模型提供者不支持 `response_format`，API 将会返回错误，此时请设置 `jsonPromptInjection: true` 参数。该参数会将 schema 添加到系统提示词中，指示模型输出 JSON 格式。此方法的可靠性低于 API 参数设置方式。

```ts
import { z } from "zod";

const response = await testAgent.generate("Help me plan my day.", {
  structuredOutput: {
    schema: z.array(
      z.object({
        name: z.string(),
        activities: z.array(z.string()),
      }),
    ),
    jsonPromptInjection: true,
  }
});

console.log(response.object);
```

:::info
如果你使用千问模型家族，可以访问 [阿里云百炼结构化输出](https://bailian.console.aliyun.com/?tab=doc#/doc/?type=model&url=2862209) 查看详细信息。
:::

### 采用独立的结构化模型

当 `model` 被提供给 `structuredOutput` 属性时，Mastra 会使用一个独立的内部代理来处理结构化输出。主 Agent 将负责所有步骤（包括工具调用），而结构化输出模型仅在输出模型结构化输出的生成。

```ts
const response = await testAgent.generate("Tell me about TypeScript.", {
  structuredOutput: {
    schema: yourSchema,
    model: "openai/gpt-4o"
  }
});
```

### 多步骤方法 `prepareStep`

对于不支持同时处理工具和结构化输出的模型，你可以使用 `prepareStep` 在不同步骤中分别处理它们。

```ts
const result = await agent.steam("weather in vancouver?", {
  prepareStep: async () => {
    if (stepNumber === 0) {
      return {
        model: "anthropic/claude-sonnet-4-20250514",
        tools: {
          weatherTool,
        },
        toolChoice: "required"
      }
    }
    return {
      model: "anthropic/claude-sonnet-4-20250514",
      tools: undefined,
      structuredOutput: {
        schema: z.object({
          temperature: z.number(),
          humidity: z.number(),
          windSpeed: z.number(),
        })
      }
    };
  },
});
```

## 错误处理

当 schema 验证失败时，可通过 `errorStrategy` 控制错误处理方式。默认 `strict` 策略会抛出错误，而 `warn` 策略会记录警告并继续执行。`fallback` 策略则通过返回 `fallbackValue` 提供的值。

```ts
import { z } from "zod";

const response = await testAgent.generate("Tell me about TypeScript.", {
  structuredOutput: {
    schema: z.object({
      summary: z.string(),
      keyFeatures: z.array(z.string())
    }),
    errorStrategy: "fallback",
    fallbackValue: {
      summary: "TypeScript is a typed"
    }
  }
})
```
