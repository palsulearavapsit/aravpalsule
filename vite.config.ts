import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

type Certificate = { src: string; caption: string }
const virtualCertificatesId = 'virtual:certificates'
const resolvedCertificatesId = `\0${virtualCertificatesId}`

function publicCertificates(): Plugin {
  let certificatesDirectory = ''
  return {
    name: 'public-certificates',
    configResolved(config) {
      certificatesDirectory = resolve(config.root, 'public/certificates')
    },
    resolveId(id) {
      if (id === virtualCertificatesId) return resolvedCertificatesId
    },
    load(id) {
      if (id !== resolvedCertificatesId) return
      let certificates: Certificate[] = []
      try {
        certificates = readdirSync(certificatesDirectory, { withFileTypes: true })
          .filter(file => file.isFile() && /\.(jpe?g|png|webp)$/i.test(file.name))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(file => ({
            src: `/certificates/${encodeURIComponent(file.name)}`,
            caption: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
          }))
      } catch {
        // An empty folder is a supported gallery state.
      }
      return `export default ${JSON.stringify(certificates)}`
    },
    configureServer(server) {
      server.watcher.add(certificatesDirectory)
      server.watcher.on('add', changedPath => {
        if (changedPath.startsWith(certificatesDirectory)) server.ws.send({ type: 'full-reload' })
      })
      server.watcher.on('unlink', changedPath => {
        if (changedPath.startsWith(certificatesDirectory)) server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), publicCertificates()],
})
