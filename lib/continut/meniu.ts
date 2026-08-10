import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { Meniu, MeniuCategorie } from '@/content/meniu'

import { FISIERE, rezolva } from './fisiere'
import { analizeaza, lista, normalizeaza, text } from './md'

/**
 * Încarcă meniul din date/07-meniu-restaurant.md.
 *
 * `##` deschide o categorie, `###` un preparat. Fiecare preparat are
 * un preț și, opțional, gramaj, alergeni, o notă de comandă și valorile
 * nutriționale. Ingredientele vin din CORPUL blocului `###`, ca
 * descrierea unei camere din `04-camere.md` — cine scrie meniul le
 * înșiră în proză, nu într-un câmp.
 *
 * Primul bloc poate fi `## Secțiune` — antetul secțiunii, ca la oferte.
 * N-are `###`, deci nu devine categorie.
 *
 * Se întoarce o listă goală dacă fișierul lipsește sau e necompletat —
 * apelantul decide dacă asta e o problemă (de obicei nu: meniul e
 * opțional).
 */
export function incarcaMeniu(radacinaDate: string, radacinaClient?: string): Meniu {
  const gol: Meniu = { sectiune: {}, categorii: [] }
  const cale = rezolva(radacinaDate, FISIERE.meniu)
  if (!cale) return gol

  /**
   * `Poza:` → `/media/<fisier>`, dar numai dacă fișierul chiar există în
   * `poze/`. Un nume greșit scrie altfel un `<img>` rupt în pagină; aici
   * pur și simplu nu apare poza, restul preparatului rămâne întreg
   * (REGULI.md 3). Verificarea sare dacă nu știm rădăcina clientului.
   */
  const media = (nume?: string): string | undefined => {
    const n = nume?.trim()
    if (!n) return undefined
    if (radacinaClient && !existsSync(path.join(radacinaClient, 'poze', n))) return undefined
    return `/media/${n}`
  }

  const doc = analizeaza(readFileSync(cale, 'utf8'))
  const categorii: MeniuCategorie[] = []
  const sectiune: Meniu['sectiune'] = {}

  for (const bloc of doc.blocuri) {
    if (!bloc.titlu.trim()) continue

    // Antetul secțiunii: același tipar ca `## Secțiune` din 06-oferte-si-excursii.md.
    if (normalizeaza(bloc.titlu) === 'sectiune') {
      sectiune.eyebrow = text(bloc.campuri.get('eticheta'))
      sectiune.title = text(bloc.campuri.get('titlu'))
      sectiune.lede = text(bloc.campuri.get('text introductiv')) ?? (bloc.text.trim() || undefined)
      const ev = lista(bloc.campuri.get('categorii pe prima pagina'))
      if (ev.length) sectiune.evidentiate = ev
      continue
    }

    const preparate = bloc.subblocuri
      .filter((sb) => sb.titlu.trim())
      .map((sb) => ({
        nume: sb.titlu,
        pret: text(sb.campuri.get('pret')),
        alergeni: text(sb.campuri.get('alergeni')),
        gramaj: text(sb.campuri.get('gramaj')),
        nota: text(sb.campuri.get('nota')),
        nutritie: text(sb.campuri.get('valori nutritionale')),
        poza: media(text(sb.campuri.get('poza'))),
        descriere: sb.text.trim() || undefined,
      }))
    if (!preparate.length) continue
    categorii.push({
      nume: bloc.titlu,
      servit: text(bloc.campuri.get('servit')),
      preparate,
    })
  }

  return { sectiune, categorii }
}
