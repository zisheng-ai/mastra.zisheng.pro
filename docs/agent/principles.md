---
order: 1
title: 《构建 Agent 的原则》
description: '本书分为几个不同的部分。给大语言模型（LLM）写提示词提供了一些关于 LLM 是什么、如何选择它们以及如何与他们交流的背景知识。构建 Agent 介绍了人工智能开发的一个关键构建块。 Agent 是 LLM 之上的一层：它们可以执行代码、存储和访问记忆，并与其他 Agent 进行通信。聊天机器人通常由 Agent 驱动。当 Agent 的输出不够稳定或可预测时，基于图的工作流已成为一种构建大语言模型应用的有效方法。检索增强生成（RAG）涵盖了一种常见的 LLM 驱动搜索模式。RAG 帮助你搜索大型语料库。'
keywords: [大语言模型, 文本生成模型, 大模型, AI, Agents]
toc: content
nav:
  title: Agents
  order: 3
---

我们把这本书分为几个不同的部分。给大语言模型（LLM）写提示词介绍了关于 LLM 是什么、如何选择它们以及如何与它们交流的背景知识。构建 Agent 介绍了人工智能开发的一个关键构建块。 Agent 是 LLM 之上的一层：它们可以执行代码、存储和访问记忆，并与其他 Agent 进行通信。聊天机器人通常由 Agent 驱动。当 Agent 的输出不够稳定或可预测时，基于图的工作流已成为一种构建大语言模型应用的有效方法。检索增强生成（RAG）涵盖了一种常见的 LLM 驱动搜索模式。RAG 帮助你搜索大型语料库。

## 导言

（通常是专有的）信息，以便在每次调用大语言模型（LLM）时仅传递相关的部分。多 Agent 系统（Multi-agent systems）关注的是将 Agent 投入生产环境时所需的协调问题，这类问题往往涉及大量的组织架构设计！

通过评估（Eval）进行测试，对于验证你的应用是否为用户提供了足够高的质量至关重要。

本地开发（local dev）和无服务器部署（serverless deployment）是你代码必须能正常运行的两个关键环境：你需要能够在本地机器上快速迭代，然后迅速将代码部署到互联网上。

请注意，我们这里不讨论传统的机器学习（ML）话题，例如强化学习、模型训练和微调。如今，大多数 AI 应用只需要使用大语言模型（LLM），而无需自己从头构建它们。

## 第一部分：给大语言模型写提示词

### 大语言模型简史

人工智能在过去四十多年里一直是一项“即将实现”的技术，始终出于地平线上。在 2000 年代和 2010 年代，曾取得若干显著进展：国际象棋引擎、语音识别、自动驾驶汽车等。

而“生成式 AI”领域的大部分突破始于 2017 年——。当时，谷歌的八位研究人员发表了一篇题为《Attention is All You Need》（《注意力就是你所需要的一切》）的论文。

该论文提出了一种用于生成文本的新架构：一个“大语言模型”（LLM）接收一组“词元”（Token，即词语和标点符号），并专注于预测下一个“词元”。

下一个重大飞跃发生在 2022 年 11 月：一家资金雄厚的初创公司 OpenAI 推出了一款名为 ChatGPT 的聊天界面，一夜之间迅速走红。

今天，有几家不同的 Provider 提供大语言模型，它们既提供聊天界面，也提供开发者 API：

- OpenAI：由包括人工智能研究员伊利亚·苏茨克沃、软件工程师格雷格·布罗克曼、YC 负责人萨姆·阿尔特曼和埃隆·马斯克在内的八个人于 2015 年创立。
- Anthropic（Claude）：由达里奥·阿莫迪和一群前 OpenAI 研究员于 2020 年创立。生产流行的代码编写模型以及 API 驱动的任务。
- 谷歌（Gemini）：核心 LLM 由谷歌在 2014 年收购的 DeepMind 团队生产。
- Meta（Llama）：Facebook母公司生产 Llama 类开源模型。被认为是美国领先的开源人工智能团体。
- 其他包括千问（阿里巴巴大模型）、DeepSeek（一家开源中国公司）

### 寻找 Provider 和模型

在构建人工智能应用时，你需要首先考虑的是选择哪种模型。以下是一些考虑因素：

**托管于开源：**

