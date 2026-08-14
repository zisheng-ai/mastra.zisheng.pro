import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/ko/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/ko/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/ko/project-structure.mdx'),
  'create-an-agent': () => import('./content/ko/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/ko/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/ko/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/ko/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/ko/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/ko/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/ko/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/ko/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/ko/how-memory-works.mdx'),
  'observational-memory': () => import('./content/ko/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/ko/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/ko/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/ko/chat-with-agent-in-slack.mdx'),
}
