import type { ComponentType } from 'react'

export const contentModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  'what-is-an-agent': () => import('./content/fr/what-is-an-agent.mdx'),
  'run-your-first-agent': () => import('./content/fr/run-your-first-agent.mdx'),
  'project-structure': () => import('./content/fr/project-structure.mdx'),
  'create-an-agent': () => import('./content/fr/create-an-agent.mdx'),
  'create-a-tool': () => import('./content/fr/create-a-tool.mdx'),
  'build-with-ai': () => import('./content/fr/build-with-ai.mdx'),
  'fetch-live-data': () => import('./content/fr/fetch-live-data.mdx'),
  'connect-to-mcp': () => import('./content/fr/connect-to-mcp.mdx'),
  'build-a-workflow': () => import('./content/fr/build-a-workflow.mdx'),
  'agents-vs-workflows': () => import('./content/fr/agents-vs-workflows.mdx'),
  'agents-in-workflows': () => import('./content/fr/agents-in-workflows.mdx'),
  'how-memory-works': () => import('./content/fr/how-memory-works.mdx'),
  'observational-memory': () => import('./content/fr/observational-memory.mdx'),
  'guardrails-with-processors': () => import('./content/fr/guardrails-with-processors.mdx'),
  'deploy-to-mastra-platform': () => import('./content/fr/deploy-to-mastra-platform.mdx'),
  'chat-with-agent-in-slack': () => import('./content/fr/chat-with-agent-in-slack.mdx'),
}
