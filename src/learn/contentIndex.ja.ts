import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/ja/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/ja/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/ja/project-structure.mdx'),
  'create-an-agent': () => import('./content/ja/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/ja/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/ja/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/ja/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/ja/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/ja/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/ja/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/ja/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/ja/how-memory-works.mdx'),
  'observational-memory': () => import('./content/ja/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/ja/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/ja/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/ja/chat-with-agent-in-slack.mdx'),
}
