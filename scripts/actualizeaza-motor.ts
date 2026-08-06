/**
 * npm run actualizeaza-motor -- clienti/<nume> [--forteaza]
 *
 * Propagă un fix din motor într-un site deja livrat. Nu atinge `date/`,
 * `poze/`, `en/`, `setari.md`, `tasks/`, `_sursa/`, `.env`, `CITESTE-MA.md`,
 * `PROPUNERE.md`.
 *
 * În repo-ul de client motorul E rădăcina (ca Vercel să-l buildeze cu
 * setările implicite), deci nu mai există un folder `_motor/` de re-copiat.
 * Lista de căi ale motorului se citește din motorul-sursă: tot ce e la
 * primul nivel în `_motor/`, mai puțin artefactele și fișierele pe care
 * clientul le deține. Se întreține singură — un folder nou în motor se
 * propagă fără să atingi scriptul ăsta.
 *
 * `package.json` e singurul fișier fuzionat, nu copiat: numele și
 * descrierea sunt ale clientului, scripturile și dependențele sunt ale
 * motorului.
 *
 * Înainte de copiere verifică dacă motorul clientului a fost modificat
 * local. Dacă da, se OPREȘTE (REGULI.md 1: un client nu editează motorul;
 * suprascrierea silențioasă ar șterge munca cuiva). Baseline-ul e ultimul
 * commit git al repo-ului de client — de asta clientul e un repo git (T34).
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const MOTOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Artefacte de build și fișiere pe care le deține clientul. */
const NU_SE_PROPAGA = new Set([
  'node_modules',
  '.next',
  '.git',
  'tsconfig.tsbuildinfo',
  '.client-activ', // marchează clientul activ — al fiecărui repo în parte
  'package.json', // fuzionat separat, ca să nu piardă numele clientului
])

function filtruMotor(sursa: string): boolean {
  const baza = path.basename(sursa)
  if (NU_SE_PROPAGA.has(baza)) return false
  if (/\/content\/(site|audit)\.json$/.test(sursa)) return false
  if (/\/public\/media(\/|$)/.test(sursa) && !sursa.endsWith('/media')) return false
  return true
}

/** Căile motorului, la primul nivel — exact ce se propagă într-un client. */
function caiMotor(): string[] {
  return readdirSync(MOTOR).filter((n) => !NU_SE_PROPAGA.has(n))
}

function git(cwd: string, ...args: string[]): string | null {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
  } catch {
    return null
  }
}

/** Scripturile și dependențele vin din motor; identitatea rămâne a clientului. */
function fuzioneazaPackageJson(clientDir: string) {
  const caleClient = path.join(clientDir, 'package.json')
  if (!existsSync(caleClient)) return
  const client = JSON.parse(readFileSync(caleClient, 'utf8'))
  const motor = JSON.parse(readFileSync(path.join(MOTOR, 'package.json'), 'utf8'))
  const fuzionat = {
    ...client,
    scripts: motor.scripts,
    dependencies: motor.dependencies,
    devDependencies: motor.devDependencies,
    engines: motor.engines,
  }
  writeFileSync(caleClient, JSON.stringify(fuzionat, null, 2) + '\n')
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
  if (!existsSync(path.join(clientDir, 'setari.md'))) {
    console.error(`\n  Nu găsesc ${path.relative(process.cwd(), clientDir)}/setari.md. E „${tinta}" un repo de client construit?\n`)
    process.exit(1)
  }
  if (path.resolve(clientDir) === path.resolve(MOTOR)) {
    console.error('\n  Ăsta e chiar motorul-sursă, nu un client. Nimic de propagat.\n')
    process.exit(1)
  }

  const forteaza = process.argv.includes('--forteaza')
  const cai = caiMotor()

  /* ---------------------------- verificarea de siguranță (REGULI.md 1) */

  const gitRoot = git(clientDir, 'rev-parse', '--show-toplevel')
  if (gitRoot) {
    const modificat = git(clientDir, 'status', '--porcelain', '--', ...cai)
    if (modificat && !forteaza) {
      console.error('\n  OPRIT — motorul clientului are modificări locale necomise:\n')
      for (const l of modificat.split('\n')) console.error(`    ${l}`)
      console.error('\n  Regula 1 din REGULI.md: un client nu editează codul motorului.')
      console.error(`  Inspectează:  git -C ${tinta} diff ${cai.join(' ')}`)
      console.error('  Comite sau renunță la aceste schimbări, apoi reia.')
      console.error('  (Sau, dacă chiar vrei să le pierzi: --forteaza)\n')
      process.exit(1)
    }
  } else if (!forteaza) {
    console.error(`\n  „${tinta}" nu e un repo git, deci nu pot verifica dacă motorul a fost modificat local.`)
    console.error('  Fără baseline, o suprascriere ar putea șterge o modificare. Opțiuni:')
    console.error('    · pune-l sub git (recomandat, oricum e cerut la publicare)')
    console.error('    · sau, dacă ești sigur că motorul nu a fost atins: --forteaza\n')
    process.exit(1)
  }

  /* ------------------------------------------------------------ copiere */

  for (const c of cai) {
    cpSync(path.join(MOTOR, c), path.join(clientDir, c), { recursive: true, filter: filtruMotor })
  }
  fuzioneazaPackageJson(clientDir)
  console.log(`\n  Motor propagat în ${tinta}/.`)

  if (gitRoot) {
    const stat = git(clientDir, 'diff', '--stat')
    if (stat) {
      console.log('\n  Ce s-a schimbat:\n')
      for (const l of stat.split('\n')) console.log(`    ${l}`)
    } else {
      console.log('  (fără diferențe — motorul era deja la zi)')
    }
    console.log(`\n  Verifică:  git -C ${tinta} diff --stat\n`)
  } else {
    console.log(`\n  Verifică manual că doar codul motorului s-a schimbat.\n`)
  }
}

main()
