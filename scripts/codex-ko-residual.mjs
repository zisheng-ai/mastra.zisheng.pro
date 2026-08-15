import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkFrontmatter from 'remark-frontmatter'
import { visit } from 'unist-util-visit'

const root = process.cwd()
const roots = [
  'i18n/ko/docusaurus-plugin-content-docs/current',
  'i18n/ko/docusaurus-plugin-content-docs-guides/current',
  'i18n/ko/docusaurus-plugin-content-docs-reference/current',
  'i18n/ko/docusaurus-plugin-content-docs-models/current',
  'src/learn/content/ko',
]
const audit = process.argv.includes('--audit')

async function files(directory) {
  const result = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await files(target))
    else if (entry.name.endsWith('.mdx')) result.push(target)
  }
  return result
}

function isResidual(value) {
  const text = value.replace(/https?:\/\/\S+/g, '')
  const words = text.match(/[A-Za-z][A-Za-z'’-]*/g) || []
  const latin = (text.match(/[A-Za-z]/g) || []).length
  const hangul = (text.match(/[가-힣]/g) || []).length
  return words.length >= 8 && latin > Math.max(35, hangul * 1.5)
}

const documents = []
const records = []
for (const directory of roots) {
  for (const file of await files(directory)) {
    const content = await fs.readFile(file, 'utf8')
    let tree
    try {
      tree = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter, ['yaml']).parse(content)
    }
    catch { continue }
    const document = { file, content, replacements: [] }
    documents.push(document)
    visit(tree, 'text', node => {
      if (!node.position || !isResidual(node.value)) return
      records.push({
        id: `t${records.length + 1}`,
        file: path.relative(root, file),
        value: node.value,
        start: node.position.start.offset,
        end: node.position.end.offset,
        document,
      })
    })
  }
}

console.log(`Found ${records.length} residual prose nodes in ${new Set(records.map(item => item.file)).size} files.`)
if (audit || !records.length) process.exit(0)

const batches = []
let current = []
let characters = 0
for (const record of records) {
  if (current.length && (current.length >= 60 || characters + record.value.length > 16000)) {
    batches.push(current); current = []; characters = 0
  }
  current.push(record); characters += record.value.length
}
if (current.length) batches.push(current)

const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'mastra-ko-residual-'))
const schema = path.join(temporary, 'schema.json')
await fs.writeFile(schema, JSON.stringify({
  type: 'object', additionalProperties: false, required: ['translations'],
  properties: { translations: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['id', 'text'], properties: { id: { type: 'string' }, text: { type: 'string' } } } } },
}))

function run(prompt, output) {
  return new Promise((resolve, reject) => {
    const child = spawn('/opt/homebrew/bin/codex', ['exec', '--ephemeral', '--ignore-user-config', '--ignore-rules', '--sandbox', 'read-only', '--color', 'never', '-c', 'model_reasoning_effort="low"', '--output-schema', schema, '--output-last-message', output, '-'], { cwd: root, stdio: ['pipe', 'ignore', 'pipe'] })
    let error = ''
    child.stderr.on('data', chunk => { error += chunk })
    child.on('close', code => code === 0 ? resolve() : reject(new Error(error.slice(-1500))))
    child.stdin.end(prompt)
  })
}

let next = 0
await Promise.all(Array.from({ length: 3 }, async () => {
  while (next < batches.length) {
    const index = next++
    const batch = batches[index]
    const output = path.join(temporary, `${index}.json`)
    const input = batch.map(item => ({ id: item.id, text: item.value, file: item.file }))
    const prompt = `Translate every English or mixed English-Korean documentation text fragment into natural professional Korean. Use only your own language ability; do not use tools, files, browsing, subprocesses, or external translation services. Return every id exactly once. Preserve Agent, Workflow, MCP, Studio, Provider, Trace, Evals, Tool, Skill, Sandbox, Workspace, Observability, Memory, Prompt, Model, product names, APIs, identifiers, and literal UI labels in English. Do not add Markdown syntax, omit facts, or summarize. Input: ${JSON.stringify(input)}`
    for (let attempt = 1; attempt <= 4; attempt++) {
      try { await run(prompt, output); break }
      catch (error) {
        if (attempt === 4) throw error
        await new Promise(resolve => setTimeout(resolve, attempt * 10000))
      }
    }
    const translated = new Map(JSON.parse(await fs.readFile(output, 'utf8')).translations.map(item => [item.id, item.text]))
    for (const item of batch) {
      const value = translated.get(item.id)
      if (typeof value !== 'string' || !value.trim()) continue
      const leading = item.value.match(/^\s*/u)?.[0] || ''
      const trailing = item.value.match(/\s*$/u)?.[0] || ''
      item.document.replacements.push({ start: item.start, end: item.end, value: leading + value.trim() + trailing })
    }
    console.log(`Translated batch ${index + 1}/${batches.length}.`)
  }
}))

for (const document of documents) {
  let content = document.content
  for (const replacement of document.replacements.sort((a, b) => b.start - a.start)) content = content.slice(0, replacement.start) + replacement.value + content.slice(replacement.end)
  if (document.replacements.length) await fs.writeFile(document.file, content)
}
await fs.rm(temporary, { recursive: true, force: true })
console.log(`Translated ${records.length} residual prose nodes.`)
