---
order: 6
title:  处理器
description: 'Mastra 中的 Agent 网络通过协调多个 Agent 、工作流和工具，处理那些事前未明确定义、但可从用户消息或上下文中推断出的任务。'
keywords: [Mastra, AI, Agents, Tools, Network]
toc: content
group:
  title: Agents
  order: 2
---

处理器在消息通过 Agent 时对其进行转换、验证或控制。它们在 Agent 执行管道中的特定点执行，允许你在输入到达语言模型前修改输入，或者在输出返回给用户之前修改它们。

处理器配置：

- `inputProcessors`：在消息达到语言模型之前执行。
- `outputProcessors`：在语言模型生成响应之后、返回给用户之前执行。

你可以使用单个 `Processor` 对象或使用 Mastra 的工作流基本组件将它们组合到工作流程中。工作流使你可以对处理器执行顺序、并行处理和条件逻辑进行高级控制。

一些处理器同事实现输入和输出逻辑，并且可以在任一阵列中使用，具体取决于转换应该发生的位置。

## 何时使用处理器

使用处理器可以：

- 规范化或验证用户输入
- 为你的 Agent 添加护栏机制（Guardrails）
- 检测并防止提示注入或越狱尝试
- 出于安全或合规性考虑的适度内容
- 转换消息（例如，翻译语言、过滤工具调用）
- 限制 Token 使用或消息历史记录长度
- 编辑敏感信息（PII）
- 将自定义业务逻辑应用于消息

Mastra 包括多个用于常见用例的处理器。你还可以根据应用程序的特定要求创建自定义处理器。

## 将处理器添加到 Agent 

导入并实例化处理器，然后将 `inputProcessors` 或 `outputProcessors` 数组传递给 Agent ：

```ts
// src/mastra/agents/moderated-agent.ts
import { Agent } from "@mastra/core/agent";
import { ModerationProcessor } from "@mastra/core/processor";

export const moderatedAgent = new Agent({
  name: "moderated-agent",
  instructions: "You are a helpful assistant",
  model: "openai/gpt-4o-mini",
  inputProcessors: [
    new ModerationProcessor({
      model: "openai/gpt-4.1-nano",
      categories: ["hate", "harassment", "violence"],
      threshold: 0.7,
      strategy: "block",
    }),
  ],
});
```

## 执行顺序

处理器按照它们在数组中出现的顺序执行：

```ts
inputProcessors: [
  new UnicodeNormalizer(),
  new PromptInjectionDetector(),
  new ModerationProcessor(),
]
```

对于输出处理器，顺序决定了应用于模型响应的转换顺序。

### 启用 Memory

当 Agent 启用 memory 时，memory 处理器会自动添加到管道中：

**输出处理器：**

```txt
[Memory Processors] -> [Your inputProcessors]
```

Memory 首先加载消息历史记录，然后处理器运行。

**输出处理器：**

```txt
[Your outputProcessors] -> [Memory Processors]
```

你的处理器首先运行，然后 Memory 保存消息。

此顺序可确保你的输出护栏调用 `abort()` 来跳过 memory 处理器并且不保存任何信息。有关详细信息请参阅 [Memory 处理器](/docs/memory-processors)。

## 创建自定义处理器

自定义处理器实现 `Processor` 接口。

### 自定义输入处理器

```ts
// src/mastra/processors/custom-input.ts
import type {
  Processor,
  MastraDBMessage,
  RequestContext,
} from "@mastra/core";

export class CustomInputProcessor implements Processor {
  id = "custom-input";

  async processInput({
    messages,
    systemMessages,
    context,
  }: {
    message: MastraDBMessage[];
    systemMessages: CoreMessage[];
    context: RequestContext;
  }): Promise<MastraDBMessage[]> {
    // Transform messages before they reach the LLM
    return messages.map((msg) => ({
      ...msg,
      content: {
        ...msg.content,
        content: msg.content.content.toLowerCase(),
      }
    }));
  }
}
```

该 `processInput` 方法接收：

- `message`：`user` 和 `assistant` 的消息（不是 system 消息）
- `systemMessages`：所有系统消息（ Agent 指令、 memory 上下文、用户提供的系统提示）
- `messageList`：高级用例的完整 MessageList 实例
- `abort`：停止处理并提前返回的函数
- `requestContext`：执行元数据，例如：`threadId` 和 `resourceId`

该方法可以返回：

- `MastraDBMessage[]` - 转换后的消息数组（向后兼容）
- `{ message: MastraDBMessage[]; systemMessages: CoreMessage[] }` - 消息和修改后的系统消息

该框架处理两种返回格式，因此修改系统消息是可选的，并且现有处理器可以继续工作。

### 修改系统消息

要修改系统消息（例如，为小模型修剪提示词），请返回带有 `messages` 和 `systemMessages` 的对象：

