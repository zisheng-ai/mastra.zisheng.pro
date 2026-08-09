/**
 * Output generation for root and individual llms.txt files
 */

import fs from 'fs-extra'
import path from 'path'
import { generateMarkdownList, getBaseUrl, getSidebarLocations, parseSidebarFile } from './sidebars-handler'
import type { ResolvedOptions } from './options'

export interface RouteEntry {
  route: string
  title?: string
  cached: boolean
}

/**
 * Generate the root llms.txt file with links to all individual files
 */
export async function generateRootLlmsTxt(outDir: string, siteDir: string, options: ResolvedOptions): Promise<void> {
  let output = `# ${options.siteTitle}\n\n> ${options.siteDescription}\n\nBelow is a list of all available documentation pages.\n\n`

  for (const sidebar of getSidebarLocations(siteDir)) {
    try {
      const items = await parseSidebarFile(sidebar.path)
      const baseUrl = getBaseUrl(sidebar.id, options.siteUrl)
      const condensedCategories = sidebar.condensedCategories || []

      output += `## ${sidebar.id}\n\n`
      output += generateMarkdownList(items, baseUrl, 0, condensedCategories)
      output += '\n'
    } catch (error) {
      console.error(`Error processing ${sidebar.id}:`, error)
    }
  }

  await fs.writeFile(path.join(outDir, 'llms.txt'), output, 'utf-8')
}

/**
 * Write an individual llms.txt file
 */
export async function writeLlmsTxt(outputPath: string, content: string, prefix = ''): Promise<void> {
  await fs.ensureDir(path.dirname(outputPath))
  await fs.writeFile(outputPath, `${prefix}${content}`, 'utf-8')
}
