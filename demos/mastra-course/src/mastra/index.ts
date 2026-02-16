
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Observability } from '@mastra/observability';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';

export const mastra = new Mastra({
  // 工作流
  workflows: { weatherWorkflow },
  // Agents
  agents: { weatherAgent },
  // 评测
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  // 持久化
  storage: new LibSQLStore({
    id: "mastra-storage",
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  // 日志
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // 可观测
  observability: new Observability({
    // Enables DefaultExporter and CloudExporter for tracing
    default: { enabled: true },
  }),
});
