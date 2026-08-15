import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const groups = {
  docs: 'i18n/ko/docusaurus-plugin-content-docs/current',
  guides: 'i18n/ko/docusaurus-plugin-content-docs-guides/current',
  reference: 'i18n/ko/docusaurus-plugin-content-docs-reference/current',
  models: 'i18n/ko/docusaurus-plugin-content-docs-models/current',
  learn: 'src/learn/content/ko',
}

const args = new Map(process.argv.slice(2).map(value => {
  const [key, argument = ''] = value.replace(/^--/, '').split('=', 2)
  return [key, argument]
}))
const selectedGroup = args.get('group') || ''
const maxBatchItems = Number(args.get('batch-size') || 50)
const maxBatchCharacters = Number(args.get('batch-chars') || 16000)
const concurrency = Number(args.get('concurrency') || 3)
const limitBatches = Number(args.get('limit-batches') || Number.POSITIVE_INFINITY)
const auditOnly = args.has('audit')
const listAudit = args.has('list')

if (selectedGroup && !groups[selectedGroup]) throw new Error(`Unknown group: ${selectedGroup}`)
for (const [name, value] of [['batch-size', maxBatchItems], ['batch-chars', maxBatchCharacters], ['concurrency', concurrency]]) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`--${name} must be a positive integer`)
}

async function listMdx(directory, recursive = true) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory() && recursive) files.push(...await listMdx(file, true))
    else if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(file)
  }
  return files.sort()
}

const commonEnglish = /\b(?:a|about|after|an|and|are|as|at|be|before|but|by|can|configure|create|does|example|examples|for|from|has|have|if|in|into|is|it|of|on|or|related|returns?|see|set|should|that|the|then|this|to|use|uses|using|when|where|which|will|with|without|you|your)\b/i
const exactTechnical = /^(?:Agent|Agents|Workflow|Workflows|MCP|Studio|Provider|Providers|Trace|Traces|Evals|Tool|Tools|Skill|Skills|Sandbox|Workspace|Workspaces|Mastra|Observability|Memory|Prompt|Model|Models|TypeScript|JavaScript|API|SDK|CLI|HTTP|HTTPS|JSON|YAML|React|Next\.js|Node\.js|npm|pnpm|Yarn|Bun)$/

function looksLikeCodeOrData(text) {
  if (/```|~~~/.test(text)) return true
  if (/\b(?:const|let|var|await|return|async|function|process\.|console\.|new\s+\w+)\b/.test(text)) return true
  if (/=>|[{}];|^\s*(?:name|type|description|model|imageInput|audioInput|videoInput|toolUsage|reasoning|contextWindow|maxOutput|inputCost|outputCost)\s*:/m.test(text)) return true
  if (/\b(?:width|height|viewBox|fill|d|x1|x2|gradientUnits|stopColor|href|logo)=/.test(text)) return true
  const syntaxCount = (text.match(/[{}[\];=]/g) || []).length
  const hangulCount = (text.match(/[가-힣]/g) || []).length
  return syntaxCount > 6 && hangulCount < 20
}

function shouldTranslate(block) {
  const text = block.trim()
  if (!text || !/[A-Za-z]/.test(text) || exactTechnical.test(text)) return false
  if (looksLikeCodeOrData(text)) return false
  if (/^(?:import|export)\s/m.test(text)) return false
  if (/^<\/?[A-Za-z]|^\{|^\/\//m.test(text)) return false
  if (/^(?:https?:\/\/|[/@.#][^\s]+$)/.test(text)) return false
  const withoutSyntax = text
    .replace(/`[^`]*`/g, '')
    .replace(/\]\([^)]+\)/g, ']')
    .replace(/<[^>]+>/g, '')
    .replace(/\{\/\*[^]*?\*\/\}/g, '')
  const words = withoutSyntax.match(/[A-Za-z][A-Za-z'’-]*/g) || []
  if (commonEnglish.test(withoutSyntax)) return true
  return !/[가-힣]/.test(withoutSyntax) && words.length >= 4
}

function protectedValues(text) {
  const patterns = [
    /`[^`\n]+`/g,
    /\]\(([^)]+)\)/g,
    /<\/?[A-Za-z][^>]*>/g,
    /\{\/\*[^]*?\*\/\}/g,
    /__[A-Z0-9_]+__/g,
    /```|~~~/g,
  ]
  return patterns.flatMap(pattern => [...text.matchAll(pattern)].map(match => match[0]))
}

