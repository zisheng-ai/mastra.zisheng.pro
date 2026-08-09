import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const files = [
  'i18n/zh-CN/docusaurus-plugin-content-docs/current.json',
  'i18n/zh-CN/docusaurus-plugin-content-docs-guides/current.json',
  'i18n/zh-CN/docusaurus-plugin-content-docs-reference/current.json',
  'i18n/zh-CN/docusaurus-plugin-content-docs-models/current.json',
]

const translations = {
  Next: '下一页',
  Overview: '概览',
  Configuration: '配置',
  Methods: '方法',
  'Run Methods': '运行方法',
  'Getting Started': '快速开始',
  'Structured Output': '结构化输出',
  Guardrails: '防护机制',
  'Code Mode': '代码模式',
  'Workflow State': 'Workflow 状态',
  'Control Flow': '控制流',
  'Dynamic Workflows': '动态 Workflow',
  Snapshots: '快照',
  'Suspend and Resume': '暂停与恢复',
  'Time Travel': '时间回溯',
  'Error Handling': '错误处理',
  'Scheduled Workflows': '定时 Workflow',
  'Durable Agents': '持久化 Agent',
  'Background Tasks': '后台任务',
  Goals: '目标',
  Schedules: '调度',
  Signals: '信号',
  'Signal Providers': 'Signal Provider',
  'Message History': '消息历史',
  'Observational Memory': 'Observational Memory',
  'Working Memory': 'Working Memory',
  'Semantic Recall': '语义召回',
  'Memory Processors': 'Memory Processor',
  'Multi-User Threads': '多用户 Thread',
  Subagents: '子 Agent',
  Filesystem: '文件系统',
  'LSP Inspection': 'LSP 检查',
  'Search and Indexing': '搜索与索引',
  'Other Adapters': '其他 Adapter',
  Recording: '录制',
  Deployment: '部署',
  'Server Adapters': 'Server Adapter',
  'Custom Adapters': '自定义 Adapter',
  Middleware: '中间件',
  'Request Context': '请求上下文',
  'Custom API Routes': '自定义 API 路由',
  'Custom Auth Provider': '自定义 Auth Provider',
  'Fine-Grained Authorization': '细粒度授权',
  'JSON Web Token': 'JSON Web Token',
  'Built-in scorers': '内置 Scorer',
  'Channel Providers': 'Channel Provider',
  'File-based Agents': '基于文件的 Agent',
  'Mastra platform': 'Mastra 平台',
  'Mastra Platform': 'Mastra 平台',
  Logging: '日志',
  Metrics: '指标',
  Tracing: 'Tracing',
  'Tools and MCP': 'Tool 与 MCP',
  Workers: 'Worker',
  Workspaces: 'Workspace',
  'Build with AI': '使用 AI 构建',
  'Project Structure': '项目结构',
  'Environment Variables': '环境变量',
  'Custom Gateways': '自定义 Gateway',
  Gateways: 'Gateway',
  Providers: 'Provider',
  Features: '功能',
  Installation: '安装',
  'Basic usage': '基本用法',
  'Advanced configuration': '高级配置',
}

for (const relativePath of files) {
  const filePath = path.join(root, relativePath)
  const contents = JSON.parse(await fs.readFile(filePath, 'utf8'))

  for (const entry of Object.values(contents)) {
    if (translations[entry.message]) {
      entry.message = translations[entry.message]
    }
  }

  await fs.writeFile(filePath, `${JSON.stringify(contents, null, 2)}\n`)
}

console.log(`Localized sidebar labels in ${files.length} translation catalogs.`)
