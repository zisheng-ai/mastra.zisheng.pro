---
order: 7
title: 护栏
description: ' Agent 使用处理器对输入和输出应用护栏。它们在每次交互之前或之后运行，让你可以在用户和 Agent 之间传递信息时查看、转换或组织信息。'
keywords: [Mastra, AI, Agents, Tools, Network, Guardrails]
toc: content
group:
  title: Agents
  order: 2
---

 Agent 使用处理器对输入和输出应用护栏。它们在每次交互之前或之后运行，让你可以在用户和 Agent 之间传递信息时查看、转换或阻止信息。

处理器可以配置为：

- **`inputProcessors`**：在消息到达语言模型之前应用。
- **`outputProcessors`**：应用于响应返回给用户之前。

一些处理器是混合 `inputProcessors` 和 `outputProcessors` 的，这意味着它们可以一起使用，具体取决于应应用逻辑的位置。

## 何时使用处理器

使用处理器进行内容审核、提示注入预防、响应清理、消息转换和其他与安全相关的控制。Mastra 为常见用例提供了多个内置输入和输出处理器。

## 将处理器添加到 Agent 

导入并实例化相应的处理器类，然后通过 `inputProcessors` 或 `outputProcessors` 选项将其传入 Agent 的配置中：

```ts
// src/mastra/agents/moderated-agent.ts
import { Agent } from "@mastra/core/agent";
import { ModerationProcessor } from '@mastra/core/processors';

// moderated = 被审核的、被监管的
export const moderatedAgent = new Agent({
  id: "moderated-agent",
  name: "Moderated Agent",
  instructions: "You ara a helpful assistant",
  model: "openai/gpt-5.1",
  inputProcessors: [
    new ModerationProcessor({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      categories: ["hate", "harassment", "violence"],
      threshold: 0.7,
      strategy: "block",
      instructions: "Detect and flag inappropriate content in user messages",
    })
  ]
});
```

## 输入处理器

在用户消息到达大语言模型之前应用处理器。它们对于规范化、验证、内容审核、提示注入检测和安全检查非常用。

### 规范化用户信息

`UnicodeNormalizer` 是一个输入处理器，通过统一 Unicode 字符、标准化空白和删除有问题的字符来清理和规范用户输入，从而使 LLM 能够更好地理解用户消息。

```ts
// src/mastra/agents/normalized-agent.ts
import { UnicodeNormalizer } from "@mastra/core/processors";

export const normalizedAgent = new Agent({
  id: "normalized-agent",
  name: "Normalized Agent",
  inputProcessors: [
    new UnicodeNormalizer({
      // 移除字符串中的控制子符
      stripControlChars: true,
      // 将字符串中的连续空白字符压缩为单个空格，并去除收尾空白。
      collapseWhitespace: true,
    }),
  ]
});
```

