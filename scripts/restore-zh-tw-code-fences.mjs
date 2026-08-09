import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const requestedScopes = process.argv.slice(2)
const scopes = requestedScopes.length > 0 ? requestedScopes : ['docs', 'guides', 'reference', 'models']

const mappings = {
  docs: {
    source: 'src/content/en/docs',
    target: 'i18n/zh-TW/docusaurus-plugin-content-docs/current',
  },
  guides: {
    source: 'src/content/en/guides',
    target: 'i18n/zh-TW/docusaurus-plugin-content-docs-guides/current',
  },
  reference: {
    source: 'src/content/en/reference',
    target: 'i18n/zh-TW/docusaurus-plugin-content-docs-reference/current',
  },
  models: {
    source: 'src/content/en/models',
    target: 'i18n/zh-TW/docusaurus-plugin-content-docs-models/current',
  },
}

const fencePattern = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm

async function listMarkdownFiles(directory, prefix = '') {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const relativePath = path.join(prefix, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(path.join(directory, entry.name), relativePath)))
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      files.push(relativePath)
    }
  }

  return files
}

let restoredFiles = 0
let checkedFiles = 0
const errors = []

for (const scope of scopes) {
  const mapping = mappings[scope]
  if (!mapping) {
    errors.push(`Unknown scope: ${scope}`)
    continue
  }

  const sourceRoot = path.join(root, mapping.source)
  const targetRoot = path.join(root, mapping.target)

  try {
    await fs.access(targetRoot)
  } catch {
    continue
  }

  for (const relativePath of await listMarkdownFiles(targetRoot)) {
    const sourcePath = path.join(sourceRoot, relativePath)
    const targetPath = path.join(targetRoot, relativePath)

    try {
      await fs.access(sourcePath)
    } catch {
      errors.push(`Missing English source for ${path.relative(root, targetPath)}`)
      continue
    }

    const source = await fs.readFile(sourcePath, 'utf8')
    const target = await fs.readFile(targetPath, 'utf8')
    const sourceFences = [...source.matchAll(fencePattern)].map(match => match[0])
    const targetFences = [...target.matchAll(fencePattern)].map(match => match[0])
    checkedFiles += 1

    if (sourceFences.length !== targetFences.length) {
      errors.push(
        `Fence count mismatch for ${path.relative(root, targetPath)}: English ${sourceFences.length}, zh-TW ${targetFences.length}`,
      )
      continue
    }

    let index = 0
    const restored = target.replace(fencePattern, () => sourceFences[index++])
    if (restored !== target) {
      await fs.writeFile(targetPath, restored)
      restoredFiles += 1
    }
  }
}

console.log(`Checked ${checkedFiles} localized files; restored code fences in ${restoredFiles} files.`)

if (errors.length > 0) {
  for (const error of errors) console.error(error)
  process.exitCode = 1
}
