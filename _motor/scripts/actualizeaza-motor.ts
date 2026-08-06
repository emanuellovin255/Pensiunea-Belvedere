/**
 * npm run actualizeaza-motor -- clienti/<nume> [--forteaza]
 *
 * Propagă un fix din motor într-un site deja livrat. Re-copiază DOAR
 * `_motor/`. Nu atinge `date/`, `poze/`, `en/`, `setari.md`, `.env`,
 * `CITESTE-MA.md`, `PROPUNERE.md`.
 *
 * Înainte de copiere verifică dacă motorul clientului a fost modificat
 * local. Dacă da, se OPREȘTE (REGULI.md 1: un client nu editează motorul;
 * suprascrierea silențioasă ar șterge munca cuiva). Baseline-ul e ultimul
 * commit git al repo-ului de client — de asta clientul e un repo git (T34).
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MOTOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const EXCLUS = new Set(['node_modules', '.next', '.git', 'tsconfig.tsbuildinfo', '.client-activ'])
function filtruMotor(sursa: string): boolean {
  const baza = path.basename(sursa)
  if (EXCLUS.has(baza)) return false
  if (/\/content\/(site|audit)\.json$/.test(sursa)) return false
  if (/\/public\/media(\/|$)/.test(sursa) && !sursa.endsWith('/media')) return false
  return true
}

function git(cwd: string, ...args: string[]): string | null {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

function main() {
  const tinta = process.argv[2]
  if (!tinta || tinta.startsWith('-')) {
    console.error('\n  Utilizare: npm run actualizeaza-motor -- clienti/<nume> [--forteaza]\n')
    process.exit(1)
  }

  // Acceptă „clienti/vila" (relativ la rădăcina proiectului, fiindcă
  // comanda rulează din _motor/), o cale relativă la cwd, sau una absolută.
  const RADACINA = path.resolve(MOTOR, '..')
  const clientDir = path.isAbsolute(tinta)
    ? tinta
    : existsSync(path.resolve(RADACINA, tinta))
      ? path.resolve(RADACINA, tinta)
      : path.resolve(process.cwd(), tinta)
  const clientMotor = path.join(clientDir, '_motor')
  if (!existsSync(clientMotor)) {
    console.error(`\n  Nu găsesc ${path.relative(process.cwd(), clientMotor)}. E „${tinta}" un repo de client construit?\n`)
    process.exit(1)
  }
  if (path.resolve(clientMotor) === path.resolve(MOTOR)) {
    console.error('\n  Ăsta e chiar motorul-sursă, nu un client. Nimic de propagat.\n')
    process.exit(1)
  }

  const forteaza = process.argv.includes('--forteaza')

  /* ---------------------------- verificarea de siguranță (REGULI.md 1) */

  const gitRoot = git(clientDir, 'rev-parse', '--show-toplevel')
  if (gitRoot) {
    const modificat = git(clientDir, 'status', '--porcelain', '--', '_motor')
    if (modificat && !forteaza) {
      console.error('\n  OPRIT — motorul clientului are modificări locale necomise:\n')
      for (const l of modificat.split('\n')) console.error(`    ${l}`)
      console.error('\n  Regula 1 din REGULI.md: un client nu editează _motor/.')
      console.error(`  Inspectează:  git -C ${tinta} diff _motor`)
      console.error('  Comite sau renunță la aceste schimbări, apoi reia.')
      console.error('  (Sau, dacă chiar vrei să le pierzi: --forteaza)\n')
      process.exit(1)
    }
  } else if (!forteaza) {
    console.error(`\n  „${tinta}" nu e un repo git, deci nu pot verifica dacă motorul a fost modificat local.`)
    console.error('  Fără baseline, o suprascriere ar putea șterge o modificare. Opțiuni:')
    console.error('    · pune-l sub git (recomandat, oricum e cerut la publicare)')
    console.error('    · sau, dacă ești sigur că _motor nu a fost atins: --forteaza\n')
    process.exit(1)
  }

  /* ------------------------------------------------------------ copiere */

  cpSync(MOTOR, clientMotor, { recursive: true, filter: filtruMotor })
  console.log(`\n  Motor propagat în ${tinta}/_motor/.`)

  if (gitRoot) {
    const stat = git(clientDir, 'diff', '--stat', '--', '_motor')
    if (stat) {
      console.log('\n  Ce s-a schimbat:\n')
      for (const l of stat.split('\n')) console.log(`    ${l}`)
    } else {
      console.log('  (fără diferențe — motorul era deja la zi)')
    }
    console.log(`\n  Verifică:  git -C ${tinta} diff --stat\n`)
  } else {
    console.log(`\n  Verifică manual că doar _motor/ s-a schimbat.\n`)
  }
}

main()