在构建人工智能应用时，我们通常给出的第一条建议是，从像 OpenAI、Anthropic 或谷歌 Gemini 这样的托管 Provider 开始。即使你认为你要使用开源、原型设计云 API，或者你会调试基础设施问题而不是真正迭代代码，但有一种方法可以在不重写大量代码的情况下做到这一点，那就是使用模型路由库（后面会介绍更多）。

**模型尺寸：精度vs成本/延迟：**

大语言模型通过将数字数组和矩阵相乘来工作。每个 Provider 都有更大的模型，这些模型更昂贵、更精确、速度更慢，还有更小的模型，这些模型速度更快、成本更低、准确度更低。我们通常建议人们在原型设计时使用更昂贵的模型——一旦你得到一个能正常运行的模型，你可以调整成本。

**上下文窗口大小：**

你可能需要考虑的一个变量是模型的“上下文窗口”。它能接收多少个 token？有时，特别是在早期原型设计节点，你可能希望向模型输入大量上下文，以节省选择相关上下文的精力。目前，最长的上下文属于谷歌的 Gemini Flash 系列模型；Gemini Flash 1.5 Pro 支持 200 万个 Token 的上下文窗口（大约 4000 页文本）。这可以实现一些有趣的应用；你可以想象一个支持助理，其上下文窗口包含整个代码库。

**推理模型：**

另一种模型是所谓的“推理模型”，即大模型在返回响应之前会在内部进行大量逻辑推理。大模型可能需要几秒钟或几分钟才能给出响应，并且会一次性返回响应（同时在过程中流式传输一些“思考步骤”）。推理模型正字啊变得更好，而且速度很快。现在，他们能够分解复杂的问题，并实际上一步一步地思考它们，几乎就像人类一样。发生了什么变化？像思维链这样的新技术让这些模型能够展示大模型的工作过程。更好的是，像“链式提示”和“链式偏好优化”这样的新方法帮助大模型保持专注。大模型不再絮絮叨叨——写每一个微小细节或重复自己——而是直奔主题，只分享最重要的步骤，跳过无关的内容。这意味着你会得到清晰、高效的推理，而不是一堆文字。

底线是：如果你给这些模型足够的上下文和良好的示例，大模型可以为棘手的问题提供令人惊讶的智能、高质量的答案。例如，如果你想让模型帮助你诊断一个棘手的医学病例，给大模型提供病人的病史、症状和几个样本病例，会比指纹一个模糊的问题要好得多。诀窍仍然是一样的：你越早帮助大模型，大模型的推理能力就越强。你应该把推理模型看做是“报告生成器”——你需要通过多次提示（后面会讲更多）提前给它们提供大量上下文。如果你这样做，大模型就能返回高质量的响应。如果没有这样做，大模型就会脱轨。

:::info
建议阅读：本·希拉克的《o1不是一个聊天模型》
:::

### 编写好的提示词

在人工智能工程中，编写好的提示词是基础技能之一。如果你知道如何很好地指示它们，LLM 将遵循指示。以下是一些提示和技巧：

给 LLM 更多的例子，这里有三种基本的提示技巧。

- 零样本：使用“YOLO”方法。提出问题并希望得到最好的结果。
- 单样本：提出一个问题，然后提供一个示例（输入+输出）来引导模型。
- 少量样本：提供多个示例，以更精确地控制输出

更多的例子=更多的指导，但也需要更多的时间。

一个实用的方法是：

如果你不确定从哪里开始，你可以请模型为你生成一个提示。例如，“生成一个提示，请求一张狗和鲸鱼玩耍的图片。”这给了你一个坚实的 v1 来改进。你还可以请模型建议你如何改进提示词。通常你应该向同一个模型提出请求：claude 最适合为 claude 生成提示，gpt-4o 适合 gpt-4o，等等。我们实际上是在 Mastra 的本地开发环境中构建了一个提示 CMS，就是为了这个原因。

### 使用系统提示

在通过 API 访问模型时，它们通常具有设置系统提示词的能力，例如，赋予模型你想要的特征。这将作为特定“用户提示”的补充。一个有趣的例子是，要求模型以不同的身份回答同一个问题，例如，例如史蒂夫·乔布斯与比尔·盖茨，或者哈利·波特与德拉科·马尔福。这有助于你塑造基调。

 Agent 或助手会做出回应，但通常不会提高准确性。`

### 奇怪的格式设置技巧

人工智能模型可能会对格式敏感——你可以利用这一点：

大写可以增加某些词的权重。类似 XML 的结构可以帮助模型更精准地遵循指令。claude 和 gpt-4 对结构化提示（如任务、上下文、约束）的响应更好。

实验和微调——结构上的小变化可能会产生巨大的差异！你可以使用评估来衡量（后面会更多地讨论这一点）。

例子：一个很好的提示

如果你认为你的提示很详细，请仔细阅读一些阅读一些生产提示。他们往往非常详细。以下是一个（大约三分之一）实时生成代码的提示示例（在名为 bolt.new 的工具中使用）。

```markdown
You are Bolt, an export AI assistant and exceptional senior software developer with vast knowledge across multiple programming languages, frameworks, and best practices.

