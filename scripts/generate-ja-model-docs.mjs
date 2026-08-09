import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(root, 'src/content/en/models')
const targetRoot = path.join(root, 'i18n/ja/docusaurus-plugin-content-docs-models/current')

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
    .replace(/title: "(.+?) \| Models(?: \| Mastra)?"/g, 'title: "$1 | モデル"')
    .replace(
      /description: "Use (.+?) models with Mastra\. (\d+) models available\."/g,
      'description: "Mastra で $1 モデルを使用します。利用可能なモデルは $2 個です。"',
    )
    .replace(
      /description: "Use (.+?) models with Mastra\. 1 model available\."/g,
      'description: "Mastra で $1 モデルを使用します。利用可能なモデルは 1 個です。"',
    )
    .replace(/description: "Use (.+?) models via the AI SDK\."/g, 'description: "AI SDK を通じて $1 モデルを使用します。"')
    .replace(/description: "Direct access to AI model providers\."/g, 'description: "AI モデル Provider に直接アクセスします。"')
    .replace(/description="(\d+) models"/g, 'description="$1 個のモデル"')
    .replace(/alt="([^"]+?) logo"/g, 'alt="$1 ロゴ"')
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      'Mastra のモデルルーターを通じて $1 個の $2 モデルを利用できます。認証には `$3` 環境変数が自動的に使用されます。',
    )
    .replace(
      /Access 1 (.+?) model through Mastra's model router\. Authentication is handled automatically using the `([^`]+)` environment variable\./g,
      'Mastra のモデルルーターを通じて 1 個の $1 モデルを利用できます。認証には `$2` 環境変数が自動的に使用されます。',
    )
    .replace(
      /Access (\d+) (.+?) models through Mastra's model router\. Authentication is handled automatically using one of the following environment variables: `([^`]+)`, `([^`]+)`\./g,
      'Mastra のモデルルーターを通じて $1 個の $2 モデルを利用できます。認証には、`$3` または `$4` のいずれかの環境変数が自動的に使用されます。',
    )
    .replace(/Learn more in the \[([^\]]+?) documentation\]\(([^)]+)\)\./g, '詳しくは、[$1 のドキュメント]($2)を参照してください。')
    .replace(
      /(.+?) is available through the AI SDK\. Install the provider package to use their models with Mastra\./g,
      '$1 は AI SDK を通じて利用できます。Mastra でこの Provider のモデルを使用するには、Provider package をインストールしてください。',
    )
    .replace(
      /For detailed provider-specific documentation, see the \[AI SDK (.+?) provider docs\]\(([^)]+)\)\./g,
      'Provider 固有の詳細については、[AI SDK $1 Provider のドキュメント]($2)を参照してください。',
    )
    .replace(/^# Model Providers$/gm, '# モデル Provider')
    .replace(
      /Direct access to individual AI model providers\. Each provider offers unique models with specific capabilities and pricing\./g,
      '個々の AI モデル Provider に直接アクセスできます。各 Provider は、固有の機能と料金体系を備えたモデルを提供します。',
    )
    .replace(
      /Mastra uses the OpenAI-compatible `\/chat\/completions` endpoint\. Some provider-specific features may not be available\. Check the \[([^\]]+?) documentation\]\(([^)]+)\) for details\./g,
      'Mastra は OpenAI 互換の `/chat/completions` endpoint を使用します。一部の Provider 固有機能は利用できない場合があります。詳しくは、[$1 のドキュメント]($2)を確認してください。',
    )
    .replace(/^## Models$/gm, '## モデル')
    .replace(/^## Advanced configuration$/gm, '## 高度な設定')
    .replace(/^## Advanced Configuration$/gm, '## 高度な設定')
    .replace(/^### Custom headers$/gm, '### カスタムヘッダー')
    .replace(/^### Custom Headers$/gm, '### カスタムヘッダー')
    .replace(/^### Dynamic model selection$/gm, '### 動的なモデル選択')
    .replace(/^### Dynamic Model Selection$/gm, '### 動的なモデル選択')
    .replace(/^## Direct provider installation$/gm, '## Provider を直接インストールする')
    .replace(/^## Installation$/gm, '## インストール')
    .replace(/^## Provider Options$/gm, '## Provider オプション')
    .replace(/^### Available Options$/gm, '### 利用可能なオプション')
    .replace(
      /This provider can also be installed directly as a standalone package, which can be used instead of the Mastra model router string\. View the \[package documentation\]\(([^)]+)\) for more details\./g,
      'この Provider はスタンドアロン package として直接インストールし、Mastra のモデルルーター文字列の代わりに使用することもできます。詳しくは、[package のドキュメント]($1)を参照してください。',
    )
    .replace(
      /To use this provider with Mastra agents, see the \[Agent Overview documentation\]\(([^)]+)\)\./g,
      'この Provider を Mastra Agent で使用する方法については、[Agent の概要]($1)を参照してください。',
    )
    .replace(
      /(.+?) supports the following provider-specific options via the `providerOptions` parameter:/g,
      '$1 は `providerOptions` パラメーターを通じて、次の Provider 固有オプションをサポートします。',
    )
    .replace(
      /Controls whether OpenAI stores your API requests for model training\. Required to be \\"false\\" if your organization has zero data retention enabled\. See: https:\/\/platform\.openai\.com\/docs\/guides\/your-data#zero-data-retention/g,
      'OpenAI がモデルのトレーニング用に API リクエストを保存するかどうかを制御します。組織で zero data retention が有効な場合は、必ず \\"false\\" に設定してください。参照: https://platform.openai.com/docs/guides/your-data#zero-data-retention',
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
      // Seed a manual translation file on the first run.
    }
  }

  const content = await fs.readFile(sourcePath, 'utf8')
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, localizeGeneratedPage(content))
  generated += 1
}

console.log(`Generated ${generated} Japanese model localization files; preserved ${preserved} manual files.`)
