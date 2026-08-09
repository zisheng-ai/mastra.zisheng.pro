import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/zh-HK/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/zh-HK/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/zh-HK/project-structure.mdx'),
  'create-an-agent': () => import('./content/zh-HK/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/zh-HK/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/zh-HK/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/zh-HK/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/zh-HK/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/zh-HK/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/zh-HK/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/zh-HK/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/zh-HK/how-memory-works.mdx'),
  'observational-memory': () => import('./content/zh-HK/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/zh-HK/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/zh-HK/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/zh-HK/chat-with-agent-in-slack.mdx'),
}