function sameProtectedValues(source, translated) {
  return JSON.stringify(protectedValues(source).sort()) === JSON.stringify(protectedValues(translated).sort())
}

function collectBlocks(content) {
  const lines = content.split(/(?<=\n)/u)
  const blocks = []
  let offset = 0
  let start = 0
  let value = ''
  let inFence = false
  let inFrontmatter = false

  const flush = () => {
    if (value.trim()) blocks.push({ start, end: start + value.length, value })
    value = ''
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (offset === 0 && trimmed === '---') inFrontmatter = true
    else if (inFrontmatter && trimmed === '---') inFrontmatter = false

    if (/^```|^~~~/.test(trimmed)) {
      flush()
      inFence = !inFence
      offset += line.length
      start = offset
      continue
    }

    const structural = inFrontmatter || inFence || !trimmed || /^(?:import|export)\s|^<\/?[A-Za-z]|^\{|^\/\//.test(trimmed)
    if (structural) {
      flush()
      offset += line.length
      start = offset
      continue
    }

    if (!value) start = offset
    value += line
    offset += line.length
  }
  flush()
  return blocks
}

async function loadDocuments() {
  const documents = []
  const selected = selectedGroup ? [[selectedGroup, groups[selectedGroup]]] : Object.entries(groups)
  for (const [group, relativeDirectory] of selected) {
    const directory = path.join(root, relativeDirectory)
    const files = await listMdx(directory, group !== 'learn')
    for (const file of files) documents.push({ group, file, content: await fs.readFile(file, 'utf8'), replacements: [] })
  }
  return documents
}

function collectRecords(documents) {
  const records = []
  for (const document of documents) {
    for (const block of collectBlocks(document.content)) {
      if (!shouldTranslate(block.value)) continue
      records.push({
        id: `t${records.length + 1}`,
        source: block.value,
        file: path.relative(root, document.file),
        document,
        start: block.start,
        end: block.end,
      })
    }
  }
  return records
}

function createBatches(records) {
  const batches = []
  let batch = []
  let characters = 0
  for (const record of records) {
    if (batch.length && (batch.length >= maxBatchItems || characters + record.source.length > maxBatchCharacters)) {
      batches.push(batch)
      batch = []
      characters = 0
    }
    batch.push(record)
    characters += record.source.length
  }
  if (batch.length) batches.push(batch)
  return batches
}

function runCodex(input, schemaFile, outputFile) {
  const codexArgs = [
    'exec', '--ephemeral', '--ignore-user-config', '--ignore-rules',
    '--sandbox', 'read-only', '--color', 'never',
    '-c', 'model_reasoning_effort="low"',
    '--output-schema', schemaFile,
    '--output-last-message', outputFile,
    '-',
  ]
  return new Promise((resolve, reject) => {
    const child = spawn('/opt/homebrew/bin/codex', codexArgs, { cwd: root, stdio: ['pipe', 'ignore', 'pipe'] })
    let stderr = ''
    child.stderr.on('data', chunk => { stderr += chunk })
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`Codex exited with ${code}: ${stderr.slice(-2000)}`)))
    child.stdin.end(input)
  })
}

async function translateBatch(records, batchIndex, cacheDirectory, schemaFile) {
  const outputFile = path.join(cacheDirectory, `batch-${batchIndex}.json`)
  const payload = records.map(record => ({ id: record.id, markdown: record.source, file: record.file }))
  const prompt = `Translate every public Mastra documentation Markdown block in the input JSON from English or mixed Korean-English into natural professional Korean. Use only your own language ability. Do not call tools, browse, access files, invoke subprocesses, or use external translation services. Return exactly one result for every id.\n\nRules:\n- Translate and polish the complete prose block so inline-code boundaries read naturally in Korean.\n- Keep these concepts in English: Agent, Workflow, MCP, Studio, Provider, Trace, Evals, Tool, Skill, Sandbox, Workspace, Observability, Memory, Prompt, Model.\n- Keep product names, protocols, libraries, API symbols, identifiers, package names, commands, paths, URLs, literal UI labels, and __TOKEN__ placeholders unchanged.\n- Preserve every Markdown link destination, inline-code span, MDX/HTML tag, explicit anchor comment, list marker, table delimiter, and overall Markdown structure exactly. Translate visible link text.\n- Do not omit, summarize, merge, or add facts.\n- If a block is entirely intentional technical notation, return it unchanged.\n\nInput JSON:\n${JSON.stringify(payload)}`
  await runCodex(prompt, schemaFile, outputFile)
  const parsed = JSON.parse(await fs.readFile(outputFile, 'utf8'))
  const translations = new Map(parsed.translations.map(item => [item.id, item.markdown]))
  for (const record of records) {
    const translated = translations.get(record.id)
    if (typeof translated !== 'string' || !translated.trim()) {
      console.warn(`Skipped missing translation for ${record.id} in ${record.file}.`)
      continue
    }
    if (!sameProtectedValues(record.source, translated)) {
      console.warn(`Skipped structurally unsafe translation for ${record.id} in ${record.file}.`)
      continue
    }
    const trailingWhitespace = record.source.match(/\s*$/u)?.[0] || ''
    record.document.replacements.push({ start: record.start, end: record.end, value: translated.trimEnd() + trailingWhitespace })
  }
}

async function writeDocuments(documents) {
  for (const document of documents) {
    if (!document.replacements.length) continue
    let content = document.content
    for (const replacement of document.replacements.sort((a, b) => b.start - a.start)) {
      content = content.slice(0, replacement.start) + replacement.value + content.slice(replacement.end)
    }
    await fs.writeFile(document.file, content)
  }
}

async function mapConcurrent(values, operation) {
  let next = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (next < values.length) {
      const index = next++
      let completed = false
      for (let attempt = 1; attempt <= 4 && !completed; attempt++) {
        try {
          await operation(values[index], index)
          completed = true
        }
        catch (error) {
          if (attempt === 4) {
            console.warn(`Skipped failed batch ${index + 1} after 4 attempts: ${error.message}`)
            break
          }
          const delay = attempt * 15000
          console.warn(`Retrying batch ${index + 1} in ${delay / 1000}s: ${error.message}`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
      if (completed) console.log(`Translated batch ${index + 1}/${values.length} (${values[index].length} blocks).`)
    }
  }))
}

const documents = await loadDocuments()
const records = collectRecords(documents)
const affectedFiles = new Set(records.map(record => record.file))
const characters = records.reduce((sum, record) => sum + record.source.length, 0)
console.log(`Found ${records.length} Markdown blocks (${characters} characters) in ${affectedFiles.size} files.`)
if (listAudit) {
  for (const record of records) console.log(`${record.id}\t${record.file}\t${record.source.replace(/\s+/g, ' ').slice(0, 240)}`)
}
if (auditOnly || records.length === 0) process.exit(0)

const cacheDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'mastra-ko-codex-'))
const schemaFile = path.join(cacheDirectory, 'schema.json')
await fs.writeFile(schemaFile, JSON.stringify({
  type: 'object',
  additionalProperties: false,
  required: ['translations'],
  properties: {
    translations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'markdown'],
        properties: { id: { type: 'string' }, markdown: { type: 'string' } },
      },
    },
  },
}))

const batches = createBatches(records).slice(0, limitBatches)
await mapConcurrent(batches, (batch, index) => translateBatch(batch, index + 1, cacheDirectory, schemaFile))
await writeDocuments(documents)
console.log(`Codex translated ${batches.reduce((sum, batch) => sum + batch.length, 0)} Markdown blocks.`)
