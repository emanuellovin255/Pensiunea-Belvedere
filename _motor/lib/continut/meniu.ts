import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { MeniuCategorie } from '@/content/meniu'

import { analizeaza, text } from './md'

/**
 * Încarcă meniul din date/07-meniu-restaurant.md.
 *
 * `##` deschide o categorie, `###` un preparat. Fiecare preparat are
 * un preț și, opțional, alergeni. Se întoarce o listă goală dacă
 * fișierul lipsește sau e necompletat — apelantul decide dacă asta e o
 * problemă (de obicei nu: meniul e opțional).
 */
export function incarcaMeniu(radacinaDate: string): MeniuCategorie[] {
  const cale = path.join(radacinaDate, '07-meniu-restaurant.md')
  if (!existsSync(cale)) return []

  const doc = analizeaza(readFileSync(cale, 'utf8'))
  const categorii: MeniuCategorie[] = []

  for (const bloc of doc.blocuri) {
    if (!bloc.titlu.trim()) continue
    const preparate = bloc.subblocuri
      .filter((sb) => sb.titlu.trim())
      .map((sb) => ({
        nume: sb.titlu,
        pret: text(sb.campuri.get('pret')),
        alergeni: text(sb.campuri.get('alergeni')),
      }))
    if (!preparate.length) continue
    categorii.push({
      nume: bloc.titlu,
      servit: text(bloc.campuri.get('servit')),
      preparate,
    })
  }

  return categorii
}
