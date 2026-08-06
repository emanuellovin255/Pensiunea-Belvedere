/**
 * Copiază pozele clientului activ în `public/media`, de unde le servește
 * Next. Rulează automat înainte de `dev` și `build` (predev / prebuild),
 * ca „am pus o poză nouă în poze/" să funcționeze fără un pas manual.
 *
 * `public/media` e artefact de build (în .gitignore) — se regenerează.
 * No-op tăcut dacă nu există un client activ sau un folder `poze/`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { radacinaClientDir } from '../lib/continut/radacina'

const MOTOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const marker = path.join(MOTOR, '.client-activ')
if (!existsSync(marker)) process.exit(0)

const nume = readFileSync(marker, 'utf8').trim()
if (!nume) process.exit(0)

const poze = path.join(radacinaClientDir(nume), 'poze')
if (!existsSync(poze)) process.exit(0)

const media = path.join(MOTOR, 'public', 'media')
mkdirSync(media, { recursive: true })

let n = 0
for (const f of readdirSync(poze)) {
  if (f.startsWith('.')) continue
  copyFileSync(path.join(poze, f), path.join(media, f))
  n++
}
if (n) console.log(`  sync-media: ${n} poze → public/media`)