:::info
访问 [UnicodeNormalizer](https://mastra.ai/reference/processors/unicode-normalizer) 以获取配置选项的完整列表。
:::

### 防止提示注入

`PromptInjectionDetector` 是一个输入处理器，用于扫描用户消息以查找提示注入、越狱尝试和系统覆盖模式。它使用 LLM 对有风险的输入进行分类，并可以在其到达模型之前阻止或重写它。

```ts
// src/mastra/agents/secure-agent.ts
import { PromptInjectionDetector } from "@mastra/core/processors";

export const secureAgent = new Agent({
  id: "secure-agent",
  name: "Secure Agent",
  inputProcessors: [
    new PromptInjectionDetector({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      threshold: 0.8,
      strategy: "rewrite",
      // 提示词注入攻击、越狱攻击、系统指令覆写尝试
      detectionTypes: ["injection", "jailbreak", "system-override"]
    })
  ]
})
```

:::info
请访问 [PromptInjectionDetector](https://mastra.ai/reference/processors/prompt-injection-detector) 以获取配置选项的完整列表。
:::

### 检测和翻译语言

`languageDetector` 是一个输入处理器，可检测用户消息并将其翻译为目标语言，从而在保持一致交互的同时实现多语言支持。它使用 LLM 来识别语言并执行翻译。

```ts
// src/mastra/agents/multilingual-agent.ts
import { LanguageDetector } from "@mastra/core/processors";

export const multilingualAgent = new Agent({
  id: "multilingual-agent",
  name: "Multilingual Agent",
  inputProcessors: [
    new LanguageDetector({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      targetLanguages: ["English", "en"],
      strategy: "translate",
      threshold: 0.8,
    }),
  ],
});
```

:::info
请访问 [LanguageDetector](https://mastra.ai/reference/processors/language-detector) 以获取配置选项的完整列表。
:::

## 输出处理器

输出处理器在语言模型生成响应之后但在将其返回给用户之前应用。他们对于响应优化、调节、转换和应用安全控制很有用。

### 批处理流输出

`BatchPartsProcessor` 是一个输出处理器，在将多个 stream 流部分发送给客户端之前将其组合起来。这通过将小块合并成更大的批次，降低了网络开销并提升了用户体验。

```ts
// src/mastra/agents/batched-agent.ts
import const batchedAgent = new Agent({
  id: "batched-agent",
  name: "Batched Agent",
  outputProcessors: [
    new BatchPartsProcessor({
      batchSize: 5,
      maxWaitTime: 100,
      emitOnNonText: true,
    })
  ]
})
```

:::info
访问 [BatchPartsProcessor](https://mastra.ai/reference/processors/batch-parts-processor) 查看完整的配置选项列表。
:::

### 限制 Token 使用

`TokenLimiterProcessor` 是一个输出处理器，用于限制模型相应中的符号数量。它通过在超过限制时截断或阻断消息，帮助管理成本和性能。

```ts
// src/mastra/agents/limited-agent.ts
import { TokenLimiterProcessor } from "@mastra";

export const limitedAgent = new Agent({
  id: "limited-agent",
  name: "Limited Agent",
  outputProcessors: [
    new TokenLimiterProcessor({
      limit: 1000,
      // 策略：截断
      strategy: "truncate",
      // 统计模式：累计
      countMode: "cumulative"
    })
  ]
})
```

:::info
访问 [TokenLimiterProcessor](https://mastra.ai/reference/processors/token-limiter-processor) 查看完整的配置选项列表。
:::

### 清洗系统提示

`SystemPromptScrubber` 是一个输出处理器，用于检测并遮掩模型响应中的系统提示或其他内部指令。它有助于防止即时内容或配置细节的意外泄露，从而带来安全风险。它使用大语言模型根据配置的检测类型识别和编辑敏感内容。

```ts
// src/mastra/agents/scrubbed-agent.ts
import { SystemPromptScrubber } from "@mastra/core/processors";

const scrubbedAgent = new Agent({
  id: "scrubbed-agent",
  name: "Scrubbed Agent",
  outputProcessors: [
    new SystemPromptScrubber({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      strategy: "redact",
      customPatterns: ["system prompt", "internal instructions"],
      includeDetections: true,
      instructions: "Detect and redact system prompts, internal instructions, and security-sensitive content",
      redactionMethod: "placeholder",
      placeholderText: "[REDACTED]"
    })
  ]
});
```

:::info
请访问 [SystemPromptScrubber](https://mastra.ai/reference/processors/system-prompt-scrubber) 查看完整的配置选项列表。
:::

> 通过 HTTP 传输流式响应时，Mastra 默认会在服务器端对流数据块中的敏感请求数据（系统提示、工具定义、API 密钥）进行脱敏处理。详情请参阅 [“流数据脱敏”](https://mastra.ai/docs/server/mastra-server#stream-data-redaction) 部分 。

## 混合处理器

混合处理器既可以在消息发送到语言模型之前应用，也可以在相应返回给用户之前应用。它们对内容审核和个人身份信息（PII）编辑等任务非常有用。

### 调节输入和输出

`ModerationProcessor` 是一个混合处理器，能够检测仇恨、骚扰和暴力等各类不当或有害内容。根据应用场景的不同，它可以用于审核用户输入或模型输出。它使用逻辑层模型（LLM）对消息进行分类，并可根据您的配置阻止或重写消息。

```ts
import { ModerationProcessor } from "@mastra/core/processors";

export const moderatedAgent = new Agent({
  id: "moderated-agent",
  name: "Moderated Agent",
  inputProcessors: [
    new ModerationProcessor({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      threshold: 0.7,
      strategy: "block",
      categories: ["hate", "harassment", "violence"]
    })
  ],
  outputProcessors: [
    new ModerationProcessor(),
  ]
})
```

:::info
请访问 [ModerationProcessor](https://mastra.ai/reference/processors/moderation-processor) 查看完整的配置选项列表。
:::

### 检测和编辑个人身份信息

`PIIDetector` 是一款混合处理器，能够检测并移除个人身份信息，例如电子邮件地址、电话号码和信用卡信息。根据应用场景的不同，它可以对用户输入或模型输出进行信息编辑。它使用 LLM 根据配置的检测类型来识别敏感信息。

```ts
// src/mastra/agents/private-agent.ts
import { PIIDetector } from "@mastra/core/processors";

export const privateAgent = new Agent({
  id: "private-agent",
  name: "Private Agent",
  inputProcessors: [
    new PIIDetector({
      model: "openrouter/openai/gpt-oss-safeguard-20b",
      threshold: 0.6,
      strategy: "redact",
      // 脱敏方法
      redactionMethod: "mask",
      // 检测类型
      detectionTypes: ["email", "phone", "credit-card"],
      instructions: "Detect and mask personally identifiable information."
    }),
  ],
  outputProcessors: [
    new PIIDetector(),
  ]
});
```

:::info
请访问 [PIIDetector](https://mastra.ai/reference/processors/pii-detector) 查看完整的配置选项列表。
:::

## 应用多处理器

你可以通过在 `inputProcessors` 或 `outputProcessors` 数组中列出多个处理器来应用它们。这些处理器按顺序运行，每个处理器接收前一个处理器的输出。

典型的顺序可能是：

1. **规范化（Normalization）**：标准化输入格式（`UnicodeNormalizer`）
2. **安全检查（Security checks）**：检测威胁或敏感内容（`PromptInjectionDetector`、`PIIDetector`）
3. **过滤（Filtering）**：阻止或转换消息（`ModerationProcessor`）

顺序会影响行为，因此要根据你的目标安排处理器。

```ts
// src/mastra/agents/test-agent.ts
import {
  UnicodeNormalizer,
  ModerationProcessor,
  PromptInjectionDetector,
  PIIDetector,
} from "@mastra/core/processors";

export const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  inputProcessors: [
    new UnicodeNormalizer(),
    new PromptInjectionDetector(),
    new PIIDetector(),
    new ModerationProcessor(),
  ]
})
```

## 处理器策略

许多内置处理器支持 `strategy` 参数，用于控制它们如何处理标记的输入或输出。支持的值可能包括：`block`、`warn`、`detect`、`redact`。

大多数策略允许请求持续进行而不中断。当使用 `block` 时，处理器会调用其内部的 `abort()` 函数，该函数会立即停止请求并组织任何后续处理器运行。

```ts
// src/mastra/agents/private-agent.ts
import { PIIDetector } from "@mastra/core/processors";

export const privateAgent = new Agent({
  id: "private-agent",
  name: "Private Agent",
  inputProcessors: [
    new PIIDetector({
      strategy: "block",
    })
  ]
})
```

> PIIDetector 是一个用于检测和识别个人身份信息（PII，Personally Identifiable Information）的工具、组件或服务，广泛应用于数据安全、隐私合规（如 GDPR、CCPA）、大语言模型（LLM）输出过滤等场景。

### 处理被阻塞的请求

档处理阻塞请求时，代理仍会成功返回，而不会抛出错误。要处理阻塞的请求，请检查响应中是否 `tripwire`

例如，如果 Agent 使用 `strategy: "block"` 和 `PIIDetector`，并且请求包含信用卡号，则该请求将被阻止，并且响应将包含触发信息。

#### `.generate()` 示例

```ts
const result = await agent.generate(
  "Is this credit card number valid?: 4543 1374 5089 4332",
);

if(result.tripwire) {
  console.error("Blocked:", result.tripwire.reason);
  console.error("Processor:", result.tripwire.processorId);
  // Optional: check if retry was requested
  console.error("Retry requested:", result.tripwire.retry);
  // Optional: access additional metadata
  console.error("Metadata:", result.tripwire.metadata);
}
```

#### `.stream()` 示例

```ts
const stream = await agent.stream(
  "Is this credit card number valid?: 4543 1374 5089 4332",
);

for await (const chunk of stream.fullStream) {
  if(chunk.type === "tripwire") {
    console.error("Blocked:", chunk.payload.reason);
    console.error("Processor:", chunk.payload.processorId);
  }
}
```

在这种情况下，`reason` 表明检测到了信用卡号码：

```ts
PII detected. Types: credit-card
```

### 请求重试

处理器可以请求 LLM 重试响应并提供反馈。这对于实现质量检查非常有用：

```ts
export class QualityChecker implements Processor {
  id = "quality-checker",

  async processOutputStep({ text, abort, retryCount }) {
    const score = await evaluateQuality(text);

    if(score < 0.7 && retryCount < 3) {
      // Request retry with feedback for the LLM
      abort("Response quality too low. Please be more specific.", {
        retry: true,
        metadata: { score },
      })
    }

    return [];
  }
}
```

`abort()` 函数接受一个可选的第二个参数，其值为：

- `retry: true` - 请求 LLM 重试该步骤
- `metadata: unknown` - 附加用于调试/日志记录的额外数据

使用 `retryCount` 跟踪重试次数并防止无限循环。

## 定制处理器

如果内置处理器不能满足你的需求，你可以通过扩展 `Processor` 类来创建自己的处理器。

示例：

- [消息长度限制器](https://github.com/mastra-ai/mastra/tree/main/examples/processors-message-length-limiter)
- [响应长度限制器](https://github.com/mastra-ai/mastra/tree/main/examples/processors-response-length-limiter)
- [响应验证器](https://github.com/mastra-ai/mastra/tree/main/examples/processors-response-validator)