```ts
// src/mastra/processors/system-trimmer.ts
import type { Processor, CoreMessage, MastraDBMessage } from "@mastra/core";

export class SystemTrimmer implements Processor {
  id = "system-trimmer"

  async processInput({
    messages,
    systemMessages,
  }): Promise<{ messages: MastraDBMessage[]; systemMessages: CoreMessage[] }> {
    // Trim system messages for smaller models
    const trimmedSystemMessages = systemMessages.map((nsg) => ({
      ...msg,
      content:
        typeof msg.content === "string"
          ? msg.content.substring(0, 500)
          : msg.content
    }));

    return { messages, systemMessages: trimmedSystemMessages };
  }
}
```

这对于下面的场景非常有用：

- 为较小上下文窗口的模型修剪系统提示词
- 过滤或修改语义召回内容，防止“提示词太长”错误
- 根据对话动态调整系统指令

### 使用 `processInputStep` 进行每步处理

在 Agent 开始时运行一次 `processInput`，在 Agent 循环的每个步骤运行 `processInputStep`（包括工具调用延续）。这使得每步配置更改成为可能，例如动态模型切换或工具选择修改。

```ts
// src/mastra/processors/step-processor.ts
import type { Processor, ProcessInputStepArgs, ProcessInputStepResult } from "@mastra/core";

export class DynamicModelProcessor implements Processor {
  id = "dynamic-model";

  async processInputStep({
    stepNumber,
    model,
    toolChoice,
    messageList,
  }: ProcessInputStepArgs): Promise<ProcessInputStepResult> {
    // Use a fast model for initial response
    if (stepNumber === 0) {
      return { model: "openai/gpt-4o-mini" };
    }

    // Disable tools after 5 step to force completion
    if(stepNumber > 5) {
      return { toolChoice: "none" }
    }

    // No changes for other steps
    return {};
  }
}
```

`processInputStep` 方法接收：

- `stepNumber`： Agent 循环中的当前步骤（从 0 开始的索引）
- `steps`：之前步骤的结果
- `messages`：当前消息快照（只读）
- `systemMessages`：当前系统消息（只读）
- `messageList`：用于变更的完整 MessageList 实例
- `model`：当前使用的模型
- `tools`：当前可用于此步骤的工具
- `toolChoice`：当前工具选择设置
- `activeTools`：当前活跃的工具
- `providerOptions`：特定提供者设置
- `modelSettings`：模型设置，例如 `temperature`
- `structuredOutput`：结构化输出

该方法可以返回以下任意组合：

- `model`：更改此步骤的模型
- `tools`：替换或添加工具（使用 spread 来合并 `{ tools: { ...tools, newTool }}`）
- `toolChoice`：更改工具选择行为
- `activeTools`：过滤哪些工具可用
- `messages`：替换消息（应用于 `messageList`）
- `systemMessages`：替换所有系统消息
- `providerOptions`：修改提供者配置
- `modelSettings`：修改模型配置
- `structuredOutput`：修改结构化输出配置

#### 使用 `prepareStep` 回调

对于更简单的每步逻辑，你可以使用 `generate()` 或 `stream()` 上的 `prepareStep` 回调来代替创建完整的处理器。

```ts
await agent.generate({
  prompt: "Complex task",
  prepareStep: async({ stepNumber,model }) => {
    if (stepNumber === 0) {
      return { model: "openai/gpt-4o-mini" };
    }
    if (stepNumber > 5) {
      return { toolChoice: "none" };
    }
  }
});
```

### 自定义输出处理器

```ts
// src/mastra/processors/custom-output.ts
import type {
  Processor,
  MastraDBMessage,
  RequestContext,
} from "@mastra/core";

export class CustomOutputProcessor implements Processor {
  id = "custom-output";

  async processOutputResult({
    messages,
    context,
  }: {
    messages: MastraDBMessage[];
    context: RequestContext;
  }): Promise<MastraDBMessage[]> {
    // Transform messages after the LLM generates them
    return messages.filter((msg) => msg.role !== "system");
  }

  async processOutputStream({
    stream,
    context,
  }: {
    stream: ReadableStream;
    context: RequestContext;
  }): Promise<ReadableStream> {
    // Transform streaming responses
    return stream;
  }
}
```

#### 在输出处理器中添加元数据

你可以将自定义元数据添加到消息的 `processOutputResult` 中。该元数据可通过响应对象访问：

```ts
// src/mastra/processors/metadata-processor.ts
import type { Processor, MastraDBMessage } from "@mastra/core";

export class MetadataProcessor implements Processor {
  id = "metadata-processor";

  async processOutputResult({
    messages,
  }: {
    messages: MastraDBMessage[];
  }): Promise<MastraDBMessage[]> {
    return messages.map((msg) => {
      if (msg.role === "assistant") {
        return {
          ...msg,
          content: {
            ...msg.content,
            metadata: {
              ...msg.content.metadata,
              processedAt: new Date().toISOString(),
              customData: "your data here",
            },
          },
        };
      }
      return msg;
    })
  }
}
```

使用 `generate()` 命令访问元数据：

```ts
const result = await agent.generate("Hello");

// The response includes uiMessages with processor-added metadata
const assistantMessage = result.response?.uiMessages?.find((m) => m.role === "assistant");
console.log(assistantMessage?.metadata?.customData);
```

流式输出时访问元数据：

