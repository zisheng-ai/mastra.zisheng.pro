---
order: 3
title: 项目结构
description: 'Mastra 是一个框架，但它对如何组织或放置文件不是强约定的'
keywords: [Mastra, AI, Agents]
toc: content
group:
  title: 入门
  order: 1
---

# 项目结构

使用 `create mastra` 命令创建的新 Mastra 项目附带一组预定义的文件和文件夹，可帮助你入门。Mastra 虽然是一个框架，但它对如何组织或放置文件没有强制约定。CLI 提供了一个适合大多数项目的合理默认结构，但你可以自由地调整它以适应你的工作流程或团队约定。如果你愿意，你甚至可以在单个文件中构建整个项目！无论你选择什么机构，请保持一致，以确保你的代码保持可维护且易于导航。

## 默认项目结构

使用 `npm create mastra` 命令创建的项目如下所示：

<Tree>
  <ul>
    <li>
      src
      <ul>
        <li>
          mastra
          <small>所有与 Mastra 相关的代码和配置的入口点</small>
          <ul>
            <li>
              agents
              <small>定义和配置你的 Agent  - 它们的行为、目标和工具。</small>
              <ul>
                <li>weather-agent.ts</li>
              </ul>
            </li>
            <li>
              tools
              <small>创建你的代理可以调用​​的可重用工具</small>
              <ul>
                <li>weather-tool.ts</li>
              </ul>
            </li>
            <li>
              workflows
              <small>定义将 Agent 和工具编排在一起的多步骤工作流程。</small>
              <ul>
                <li>weather-workflow.ts</li>
              </ul>
            </li>
            <li>
              scorers
              <small>（可选）定义评分器以评估 Agent 随时间的表现</small>
              <ul>
                <li>weather-scorer.ts</li>
              </ul>
            </li>
            <li>
              mcp
              <small>（可选）实现自定义 MCP 服务器以与外部 Agent 共享你的工具</small>
              <ul></ul>
            </li>
            <li>
              public
              <small>（可选）在构建过程中将内容复制到 `.build/output` 目录中，使其可在运行时提供服务</small>
              <ul></ul>
            </li>
          </ul>
        </li>
        <li>index.ts<small>你可以在其中配置和初始化 Mastra 的中心入口点。</small></li>
      </ul>
    </li>
    <li>.env.example<small>环境变量模板 - 复制并重命名以 .env 添加模型 Provider 的密钥。</small></li>
    <li>package.json<small>定义项目元数据、依赖项和可用的 npm 脚本。</small></li>
    <li>tsconfig.json<small>配置 TypeScript 选项，例如路径别名、编译器设置和构建输出。</small></li>
  </ul>
</Tree>

:::info
使用预定义文件作为模板。复制并调整它们以快速创建你自己的 Agent 、工具、工作流程等。
:::
