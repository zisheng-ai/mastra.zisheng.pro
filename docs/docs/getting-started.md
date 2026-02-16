---
order: 1
title: 开始
description: 'Mastra 是一个全面的开源框架，旨在简化 AI 应用开发流程。'
keywords: [Mastra, AI, Agents]
toc: content
group:
  title: 入门
  order: 1
---

# 开始

创建一个新的 Mastra 项目，或将 Mastra 与你喜欢的框架集成以开始构建。

`npm create mastra` 命令式构建第一个 Agent 的最快方法。它会引导你完成设置并生成一个示例 Agent ，你可以立即在 [Studio](/docs/studio) 中运行和调整。当你准备好时，你随时可以将 Mastra 与你的框架或 UI 集成。

## 开始之前

- 你需要一个模型 Provider 的 API 密钥。国内的同学建议使用硅基流动，它支持几乎所有的模型 Provider 。

## 手动安装

如果你不想使用我们的自动 CLI 工具，可以按照以下指南自行设置项目。

### 1、创建新项目并更改目录

```sh
mkdir my-first-agent && cd my-first-agent
```

初始化 TypeScript 项目并安装以下依赖项：

```sh
npm init -y
npm install -D typescript @types/node mastra@beta
npm install @mastra/core@beta zod@^4
```

在 `package.json` 文件中添加 `dev` 和 `build` 脚本。

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "mastra dev",
    "build": "mastra build"
  }
}
```

### 2、创建 `tsconfig.json` 文件：

```
touch tsconfig.json
```

添加以下配置：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

:::info
Mastra 需要现代 `module` 和 `moduleResolution` 设置。使用 `CommonJS` 或 `node` 会导致解析错误。
:::

### 3、创建 `.env` 文件：

```sh
touch .env
```

添加您的 API 密钥：

```sh
SILICONFLOW_API_KEY=<your-api-key>
```

本指南使用硅基流动，它支持大部分世面上的模型。但你可以使用任何受支持的模型 Provider ，包括 OpenAI、Anthropic、Gemini 等。

### 4、创建 `wether-tool.ts` 文件：

```sh
mkdir -p src/mastra/tools && touch src/mastra/tools/weather-tool.ts
```

添加以下代码：

```ts
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "获取一个位置的当前天气",
  inputSchema: z.object({
    location: z.string().describe("城市名"),
  }),
  outputSchema: z.object({
    output: z.string(),
  }),
  execute: async () => {
    return {
      output: "当前是晴天",
    }
  }
});
```

> 我们在此对 `weatherTool` 进行了简化，你可以在 [给 Agent 一个工具](/docs/agents-using-tools) 中查看完整的天气工具。

### 5、创建 `weather-agent.ts`

```sh
mkdir -p src/mastra/agents && touch src/mastra/agents/weather-agent.ts
```

添加以下代码：

```ts
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const weatherAgent = new Agent({
  id: "weather-agent",
  name: "Weather Agent",
  instructions: `
    你是一位有用的天气助手，提供准确的天气信息。

    你的主要功能是帮助用户获取特定位置的天气详细信息。回复时：
      - 如果没有提供位置，请务必询问位置
      - 如果地点名称不是英文，请翻译
      - 如果提供包含多个部分的位置（例如“New York，NW”），请使用最相关的部分（例如“New York”）
      - 包括湿度、风况和降水等相关详细信息
      - 保持回答简洁但内容丰富

    使用 weatherTool 获取当前天气数据。
`,
  model: "siliconflow-cn/Qwen/Qwen3-Coder-30B-A3B-Instruct",
  tools: { weatherTool },
});

```

### 6、创建 Mastra 入口点并注册你的代理：

```sh
touch src/mastra/index.ts
```

添加以下代码：

```ts
import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather-agent";

export const mastra = new Mastra({
  agents: { weatherAgent },
});
```

### 7、启动并测试你的代理

```sh
npm run dev
```

## 脚手架安装

你可以在机器上的任何位置运行 `npm create mastra@beta`，出现提示时，选择 Provider 并输入你的密钥。

这将为你的项目创建一个新目录，其中 `src/mastra` 文件夹包含天气 Agent 示例和以下文件：

- `index.ts`：Mastra 配置，包括 memory
- `tools/weather-tool.ts`：获取给定位置天气的工具
- `agents/weather-agent.ts`：带有使用该工具提示的天气代理

> 你可以使用带有 `--no-example` [标志](https://mastra.ai/reference/v1/cli/create-mastra#cli-flags) 的 `create mastra` 命令来跳过天气 Agent 示例或者 `--template` 从特定[模版](https://mastra.ai/templates)开始。