```ts
const stream = await agent.stream("Hello");

for await (const chunk of stream.fullStream) {
  if (chunk.type === "finish") {
    // Access response with processor-added metadata from the finish chunk
    const uiMessages = chunk.payload.response?.uiMessages;
    const assistantMessage = uiMessages?.find((m) => m.role === "assistant");
    console.log(assistantMessage?.metadata?.customData);
  }
}

// Or via the response promise after consuming the stream
const response = await stream.response;
console.log(response.uiMessages);
```

## 内置使用处理器

Mastra 为常见任务提供使用处理器：

- 对于安全和验证处理器，请参阅 [护栏](docs/agents-guardrails) 页面以了解输入/输出护栏和审核处理器。
- 对于特定于 Memory 的处理器，请参阅 [Memory 处理器](docs/memory-processors) 页面，了解处理消息历史记录、语义召回和工作 Memory 的处理器。

### Token 限制器

当 Token 总量超过指定限制时，通过删除旧消息来防止上下文窗口溢出。

```ts
import { Agent } from "@mastra/core/agent";
import { TokenLimiter } from "@mastra/core/processors";

const agent = new Agent({
  name: "my-agent",
  model: "openai/gpt-4o",
  inputProcessors: [
    // Ensure the total tokens don't exceed ~127k
    new TokenLimiter(127000),
  ]
});
```

`TokenLimiter` M哦人使用 `o200k_base` 编码（适用于 GPT-4o）。你可以为不同的模型指定其他编码：

```ts
import cl100k_base from "js-tiktoken/ranks/cl100k_base";

const agent = new Agent({
  name: "my-agent",
  inputProcessors: [
    new TokenLimiter({
      limit: 16000, // Example limit for a 16k context model
      encoding: cl100k_base,
    }),
  ]
});
```

### ToolCallFilter

从发送到 LLM 的消息中删除工具调用，通过排除潜在的冗长工具交互来节省 Token。

```ts
import { Agent } from "@mastra/core/agent";
import { ToolCallFilter, TokenLimiter } from "@mastra/core/processors";

const agent = new Agent({
  name: "my-agent",
  model: "openai/gpt-4o",
  inputProcessors: [
    // Example 1: Remove all tool calls/results
    new ToolCallFilter(),

    // Example2: Remove only specific tool calls
    new ToolCallFilter({ exclude: ["generateImageTool"] }),

    // Always place TokenLimiter last
    new TokenLimiter(127000),
  ],
});
```

:::info
上面的示例过滤了工具调用并限制了 LLM 的 Token，但这些过滤后的消息仍将保存在 Memory 中。要在将消息保存到 Memory 之前将其过滤，请在 utility 处理器之前手动添加内存处理器。有关详细信息，请参阅 [Memory 处理器](docs/memory-processors#手动控制和重复数据删除)
:::

## 使用工作流作为处理器

你可以使用 Mastra 工作流作为处理器来创建具有并行执行、条件分支和错误处理功能的复杂处理管道：

```ts
// src/mastra/processors/moderation-workflow.ts
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { ProcessorStepSchema } from '@mastra/core/processors';
import { Agent } from "@mastra/core/agent";

// Create a workflow that runs multiple checks in parallel
const moderationWorkflow = createWorkflow({
  id: "moderation-pipeline",
  inputSchema: ProcessorStepSchema,
  outputSchema: ProcessorStepSchema,
})
  .then(createStep(new LengthValidator({ maxLength: 10000 })))
  .parallel([
    createStep(new PIIDetector({ strategy: "redact" })),
    createStep(new ToxicityChecker({ threshold: 0.8 })),
  ])
  .commit();

// Use the workflow as an input processor
const agent = new Agent({
  id: "moderated-agent",
  name: "Moderated Agent",
  model: "openai/gpt-4o",
  inputProcessors: [moderationWorkflow],
});
```

当 Agent 注册到 Mastra 时，处理器工作流会自动注册为工作流，允许你在 [Studio](docs/studio) 中查看和调试它们。

## 重试机制

处理器可以请求 LLM 重试其响应并提供反馈。这对于实施质量检查、输出验证或迭代细化非常有用：

```ts
// src/mastra/processors/quality-checker.ts
import type { Processor } from "@mastra/core";

export class QualityChecker implements Processor {
  id = "quality-checker";

  async processOutputStep({ text, abort, retryCount }) {
    const qualityScore = await evaluateQuality(text);

    if (qualityScore < 0.7 && retryCount < 3) {
      // Request a retry with feedback for the LLM
      abort("Response quality score too low. Please provide a more detailed answer.", {
        retry: true,
        metadata: {
          score: qualityScore
        }
      })
    }
  }
}

const agent = new Agent({
  id: "quality-agent",
  name: "Quality Agent",
  model: "openai/gpt-4o",
  outputProcessors: [new QualityChecker()],
  maxProcessorRetries: 3, // Maximum retry attempts(default: 3)
});
```

重试机制：

- 只适用于 `processOutputStep` 和 `processInputStep` 方法
- 重播该步骤，并将中止原因添加为 LLM 的上下文
- 通过 `retryCount` 参数跟踪重试计数
- 尊重 Agent 的 `maxProcessorRetries` 限制
