---
order: 2
title: Studio
description: 'Studio 提供了一个用于构建和测试代理的交互式用户界面，以及一个将 Mastra 应用程序作为本地服务公开的 REST API。'
keywords: [Mastra, AI, Agents, Studio]
toc: content
group:
  title: 入门
  order: 1
---

# Studio

Studio 提供了用于构建和测试 Agent 的交互式 UI，以及将 Mastra 应用程序公开为本地服务的 REST API。这让你可以立即开始构建，而不必担心集成问题。

随着项目的发展，Studio 的开发环境可以帮助你快速迭代 Agent 。同时，可观察性（Observability）和评分器（Scorer）功能使你可以了解每个阶段的表现。

首先，请按照一下说明在本地运行 Studio 与你的团队进行协作。

## 开始使用 Studio

如果你已经使用 `npx mastra create` 创建了应用程序，请使用 `npm run dev` 脚本启动本地开发服务器。你也可以使用 `mastra dev` 运行它。

服务器运行后，你可以：

- 打开 <http://localhost:4111/> 打开 Studio UI 以交互方式测试你的代理。
- 访问 <http://localhost:4111/swagger-ui> 来发现底层 REST API 并与之交互。

## Studio UI

Studio UI 提供了一个交互式开发环境，供你测试代理、工作流和工具，准确观察每次交互的幕后情况，并随时进行调整。

## Agents

直接与你的 Agent 聊天，动态切换模型，并调整 `temperature` 和 `top-p` 等设置，以了解它们如何影响输出。

当你与代理交互时，你可以遵循其推理的每个步骤，查看工具调用输出，并 观察跟踪和日志以了解如何生成响应。你还可以附加评分器来衡量和比较一段时间内的响应质量。

## Workflow

将你的工作流程可视化为图标可视化为图，并使用自定义输入逐步运行它。在执行过程中，界面会实时更新以显示活动步骤和所采取的路径。

运行工作流时，你还可以查看详细跟踪，显示工具调用、原始 JSON 输出以及在此过程中可能发生的任何错误。

## Tools

单独运行工具以观察其行为。在将它们分配给你的代理之前对其进行测试，或者在出现问题时隔离它们以调试问题。

## MCP

列出链接到你的 Mastra 实例的 MCP 服务器并探索其可用工具。

## Observability 可观察性

当你运行 Agent 或工作流时，“可观察性” 选项卡会突出关键 AI 操作（例如模型调用、工具执行和工作流步骤）的跟踪。跟踪这些痕迹可以了解数据如何移动、时间花在哪里以及幕后发生了什么。

跟踪会过滤掉底层框架细节，以便你的跟踪保持专注且可读。

## Scorers 评分器

评分器选项卡显示 Agent 的计分器运行时的结果。当消息通过 Agent 时，定义的评分器会异步评估每个输出并在此处呈现其结果。这使你可以了解评分器如何响应不同的交互，比较测试用例的性能，并确定需要改进的领域。

## REST API

本地开发服务器公开了一套完整的 REST API 路由，允许你在开发过程中，以编程方式与 Agent 、工作流和工具进行交互。如果你计划部署 Mastra 服务器，这尤其有用，因为本地开发服务器与 Mastra 服务器使用完全相同的 API 路由，允许你完全奇偶校验的方式对其进行开发和测试。

你可以在 <http://localhost:4111/openapi.json> 浏览 OpenAPI 规范中的所有可用端点，其中详细记录了每个端点及其请求和响应架构。

要以交互方式探索 API，请访问 SwaggerUI：<http://localhost:4111/swagger-ui>。在这里，你可以发现端点并直接从浏览器测试他们。

:::info
默认情况下，OpenAPI 和 Swagger 端点在生产中处于禁用状态。要启用它们，请分别设置 `server.build.openAPIDocs` 和 `server.build.swaggerUI` 为 `true`。
:::

## 配置

### Port 和 Host

默认情况下，开发服务器在 <http://localhost:4111> 运行。你可以更改 Mastra 服务器配置中的 `host` 和 `port`：

```ts
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
});
```

### 子路径托管

你可以设置以下配置将 Mastra Studio 托管在现有应用程序的子路径上：

```ts
import { Mastra } from "@mastra/core";

export const mastra = new Mastra({
  server: {
    studioBase: "/my-mastra-studio",
  },
});
```

这在以下情况下特别有用：

- 与现有应用程序集成
- 使用 Cloudflare 零信任等受益于共享域的身份验证工具
- 管理单个域下的多个服务

示例 URL：

- 默认值：（http://localhost:4111/ (根目录下的 Studio）
- `studioBase`：（http://localhost:4111/my-mastra-studio/（子路径下的 Studio）

### 本地 HTTPS

Mastra 通过 `--https` 标志支持本地 HTTPS 开发，该标志会自动为您的项目创建和管理证书。当你运行时。将为本地主机（或你配置的主机）生成私钥和证书。对于自定义证书管理，你可以通过服务器配置提供自己的密钥和证书文件：

```ts
import { Mastra } from "@mastra/core";
import fs from "node:fs";

export const mastra = new Mastra({
  server: {
    https: {
      key: fs.readFileSync("path/to/key.pem"),
      cert: fs.readFileSync("path/to/cert.pem"),
    },
  },
});
```
