import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

import { unified } from 'unified'
import { visit } from 'unist-util-visit'

const root = path.resolve(import.meta.dirname, '..')
const checkOnly = process.argv.includes('--check')
const unknownArguments = process.argv.slice(2).filter(argument => argument !== '--check')

if (unknownArguments.length > 0) {
  console.error(`Unknown argument(s): ${unknownArguments.join(', ')}`)
  console.error('Usage: node scripts/preserve-zh-hk-heading-anchors.mjs [--check]')
  process.exit(2)
}

const contentRoots = [
  {
    name: 'docs',
    source: 'src/content/en/docs',
    target: 'i18n/zh-HK/docusaurus-plugin-content-docs/current',
    recursive: true,
  },
  {
    name: 'guides',
    source: 'src/content/en/guides',
    target: 'i18n/zh-HK/docusaurus-plugin-content-docs-guides/current',
    recursive: true,
  },
  {
    name: 'reference',
    source: 'src/content/en/reference',
    target: 'i18n/zh-HK/docusaurus-plugin-content-docs-reference/current',
    recursive: true,
  },
  {
    name: 'models',
    source: 'src/content/en/models',
    target: 'i18n/zh-HK/docusaurus-plugin-content-docs-models/current',
    recursive: true,
  },
  {
    name: 'learn',
    source: 'src/learn/content',
    target: 'src/learn/content/zh-HK',
    recursive: false,
  },
]

const require = createRequire(import.meta.url)

let coreRequire
try {
  coreRequire = createRequire(require.resolve('@docusaurus/core/package.json'))
} catch {
  console.error('Docusaurus dependencies are unavailable. Run `pnpm install` before this script.')
  process.exit(2)
}

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
    if (entry.isDirectory()) {
      if (recursive) files.push(...(await listContentFiles(entryPath, true)))
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath)
    }
  }

  return files.sort()
}

async function parseHeadings(content, file) {
  let processor
  let tree
  try {
    processor = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml', 'toml'])
      .use(remarkMdx)
      .use(docusaurusHeadings, { anchorsMaintainCase: false })
    tree = processor.parse(escapeMarkdownHeadingIds(content))
    await processor.run(tree)
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
  }

  const headings = []
  visit(tree, 'heading', node => {
    const startLine = node.position?.start.line
    const endLine = node.position?.end.line
    const id = node.data?.id

    if (!startLine || !endLine || typeof id !== 'string') {
      throw new Error(`${file}: heading is missing source position or generated ID`)
    }
    if (startLine !== endLine) {
      throw new Error(`${file}:${startLine}: multiline headings are not supported safely`)
    }
    headings.push({ depth: node.depth, id, line: startLine })
  })

  return headings
}

