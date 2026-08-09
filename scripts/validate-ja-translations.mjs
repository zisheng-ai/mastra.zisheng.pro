import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mappings = [
  ['docs', 'src/content/en/docs', 'i18n/ja/docusaurus-plugin-content-docs/current'],
  ['guides', 'src/content/en/guides', 'i18n/ja/docusaurus-plugin-content-docs-guides/current'],
  ['reference', 'src/content/en/reference', 'i18n/ja/docusaurus-plugin-content-docs-reference/current'],
  ['models', 'src/content/en/models', 'i18n/ja/docusaurus-plugin-content-docs-models/current'],
  ['learn', 'src/learn/content', 'src/learn/content/ja', true],
]
const requestedScopes = new Set(process.argv.slice(2))

const simplifiedChinesePattern =
  /[这们个过还让进从则并仅应对开关网务级术广门线现项优据标签选测显边阅码页击览载层统环认权态复输备图库构处创问达种语话请继续动经导观错实总验终结]/u
const japaneseCharacterPattern = /[぀-ヿ㐀-鿿]/u

async function listContentFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listContentFiles(path.join(directory, entry.name), relativePath)))
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(relativePath)
    }
  }

  return files.sort()
}

function collect(pattern, content, group = 0) {
  return [...content.matchAll(pattern)].map(match => match[group])
}

function normalize(values) {
  return values.map(value => value.trim()).sort()
}

function sameValues(left, right) {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right))
}

function structure(content) {
  return {
    headings: collect(/^#{1,6}\s+/gm, content),
    admonitions: collect(/^:::/gm, content),
    tabs: collect(/<Tabs\b/g, content),
    tabItems: collect(/<TabItem\b/g, content),
    propertiesTables: collect(/<PropertiesTable\b/g, content),
  }
}

function fencedCode(content) {
  return collect(/```[^\n]*\n[\s\S]*?```/g, content)
}

function inlineCode(content) {
  const withoutFences = content.replace(/```[^\n]*\n[\s\S]*?```/g, '')
  return collect(/(?<!`)`([^`\n]+)`(?!`)/g, withoutFences, 1)
}

function linkDestinations(content) {
  return collect(/!?(?:\[[^\]]*\])\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g, content, 1)
}

function modelTokens(content) {
  return collect(/__[A-Z0-9_]+__/g, content)
}

const errors = []
let checked = 0

for (const [scope, sourceRelativeRoot, targetRelativeRoot, topLevelOnly = false] of mappings) {
  if (requestedScopes.size > 0 && !requestedScopes.has(scope)) continue
  const sourceRoot = path.join(root, sourceRelativeRoot)
  const targetRoot = path.join(root, targetRelativeRoot)
  const files = topLevelOnly
    ? (await fs.readdir(sourceRoot, { withFileTypes: true }))
        .filter(entry => entry.isFile() && /\.mdx?$/.test(entry.name))
        .map(entry => entry.name)
        .sort()
    : await listContentFiles(sourceRoot)

  for (const relativePath of files) {
    const sourcePath = path.join(sourceRoot, relativePath)
    const targetPath = path.join(targetRoot, relativePath)
    let target

    try {
      target = await fs.readFile(targetPath, 'utf8')
    } catch {
      errors.push(`${targetRelativeRoot}/${relativePath}: missing translation`)
      continue
    }

    const source = await fs.readFile(sourcePath, 'utf8')
    const label = `${targetRelativeRoot}/${relativePath}`
    checked += 1

    if (!sameValues(fencedCode(source), fencedCode(target))) {
      errors.push(`${label}: fenced code blocks changed`)
    }
    if (!sameValues(inlineCode(source), inlineCode(target))) {
      errors.push(`${label}: inline code changed`)
    }
    if (!sameValues(linkDestinations(source), linkDestinations(target))) {
      errors.push(`${label}: Markdown link destinations changed`)
    }
    if (!sameValues(modelTokens(source), modelTokens(target))) {
      errors.push(`${label}: model tokens changed`)
    }

    const sourceStructure = structure(source)
    const targetStructure = structure(target)
    for (const key of Object.keys(sourceStructure)) {
      if (sourceStructure[key].length !== targetStructure[key].length) {
        errors.push(`${label}: ${key} count changed (${sourceStructure[key].length} -> ${targetStructure[key].length})`)
      }
    }

    const targetWithoutFences = target.replace(/```[^\n]*\n[\s\S]*?```/g, '')
    if (source === target) {
      errors.push(`${label}: translation is identical to English source`)
    }
    if (!japaneseCharacterPattern.test(targetWithoutFences)) {
      errors.push(`${label}: no Japanese prose detected`)
    }
    if (simplifiedChinesePattern.test(targetWithoutFences)) {
      errors.push(`${label}: possible Simplified Chinese residue`)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Validated ${checked} Japanese content files.`)
}
