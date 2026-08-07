import type { ReactNode } from 'react'

import {
  BandaIncredere,
  Camere,
  Evenimente,
  Facilitati,
  Faq,
  Features,
  Inchidere,
  MeniuRestaurant,
  Oferte,
  Prezentare,
  Recenzii,
} from '.'
import { HartaFacade } from './HartaFacade'
import type { SiteData } from '@/content/types'
import type { MeniuCategorie, MeniuSectiune } from '@/content/meniu'
import { caleaPublica, type Limba } from '@/lib/i18n/limbi'
import { traduSegment } from '@/lib/i18n/rute'

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
  /** Antetul secțiunii de meniu, din `## Secțiune` (07-meniu-restaurant.md). */
  meniuSectiune?: MeniuSectiune
  limba?: Limba
  /**
   * Calea PDF-ului cu meniul (`setari.md` → „Meniu PDF").
   *
   * NU mai schimbă secțiunea de pe prima pagină: de când meniul are pagina
   * lui, linkul PDF trăiește acolo, ca alternativă de descărcat. Câmpul
   * rămâne fiindcă `/meniu` îl folosește.
   */
  meniuPdf?: string
}

export function sectiune(
  id: string,
  { date, meniu, meniuSectiune, limba = 'ro' }: ContextSectiuni,
): ReactNode {
  switch (id) {
    case 'trust':
      return <BandaIncredere date={date} />
    case 'perks':
      return <Facilitati date={date} />
    case 'rooms':
      return <Camere date={date} />
    case 'features':
      return <Features features={date.features} date={date} />
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
    case 'menu': {
      // Pe prima pagină: specialitățile casei, nu meniul întreg (T65).
      // CARE sunt specialitățile o spune clientul, în `## Secțiune` →
      // „Categorii pe prima pagină". Motorul n-are de unde ști că la o
      // pensiune din Deltă vinde peștele — iar „primele categorii din
      // fișier" ar nimeri micul dejun și extra-urile.
      if (!meniu.length) return null
      const alese = meniuSectiune?.evidentiate?.length
        ? meniu.filter((c) => meniuSectiune.evidentiate?.includes(c.nume))
        : meniu.slice(0, 2)
      return (
        <MeniuRestaurant
          categorii={alese.length ? alese : meniu.slice(0, 2)}
          limba={limba}
          sectiune={meniuSectiune}
          limita={3}
          linkComplet={caleaPublica(limba, traduSegment('/meniu', limba))}
        />
      )
    }
    case 'faq':
      return <Faq date={date} />
    case 'closing':
      return <Inchidere date={date} />
    default:
      return null
  }
}
