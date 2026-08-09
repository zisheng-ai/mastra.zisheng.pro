import fs from 'node:fs'
import path from 'node:path'

const repo = process.cwd()
const sourceRoot = path.join(repo, 'src/content/en/docs')
const targetRoot = path.join(repo, 'i18n/zh-HK/docusaurus-plugin-content-docs/current')

function files(root) {
  const result = []
  if (!fs.existsSync(root)) return result
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name)
    if (entry.isDirectory()) result.push(...files(full))
    else if (/\.mdx?$/.test(entry.name)) result.push(full)
  }
  return result.sort()
}

function relativeSet(root) {
  return new Set(files(root).map(file => path.relative(root, file)))
}

function fencedBlocks(text) {
  const blocks = []
  const lines = text.split('\n')
  let current = null
  let marker = null
  for (const line of lines) {
    const open = line.match(/^\s*(`{3,}|~{3,})/)
    if (!current && open) {
      marker = open[1]
      current = [line]
      continue
    }
    if (current) {
      current.push(line)
      if (line.trim() === marker) {
        blocks.push(current.join('\n'))
        current = null
        marker = null
      }
    }
  }
  if (current) blocks.push(current.join('\n'))
  return blocks
}

function proseOnly(text) {
  const lines = text.split('\n')
  let marker = null
  return lines
    .map(line => {
      const fence = line.match(/^\s*(`{3,}|~{3,})/)
      if (!marker && fence) {
        marker = fence[1]
        return ''
      }
      if (marker) {
        if (line.trim() === marker) marker = null
        return ''
      }
      return line
    })
    .join('\n')
}

function sortedMatches(text, regex, map = value => value) {
  return [...text.matchAll(regex)].map(match => map(match)).sort()
}

function frontmatterKeys(text) {
  if (!text.startsWith('---\n')) return []
  const end = text.indexOf('\n---', 4)
  if (end < 0) return []
  return text
    .slice(4, end)
    .split('\n')
    .map(line => line.match(/^([A-Za-z][\w-]*):/))
    .filter(Boolean)
    .map(match => match[1])
    .sort()
}

function signature(text) {
  const prose = proseOnly(text)
  return {
    fences: fencedBlocks(text),
    inlineCode: sortedMatches(prose, /(?<!`)`([^`\n]+)`(?!`)/g, match => match[1]),
    links: sortedMatches(prose, /\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g, match => match[1]),
    tokens: sortedMatches(text, /__[A-Z0-9_]+__/g, match => match[0]),
    imports: text.split('\n').filter(line => /^\s*(?:import|export)\b/.test(line)),
    jsx: sortedMatches(prose, /<\/?([A-Z][\w.]*)\b/g, match => match[1]),
    admonitions: sortedMatches(prose, /^:::(\w+)/gm, match => match[1]),
    headingRanks: sortedMatches(prose, /^(#{1,6})\s/gm, match => String(match[1].length)),
    frontmatterKeys: frontmatterKeys(text),
  }
}

const sources = relativeSet(sourceRoot)
const targets = relativeSet(targetRoot)
const missing = [...sources].filter(file => !targets.has(file)).sort()
const extra = [...targets].filter(file => !sources.has(file)).sort()
const mismatches = []

for (const rel of [...sources].filter(file => targets.has(file)).sort()) {
  const source = fs.readFileSync(path.join(sourceRoot, rel), 'utf8')
  const target = fs.readFileSync(path.join(targetRoot, rel), 'utf8')
  const a = signature(source)
  const b = signature(target)
  for (const key of Object.keys(a)) {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      mismatches.push(`${rel}\t${key}\tsource=${a[key].length}\ttarget=${b[key].length}`)
    }
  }
}

console.log(`source=${sources.size}`)
console.log(`target=${targets.size}`)
console.log(`missing=${missing.length}`)
for (const file of missing) console.log(`MISSING\t${file}`)
console.log(`extra=${extra.length}`)
for (const file of extra) console.log(`EXTRA\t${file}`)
console.log(`structural_mismatches=${mismatches.length}`)
for (const mismatch of mismatches) console.log(`MISMATCH\t${mismatch}`)

if (missing.length || extra.length || mismatches.length) process.exitCode = 1
