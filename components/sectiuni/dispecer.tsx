import type { ReactNode } from 'react'

import {
  BandaIncredere,
  Camere,
  Evenimente,
  Facilitati,
  Faq,
  Features,
  Inchidere,
  MeniuLinkPdf,
  MeniuRestaurant,
  Oferte,
  Prezentare,
  Recenzii,
} from '.'
import { HartaFacade } from './HartaFacade'
import type { SiteData } from '@/content/types'
import type { MeniuCategorie } from '@/content/meniu'

/**
 * Un id de secțiune → componenta lui.
 *
 * Trăiește în motor pentru că toate trei șabloanele (C2) îl folosesc:
 * fiecare parcurge `setari.sectiuni` (T05) și cere aici componenta,
 * ca ordinea și comutatoarele de module să rămână identice indiferent
 * de skin. Un șablon care tratează o secțiune în felul lui (de ex.
 * Șablonul 2 recalculează `reverse` la `features`, Șablonul 3 pune
 * galeria în coloana lui) sare acel id și îl compune singur.
 *
 * Fiecare componentă decide singură dacă se randează (REGULI.md 3):
 * fără date, întoarce null și secțiunea pur și simplu lipsește.
 */
export interface ContextSectiuni {
  date: SiteData
  meniu: MeniuCategorie[]
  /**
   * Calea PDF-ului cu meniul (`setari.md` → „Meniu PDF"). Când există,
   * secțiunea `menu` devine un link către fișier în loc de lista întreagă
   * de preparate.
   */
  meniuPdf?: string
}

export function sectiune(id: string, { date, meniu, meniuPdf }: ContextSectiuni): ReactNode {
  switch (id) {
    case 'trust':
      return <BandaIncredere date={date} />
    case 'perks':
      return <Facilitati date={date} />
    case 'rooms':
      return <Camere date={date} />
    case 'features':
      return <Features features={date.features} />
    case 'prezentare':
      return <Prezentare date={date} />
    case 'offers':
      return <Oferte date={date} />
    case 'events':
      return <Evenimente date={date} />
    case 'reviews':
      return <Recenzii date={date} />
    case 'map':
      return <HartaFacade contact={date.contact} />
    case 'menu':
      if (meniuPdf) return <MeniuLinkPdf href={meniuPdf} />
      return meniu.length ? <MeniuRestaurant categorii={meniu} /> : null
    case 'faq':
      return <Faq date={date} />
    case 'closing':
      return <Inchidere date={date} />
    default:
      return null
  }
}