function explicitHeadingId(line) {
  const classic = /\s*\{#(?<id>(?:.(?!\{#|\}))*.)\}(?=\s*(?:#+\s*)?$)/.exec(line)
  if (classic?.groups?.id) return { id: classic.groups.id.trim(), match: classic[0], syntax: 'classic' }

  const mdxComment = /\s*\{\/\*\s*#(?<id>\S+)\s*\*\/\}(?=\s*(?:#+\s*)?$)/.exec(line)
  if (mdxComment?.groups?.id) return { id: mdxComment.groups.id.trim(), match: mdxComment[0], syntax: 'mdx-comment' }

  const htmlComment = /\s*<!--\s*#(?<id>\S+).*-->(?=\s*(?:#+\s*)?$)/.exec(line)
  if (htmlComment?.groups?.id) {
    return { id: htmlComment.groups.id.trim(), match: htmlComment[0], syntax: 'html-comment' }
  }
  return undefined
}

function addHeadingId(line, id) {
  // MDX comments are Docusaurus-native explicit IDs and remain parseable by MDX formatters.
  const suffix = `{/* #${id} */}`
  const closingHashes = /^(?<text>.*?)(?<closing>[ \t]+#+[ \t]*)$/.exec(line)
  if (closingHashes?.groups) {
    return `${closingHashes.groups.text.trimEnd()} ${suffix}${closingHashes.groups.closing}`
  }
  return `${line.trimEnd()} ${suffix}`
}

const plans = []
const errors = []
const warnings = []
const summary = new Map()

for (const contentRoot of contentRoots) {
  const sourceRoot = path.join(root, contentRoot.source)
  const targetRoot = path.join(root, contentRoot.target)
  const sourceFiles = await listContentFiles(sourceRoot, contentRoot.recursive)
  const targetFiles = await listContentFiles(targetRoot, contentRoot.recursive)
  const sourceRelativeFiles = sourceFiles.map(file => path.relative(sourceRoot, file))
  const targetRelativeFiles = targetFiles.map(file => path.relative(targetRoot, file))
  const sourceSet = new Set(sourceRelativeFiles)
  const targetSet = new Set(targetRelativeFiles)

  for (const relativeFile of sourceRelativeFiles) {
    if (!targetSet.has(relativeFile)) errors.push(`${contentRoot.name}: missing target ${relativeFile}`)
  }
  for (const relativeFile of targetRelativeFiles) {
    if (!sourceSet.has(relativeFile)) errors.push(`${contentRoot.name}: target has no English source ${relativeFile}`)
  }

  let rootPages = 0
  let rootHeadings = 0
  let rootChangedPages = 0
  let rootAddedAnchors = 0
  let rootNormalizedAnchors = 0
  let rootSkippedHeadings = 0

  for (const relativeFile of sourceRelativeFiles) {
    if (!targetSet.has(relativeFile)) continue

    const sourceFile = path.join(sourceRoot, relativeFile)
    const targetFile = path.join(targetRoot, relativeFile)
    const [sourceContent, targetContent] = await Promise.all([
      fs.readFile(sourceFile, 'utf8'),
      fs.readFile(targetFile, 'utf8'),
    ])

    let sourceHeadings
    let targetHeadings
    try {
      ;[sourceHeadings, targetHeadings] = await Promise.all([
        parseHeadings(sourceContent, path.relative(root, sourceFile)),
        parseHeadings(targetContent, path.relative(root, targetFile)),
      ])
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error))
      continue
    }

    rootPages += 1
    rootHeadings += sourceHeadings.length

    if (sourceHeadings.length !== targetHeadings.length) {
      errors.push(
        `${contentRoot.name}/${relativeFile}: heading count differs (${sourceHeadings.length} English, ${targetHeadings.length} zh-HK)`,
      )
      continue
    }

    const eol = targetContent.includes('\r\n') ? '\r\n' : '\n'
    const targetLines = targetContent.split(/\r?\n/)
    let addedAnchors = 0
    let normalizedAnchors = 0
    let pageFailed = false

    for (let index = 0; index < sourceHeadings.length; index += 1) {
      const sourceHeading = sourceHeadings[index]
      const targetHeading = targetHeadings[index]

      if (sourceHeading.depth !== targetHeading.depth) {
        errors.push(
          `${contentRoot.name}/${relativeFile}: heading ${index + 1} depth differs (${sourceHeading.depth} English, ${targetHeading.depth} zh-HK)`,
        )
        pageFailed = true
        continue
      }

      if (!sourceHeading.id) {
        warnings.push(
          `${contentRoot.name}/${relativeFile}:${sourceHeading.line}: English source heading has an empty generated ID`,
        )
        rootSkippedHeadings += 1
        continue
      }

      const lineIndex = targetHeading.line - 1
      const targetLine = targetLines[lineIndex]
      const existingAnchor = explicitHeadingId(targetLine)
      if (existingAnchor) {
        if (existingAnchor.id !== sourceHeading.id) {
          errors.push(
            `${contentRoot.name}/${relativeFile}:${targetHeading.line}: explicit ID ${existingAnchor.id} differs from English ID ${sourceHeading.id}`,
          )
          pageFailed = true
        } else if (existingAnchor.syntax !== 'mdx-comment') {
          targetLines[lineIndex] = addHeadingId(targetLine.replace(existingAnchor.match, ''), sourceHeading.id)
          normalizedAnchors += 1
        }
        continue
      }

      targetLines[lineIndex] = addHeadingId(targetLine, sourceHeading.id)
      addedAnchors += 1
    }

    if (!pageFailed && addedAnchors + normalizedAnchors > 0) {
      const nextContent = targetLines.join(eol)
      let verifiedHeadings
      try {
        verifiedHeadings = await parseHeadings(nextContent, path.relative(root, targetFile))
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
        continue
      }

      for (let index = 0; index < sourceHeadings.length; index += 1) {
        const expectedId = sourceHeadings[index].id
        if (expectedId && verifiedHeadings[index]?.id !== expectedId) {
          errors.push(
            `${contentRoot.name}/${relativeFile}: heading ${index + 1} verifies as ${verifiedHeadings[index]?.id ?? '<missing>'}, expected ${expectedId}`,
          )
          pageFailed = true
        }
      }
      if (pageFailed) continue

      const duplicateIds = sourceHeadings
        .map(heading => heading.id)
        .filter(Boolean)
        .filter((id, index, ids) => ids.indexOf(id) !== index)
      if (duplicateIds.length > 0) {
        errors.push(
          `${contentRoot.name}/${relativeFile}: English source contains duplicate heading ID(s): ${[...new Set(duplicateIds)].join(', ')}`,
        )
        continue
      }

      plans.push({ content: nextContent, file: targetFile })
      rootChangedPages += 1
      rootAddedAnchors += addedAnchors
      rootNormalizedAnchors += normalizedAnchors
    }
  }

  summary.set(contentRoot.name, {
    addedAnchors: rootAddedAnchors,
    changedPages: rootChangedPages,
    headings: rootHeadings,
    normalizedAnchors: rootNormalizedAnchors,
    pages: rootPages,
    skippedHeadings: rootSkippedHeadings,
  })
}

for (const [name, result] of summary) {
  console.log(
    `${name}: ${result.pages} pages, ${result.headings} headings, ${result.changedPages} pages need changes, ${result.addedAnchors} anchors to add, ${result.normalizedAnchors} anchors to normalize, ${result.skippedHeadings} skipped`,
  )
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} source heading warning(s):`)
  for (const warning of warnings) console.warn(`- ${warning}`)
}

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
  console.log('\nAll zh-HK headings preserve their English anchors.')
} else if (plans.length === 0) {
  console.log('\nNo changes needed; all zh-HK headings already preserve their English anchors.')
} else {
  await Promise.all(plans.map(plan => fs.writeFile(plan.file, plan.content)))
  console.log(`\nUpdated ${plans.length} zh-HK file(s).`)
}
