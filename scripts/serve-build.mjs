import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function readOption(names, fallback) {
  const index = process.argv.findIndex(argument => names.includes(argument))
  return index === -1 ? fallback : process.argv[index + 1]
}

const port = Number(readOption(['--port', '-p'], '3000'))
const host = readOption(['--host', '-h'], 'localhost')
const buildDir = path.resolve(readOption(['--dir'], 'build'))

function safePathname(requestUrl) {
  try {
    return decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname)
  } catch {
    return undefined
  }
}

function resolveInsideBuild(pathname) {
  const resolvedPath = path.resolve(buildDir, `.${pathname}`)
  return resolvedPath === buildDir || resolvedPath.startsWith(`${buildDir}${path.sep}`) ? resolvedPath : undefined
}

async function getFile(pathname) {
  const requestedPath = resolveInsideBuild(pathname)
  if (!requestedPath) return undefined

  try {
    const requestedStat = await stat(requestedPath)
    if (requestedStat.isDirectory()) {
      const indexPath = path.join(requestedPath, 'index.html')
      if ((await stat(indexPath)).isFile()) return { filePath: indexPath, redirect: !pathname.endsWith('/') }
    }
    if (requestedStat.isFile()) return { filePath: requestedPath, redirect: false }
  } catch {
    // Try Docusaurus' directory-style clean URL below.
  }

  if (!path.extname(requestedPath)) {
    const indexPath = path.join(requestedPath, 'index.html')
    try {
      if ((await stat(indexPath)).isFile()) return { filePath: indexPath, redirect: !pathname.endsWith('/') }
    } catch {
      // The 404 page is returned by the request handler.
    }
  }

  return undefined
}

function sendFile(response, filePath, statusCode = 200) {
  response.writeHead(statusCode, {
    'Content-Type': MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  const pathname = safePathname(request.url ?? '/')
  if (!pathname) {
    response.writeHead(400).end('Bad request')
    return
  }

  const file = await getFile(pathname)
  if (file?.redirect) {
    const search = new URL(request.url ?? '/', 'http://localhost').search
    response.writeHead(301, { Location: `${pathname}/${search}` }).end()
    return
  }

  if (file) {
    sendFile(response, file.filePath)
    return
  }

  const notFoundPath = path.join(buildDir, '404.html')
  try {
    await stat(notFoundPath)
    sendFile(response, notFoundPath, 404)
  } catch {
    response.writeHead(404).end('Not found')
  }
})

server.listen(port, host, () => {
  console.log(`Serving ${buildDir} at http://${host}:${port}`)
})
