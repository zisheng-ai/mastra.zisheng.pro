import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/zh-CN/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/zh-CN/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/zh-CN/project-structure.mdx'),
  'create-an-agent': () => import('./content/zh-CN/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/zh-CN/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/zh-CN/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/zh-CN/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/zh-CN/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/zh-CN/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/zh-CN/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/zh-CN/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/zh-CN/how-memory-works.mdx'),
  'observational-memory': () => import('./content/zh-CN/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/zh-CN/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/zh-CN/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/zh-CN/chat-with-agent-in-slack.mdx'),
}
