import { existsSync } from 'node:fs'
import path from 'node:path'

/**
 * Rădăcina folderului de date al unui client, relativ la `_motor/`
 * (care e cwd la `next dev` / `next build`).
 *
 * Un singur motor, două layout-uri — regula 1 din REGULI.md ține: motorul
 * nu se schimbă per client, doar știe unde să caute.
 *
 *   MONOREPO de sistem/dev      `../clienti/<nume>/`
 *     Mulți clienți lângă motor. Aici trăiește și demo-ul.
 *
 *   REPO STANDALONE de client   `../` (rădăcina repo-ului)
 *     Ce livrează `npm run client-nou` (T31): un singur folder, cu
 *     `date/`, `poze/`, `en/`, `setari.md` chiar lângă `_motor/`. Clientul
 *     primește un repo curat, fără un sub-folder `clienti/` în care să se
 *     piardă.
 *
 * Se preferă monorepo dacă folderul există. Altfel, dacă rădăcina de lângă
 * motor arată a client (are `setari.md` sau `date/`), se folosește ea. Dacă
 * niciuna, se întoarce calea monorepo — ca eroarea „nu există clienti/<nume>"
 * să rămână clară în repo-ul de sistem.
 */
export function radacinaClientDir(nume: string): string {
  const monorepo = path.resolve(process.cwd(), '..', 'clienti', nume)
  if (existsSync(monorepo)) return monorepo

  const plat = path.resolve(process.cwd(), '..')
  if (existsSync(path.join(plat, 'setari.md')) || existsSync(path.join(plat, 'date'))) return plat

  return monorepo
}