<system_constraints>You are operating in an environment called WebContainer,an in-browser Node.js runtime that emulates a Linux system to som degree. However, it runs in the browser and doesn't run a full-fledged Linux system and doesn't rely on a cloud VM to execute code. All code is executed in the browser. It does come with a shell that emulates zsh. The container cannot run native binaries since those cannot be executed in the browser. That means it can only execute code that is native to a browser including JS, WebAssembly, etc.

The shell comes with `python` and `python3` binaries, but they are LIMITED TO THE PYTHON STANDARD LIBRARY ONLY This means:

- There is NO \`pip\` support! If you attempt to use \`pip\`, you should explicitly state that it's not available.
-CRITICAL: Third-party libraries cannot be installed or imported.
- Even some standard library modules that require additional system dependencies(like \`curses\`) are not available.
- Only modules from the core Python standard library can be used.
Additionally. there is no `g++` or any C/C++ compiler available.
WebContainer CANNOT run native binaries or compile C/C++ code!

Keep these limitation in mind when suggesting Python or C++ solutions and explicitly mention these constraints if relevant to the task at hand.

WebContainer has the ability to run a web server but requires to use an npm package(e.g. Vite, server, http-server) or use the Node.js APIs to implement a web server.

// ...
```

:::info
更多优秀例子可以参考下面两个提示词项目：

- [prompts.chat](https://prompts.chat/)
- [system-prompts-and-models-of-ai-tools](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools)
:::

## 第二部分：构建 Agent 

你可以使用直接的大语言模型（LLM）调用来完成一次性转换任务，例如：“给定一段视频文字稿，撰写一份草稿描述。”

而对于持续、复杂的交互，通常需要在其之上构建一个 Agent （agent）。可以把 Agent 看作是“AI 员工”，而非“外包承包商”：它们能保持上下文记忆，拥有特定角色，并能使用工具来完成任务。

### 自主程度

关于“ Agent ”（agents）和“自主性”（agency）的定义众说纷纭。我们更倾向于将自主性视为一个连续谱系（spectrum）。就像自动驾驶汽车一样， Agent 的自主程度也分为不同等级。

在低层， Agent 在决策树中做出二元选择。在中层， Agent 具有记忆、调用工具和重试失败的任务。在高层， Agent 进行规划，将任务分解为子任务，并管理其任务队列。

本书主要关注自主程度较低到中等的 Agent 。目前，广泛部署的高自主度 Agent 很少见。

在 Mastra 中，代理具有持久的记忆、一致的模型配置，并且可以访问一组工具和工作流。以下是如何创建一个基本 Agent ：

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4o-mini"),
})
```

### 模型路由

能够无需学习多个 【】的 SDK，就快速测试和尝试不同的模型，这是非常有用的。这种做法被称为模型路由（model routing）。
以下是一个使用 AI SDK 库的 JavaScript 示例：

```ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "mastra/core/agent";

const agent = new Agent({
  name: "weather-agent",
  instructions: "Instructions for the agent...",
  model: openai("gpt-4-turbo"), // Model comes directly from AI SDK
});

// Use the agent
const result = await agent.generate("What is the weather like?");
```

### 结构化输出

当你将 LLM 作为应用程序一部分时，通常希望它们以 JSON 格式返回数据，而不是无结构的文本。大多数模型支持“结构化输出”，以实现这一点。以下是通过提供 schema 来请求结构化响应的例子：

```ts
import { z } from "zod";

const mySchema = z.object({
  definition: z.string(),
  examples: z.array(z.string()),
});

const response = await llm.generate(
  "Define machine learning and give examples.",
  output: mySchema,
);

console.log(response.object);
```

在处理非结构化或半结构化文本时，LLM 非常强大。例如，可以传递简历文本并提取职位、雇主和日期范围的列表，或者传递医疗记录并提取症状列表。

### 工具调用
