import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/zh-TW/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/zh-TW/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/zh-TW/project-structure.mdx'),
  'create-an-agent': () => import('./content/zh-TW/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/zh-TW/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/zh-TW/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/zh-TW/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/zh-TW/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/zh-TW/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/zh-TW/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/zh-TW/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/zh-TW/how-memory-works.mdx'),
  'observational-memory': () => import('./content/zh-TW/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/zh-TW/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/zh-TW/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/zh-TW/chat-with-agent-in-slack.mdx'),
}
