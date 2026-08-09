import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = path.join(root, 'i18n/zh-TW/docusaurus-plugin-content-docs-models/current')

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
      'description: "在 Mastra 中使用 $1 模型。共有 $2 個可用模型。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "在 Mastra 中使用 $1 模型。共有 1 個可用模型。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "透過 AI SDK 使用 $1 模型。"')
    .replace(/description: "Direct access to AI model providers\."/g, 'description: "直接存取 AI 模型 Provider。"')
    .replace(/description="(\d+) models"/g, 'description="$1 個模型"')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 標誌"')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用 `$3` 環境變數完成身分驗證。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      '透過 Mastra 的模型路由器存取 1 個 $1 模型。系統會自動使用 `$2` 環境變數完成身分驗證。',
    )
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: (.+?)\./g,
      '透過 Mastra 的模型路由器存取 $1 個 $2 模型。系統會自動使用下列其中一個環境變數完成身分驗證：$3。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '如需進一步了解，請參閱[$1 文件]($2)。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      '$1 可透過 AI SDK 使用。安裝對應的 Provider 套件後，即可在 Mastra 中使用其模型。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      '如需此 Provider 的詳細說明，請參閱 [AI SDK $1 Provider 文件]($2)。',
    )
    .replace(/^# Model Providers$/gm, '# 模型 Provider')
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '直接存取各個 AI 模型 Provider。每個 Provider 都提供具備不同能力與定價的模型。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra 使用與 OpenAI 相容的 `/chat/completions` endpoint。部分 Provider 特有功能可能無法使用，詳情請參閱[$1 文件]($2)。',
    )
    .replace(/^## Models$/gm, '## 模型')
    .replace(/^## Advanced configuration$/gm, '## 進階設定')
    .replace(/^## Advanced Configuration$/gm, '## 進階設定')
    .replace(/^### Custom headers$/gm, '### 自訂標頭')
    .replace(/^### Custom Headers$/gm, '### 自訂標頭')
    .replace(/^### Dynamic model selection$/gm, '### 動態選擇模型')
    .replace(/^### Dynamic Model Selection$/gm, '### 動態選擇模型')
    .replace(/^## Direct provider installation$/gm, '## 直接安裝 Provider')
    .replace(/^## Installation$/gm, '## 安裝')
    .replace(/^## Provider Options$/gm, '## Provider 選項')
    .replace(/^### Available Options$/gm, '### 可用選項')
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      '你也可以直接將此 Provider 安裝為獨立套件，用它取代 Mastra 模型路由字串。詳情請參閱[套件文件]($1)。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      '如需在 Mastra Agent 中使用此 Provider，請參閱 [Agent 概覽文件]($1)。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 透過 `providerOptions` 參數支援以下 Provider 特有選項：',
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
let skippedManual = 0

for (const relativePath of files) {
  if (manualFiles.has(relativePath)) {
    skippedManual += 1
    continue
  }

  const sourcePath = path.join(sourceRoot, relativePath)
  const targetPath = path.join(targetRoot, relativePath)
  const content = await fs.readFile(sourcePath, 'utf8')
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localizeGeneratedPage(content))
  generated += 1
}

console.log(`Generated ${generated} zh-TW model localization files; skipped ${skippedManual} manual files.`)
