import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = path.join(root, 'i18n/zh-CN/docusaurus-plugin-content-docs-models/current')

const manualFiles = new Set([
  'embeddings.mdx',
  'environment-variables.mdx',
  'index.mdx',
  'gateways/azure-openai.mdx',
  'gateways/custom-gateways.mdx',
  'gateways/index.mdx',
  'gateways/mastra.mdx',
  'gateways/neon.mdx',
  'gateways/netlify.mdx',
  'gateways/openrouter.mdx',
  'gateways/vercel.mdx',
])

async function listMdxFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listMdxFiles(path.join(directory, entry.name), relativePath)))
    } else if (entry.name.endsWith('.mdx')) {
      files.push(relativePath)
    }
  }

  return files
}

function translateProse(segment) {
  return segment
    .replace(/title: "(.+?) \| Models(?: \| Mastra)?"/g, 'title: "$1 | 模型"')
    .replace(
      /description: "Use (.+?) models with Mastra\. (\d+) models available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 $2 个可用模型。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 1 个可用模型。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "通过 AI SDK 使用 $1 模型。"')
    .replace(/description: "Direct access to AI model providers\."/g, 'description: "直接访问 AI 模型 Provider。"')
    .replace(/description="(\d+) models"/g, 'description="$1 个模型"')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 标志"')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '通过 Mastra 的模型路由器访问 $1 个 $2 模型。系统会自动使用 `$3` 环境变量完成身份验证。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '通过 Mastra 的模型路由器访问 1 个 $1 模型。系统会自动使用 `$2` 环境变量完成身份验证。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '更多信息请参阅[$1 文档]($2)。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      '$1 可通过 AI SDK 使用。安装相应的 Provider package 后，即可在 Mastra 中使用其模型。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      '有关此 Provider 的详细说明，请参阅 [AI SDK $1 Provider 文档]($2)。',
    )
    .replace(/^# Model Providers$/gm, '# 模型 Provider')
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '直接访问各个 AI 模型 Provider。每个 Provider 都提供具有不同能力和定价的模型。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra 使用兼容 OpenAI 的 `/chat/completions` endpoint。部分 Provider 特有功能可能不可用，详情请参阅[$1 文档]($2)。',
    )
    .replace(/^## Models$/gm, '## 模型')
    .replace(/^## Advanced configuration$/gm, '## 高级配置')
    .replace(/^## Advanced Configuration$/gm, '## 高级配置')
    .replace(/^### Custom headers$/gm, '### 自定义请求头')
    .replace(/^### Custom Headers$/gm, '### 自定义请求头')
    .replace(/^### Dynamic model selection$/gm, '### 动态选择模型')
    .replace(/^### Dynamic Model Selection$/gm, '### 动态选择模型')
    .replace(/^## Direct provider installation$/gm, '## 直接安装 Provider')
    .replace(/^## Installation$/gm, '## 安装')
    .replace(/^## Provider Options$/gm, '## Provider 选项')
    .replace(/^### Available Options$/gm, '### 可用选项')
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      '你也可以直接将此 Provider 安装为独立 package，用它代替 Mastra 模型路由字符串。详情请参阅[package 文档]($1)。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      '如需在 Mastra Agent 中使用此 Provider，请参阅[Agent 概览文档]($1)。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 通过 `providerOptions` 参数支持以下 Provider 特有选项：',
    )
}

function localizeGeneratedPage(content) {
  return content
    .split(/(```[\s\S]*?```)/g)
    .map((segment, index) => (index % 2 === 0 ? translateProse(segment) : segment))
    .join('')
}

const files = await listMdxFiles(sourceRoot)
let generated = 0
let preserved = 0

for (const relativePath of files) {
  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)

  if (manualFiles.has(relativePath)) {
    try {
      await fs.access(targetPath)
      preserved += 1
      continue
    } catch {
      // Seed the manual translation file on the first run.
    }
  }

  const content = await fs.readFile(sourcePath, 'utf8')
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localizeGeneratedPage(content))
  generated += 1
}

console.log(`Generated ${generated} model localization files; preserved ${preserved} manual files.`)
