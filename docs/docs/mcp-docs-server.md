---
title: MCP 文档服务
description: '@mastra/mcp-docs-server 包提供通过模型上下文协议 (MCP)直接访问 Mastra 的完整知识库，包括文档、代码示例、博客文章和变更日志的功能。'
order: 4
keywords: [Mastra, AI, Agents]
toc: content
group:
  title: 入门
  order: 1
---

# MCP 文档服务

`@mastra/mcp-docs-server` 包提供通过模型上下文协议 (MCP)直接访问 Mastra 的完整知识库，包括文档、代码示例、博客文章和变更日志的功能。它可与 Cursor、Windsurf、Cline、Claude Code、Codex 或任何支持 MCP 的工具配合使用。

这些工具旨在帮助 Agent 检索精确的、特定于任务的信息 - 无论你是向 Agent 添加功能、构建新项目还是探索某些内容的工作原理。

在本指南中，你将了解如何将 Mastra 的 MCP 服务器添加到你的 AI 工具中。

## 安装

### 手动设置

如果下面没有针对你的工具的具体说明，你仍然可以使用此通用 JSON 配置添加 MCP 服务器。

```json
{
  "mcpServers": {
    "mastra": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@mastra/mcp-docs-server@beta"]
    }
  }
}
```

### cursor

点击 [Install MCP Server](cursor://anysphere.cursor-deeplink/mcp/install?name=mastra&config=eyJjb21tYW5kIjoibnB4IC15IEBtYXN0cmEvbWNwLWRvY3Mtc2VydmVyIn0%3D) 安装：

当你打开左下角的光标时，你将看到一个弹出窗口，提示你启用 Mastra Docs MCP 服务器。

![](https://mastra.ai/img/enable-mastra-docs-cursor.png)

## 使用

配置完成后，你可以向 AI 工具询问有关 Mastra 的问题或指示其采取行动。对于这些步骤，它将从 Mastra 的 MCP 服务器获取最新信息。

**添加功能**：

- 向我的 Agent 添加评测并编写测试
- 给我写一个执行一下操作的工作流程 “`[tasks]`”
- 制作一个新工具，允许我的 Agent 访问“`[3rd party API]`”

**询问如何集成**：

- Mastra 可以与 AI SDK 配合使用吗？我如何在我的项目中使用它？
- Mastra 支持语音 API 吗？在我的代码中显示一个示例，说明如何使用它。

**调试或更新现有代码**：

- 我遇到了 Agent  memory 错误，最近是否有任何相关更改或错误修复？
- 工作记忆在 Mastra 中表现如何？我该如何使用它？它似乎没有按照我预期的方式工作
- 我看到有新的工作流程功能，请向我解释他们，然后更新以使用它们。
