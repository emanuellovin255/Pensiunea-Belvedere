import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { SiteData } from '@/content/types'
import { incarcaClient, radacinaClientDir, IMPLICIT as SETARI_IMPLICITE, type Setari } from '@/lib/continut'
import { incarcaMeniu } from '@/lib/continut/meniu'
import type { MeniuCategorie, MeniuSectiune } from '@/content/meniu'
import { DEMO } from '@/lib/demo'
import type { Limba } from '@/lib/i18n/limbi'

/**
 * Rezolvă „site-ul curent" — singurul loc care știe ce SiteData se
 * randează.
 *
 * DE CE EXISTĂ
 * ------------
 * Motorul e copiat în repo-ul fiecărui client (DECIZII.md): un repo =
 * un client. Dar în repo-ul SISTEMULUI (ăsta) nu există niciun client —
 * doar demo-ul. Resolver-ul ascunde diferența:
 *
 *   - dacă există `clienti/<nume>/` cu un fișier `.client-activ` la
 *     rădăcina motorului, se încarcă acel client (cazul repo-ului de
 *     client, scris de `npm run client-nou`, T31);
 *   - altfel se cade pe DEMO, ca probe-urile, sitemap-ul și llms.txt să
 *     funcționeze în repo-ul sistemului.
 *
 * Nimic din UI nu știe de distincția asta: componentele primesc un
 * SiteData și atât.
 */

export interface Site {
  date: SiteData
  setari: Setari
  meniu: MeniuCategorie[]
  /** Antetul secțiunii de meniu (`## Secțiune` din 07-meniu-restaurant.md). */
  meniuSectiune: MeniuSectiune
  /** Numele folderului de client, sau `null` pentru demo. */
  client: string | null
}

function numeClientActiv(): string | null {
  const marker = path.resolve(process.cwd(), '.client-activ')
  if (!existsSync(marker)) return null
  const nume = readFileSync(marker, 'utf8').trim()
  return nume || null
}

/** Cache pe proces: build-ul cere același site de zeci de ori. */
const cache = new Map<string, Site>()

export function siteCurent(limba: Limba = 'ro'): Site {
  const cheie = limba
  const gata = cache.get(cheie)
  if (gata) return gata

  const client = numeClientActiv()

  let site: Site
  if (client) {
    const { date, setari } = incarcaClient(client, limba)
    const radacinaClient = radacinaClientDir(client)
    const radacinaDate = path.join(radacinaClient, limba === 'ro' ? 'date' : limba)
    // Rădăcina clientului merge mai departe pentru `poze/`: pozele
    // preparatelor sunt comune ambelor limbi, deci nu stau în `en/`.
    const incarcat = setari.module.meniuRestaurant
      ? incarcaMeniu(radacinaDate, radacinaClient)
      : { sectiune: {}, categorii: [] }
    site = { date, setari, meniu: incarcat.categorii, meniuSectiune: incarcat.sectiune, client }
  } else {
    // Repo-ul sistemului: demo, cu setările implicite.
    site = { date: DEMO, setari: SETARI_IMPLICITE, meniu: [], meniuSectiune: {}, client: null }
  }

  cache.set(cheie, site)
  return site
}

