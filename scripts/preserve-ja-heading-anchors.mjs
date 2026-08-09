import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

import { unified } from 'unified'
import { visit } from 'unist-util-visit'

const root = path.resolve(import.meta.dirname, '..')
const checkOnly = process.argv.includes('--check')
const unknownArguments = process.argv.slice(2).filter(argument => argument !== '--check')

if (unknownArguments.length > 0) {
  console.error(`Unknown argument(s): ${unknownArguments.join(', ')}`)
  console.error('Usage: node scripts/preserve-ja-heading-anchors.mjs [--check]')
  process.exit(2)
}

const contentRoots = [
  {
    name: 'docs',
    source: 'src/content/en/docs',
    target: 'i18n/ja/docusaurus-plugin-content-docs/current',
    recursive: true,
  },
  {
    name: 'guides',
    source: 'src/content/en/guides',
    target: 'i18n/ja/docusaurus-plugin-content-docs-guides/current',
    recursive: true,
  },
  {
    name: 'reference',
    source: 'src/content/en/reference',
    target: 'i18n/ja/docusaurus-plugin-content-docs-reference/current',
    recursive: true,
  },
  {
    name: 'models',
    source: 'src/content/en/models',
    target: 'i18n/ja/docusaurus-plugin-content-docs-models/current',
    recursive: true,
  },
  {
    name: 'learn',
    source: 'src/learn/content',
    target: 'src/learn/content/ja',
    recursive: false,
  },
]

const require = createRequire(import.meta.url)
const coreRequire = createRequire(require.resolve('@docusaurus/core/package.json'))
const remarkParse = (await import(pathToFileURL(coreRequire.resolve('remark-parse')))).default
const remarkMdx = (await import(pathToFileURL(coreRequire.resolve('remark-mdx')))).default
const remarkFrontmatter = (await import(pathToFileURL(coreRequire.resolve('remark-frontmatter')))).default
const loaderRoot = path.dirname(coreRequire.resolve('@docusaurus/mdx-loader/package.json'))
const headingsModule = await import(pathToFileURL(path.join(loaderRoot, 'lib/remark/headings/index.js')))
const docusaurusHeadings = headingsModule.default?.default ?? headingsModule.default
const { escapeMarkdownHeadingIds } = coreRequire('@docusaurus/utils')

async function listContentFiles(directory, recursive) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory() && recursive) files.push(...(await listContentFiles(entryPath, true)))
    if (entry.isFile() && /\.mdx?$/.test(entry.name)) files.push(entryPath)
  }

  return files.sort()
}

async function parseHeadings(content, file) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .use(remarkMdx)
    .use(docusaurusHeadings, { anchorsMaintainCase: false })
  const tree = processor.parse(escapeMarkdownHeadingIds(content))
  await processor.run(tree)

  const headings = []
  visit(tree, 'heading', node => {
    const line = node.position?.start.line
    if (!line || typeof node.data?.id !== 'string') {
      throw new Error(`${file}: heading is missing a generated ID`)
    }
    headings.push({ depth: node.depth, id: node.data.id, line })
  })
  return headings
}

function explicitId(line) {
  return /\s*\{\/\*\s*#(?<id>[^\s*]+)\s*\*\/\}\s*$/.exec(line)?.groups?.id
}

function addId(line, id) {
  return `${line.trimEnd()} {/* #${id} */}`
}

const plans = []
const errors = []
const summary = []

for (const contentRoot of contentRoots) {
  const sourceRoot = path.join(root, contentRoot.source)
  const targetRoot = path.join(root, contentRoot.target)
  const sourceFiles = await listContentFiles(sourceRoot, contentRoot.recursive)
  const targetFiles = await listContentFiles(targetRoot, contentRoot.recursive)
  const targetByRelativePath = new Map(targetFiles.map(file => [path.relative(targetRoot, file), file]))
  let changedPages = 0
  let addedAnchors = 0

  for (const sourceFile of sourceFiles) {
    const relativeFile = path.relative(sourceRoot, sourceFile)
    const targetFile = targetByRelativePath.get(relativeFile)
    if (!targetFile) {
      errors.push(`${contentRoot.name}: missing target ${relativeFile}`)
      continue
    }

    const [sourceContent, targetContent] = await Promise.all([
      fs.readFile(sourceFile, 'utf8'),
      fs.readFile(targetFile, 'utf8'),
    ])
    let sourceHeadings
    let targetHeadings
    try {
      ;[sourceHeadings, targetHeadings] = await Promise.all([
        parseHeadings(sourceContent, sourceFile),
        parseHeadings(targetContent, targetFile),
      ])
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      continue
    }

    if (sourceHeadings.length !== targetHeadings.length) {
      errors.push(`${contentRoot.name}/${relativeFile}: heading count differs`)
      continue
    }

    const eol = targetContent.includes('\r\n') ? '\r\n' : '\n'
    const lines = targetContent.split(/\r?\n/)
    let pageChanges = 0
    let failed = false
    for (let index = 0; index < sourceHeadings.length; index += 1) {
      const sourceHeading = sourceHeadings[index]
      const targetHeading = targetHeadings[index]
      if (sourceHeading.depth !== targetHeading.depth) {
        errors.push(`${contentRoot.name}/${relativeFile}: heading ${index + 1} depth differs`)
        failed = true
        continue
      }
      if (!sourceHeading.id) continue
      const lineIndex = targetHeading.line - 1
      const currentId = explicitId(lines[lineIndex])
      if (currentId && currentId !== sourceHeading.id) {
        errors.push(`${contentRoot.name}/${relativeFile}:${targetHeading.line}: explicit ID differs from English`)
        failed = true
      } else if (!currentId) {
        lines[lineIndex] = addId(lines[lineIndex], sourceHeading.id)
        pageChanges += 1
      }
    }

    if (failed || pageChanges === 0) continue
    const nextContent = lines.join(eol)
    try {
      const verified = await parseHeadings(nextContent, targetFile)
      for (let index = 0; index < sourceHeadings.length; index += 1) {
        if (!sourceHeadings[index].id) continue
        if (verified[index]?.id !== sourceHeadings[index].id) {
          errors.push(`${contentRoot.name}/${relativeFile}: heading ${index + 1} anchor verification failed`)
          failed = true
        }
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      failed = true
    }
    if (!failed) {
      plans.push({ content: nextContent, file: targetFile })
      changedPages += 1
      addedAnchors += pageChanges
    }
  }

  summary.push(`${contentRoot.name}: ${changedPages} pages, ${addedAnchors} anchors to add`)
}

console.log(summary.join('\n'))

if (errors.length > 0) {
  console.error(`\nRefusing to write because ${errors.length} structural error(s) were found:`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

if (checkOnly) {
  if (plans.length > 0) {
    console.error(`\n${plans.length} file(s) do not yet preserve their English heading anchors.`)
    process.exit(1)
  }
  console.log('\nAll Japanese headings preserve their English anchors.')
} else if (plans.length === 0) {
  console.log('\nNo changes needed; all Japanese headings preserve their English anchors.')
} else {
  await Promise.all(plans.map(plan => fs.writeFile(plan.file, plan.content)))
  console.log(`\nUpdated ${plans.length} Japanese file(s).`)
}
