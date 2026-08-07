'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { caleaPublica, ETICHETE, LIMBA_IMPLICITA, LIMBI, type Limba } from '@/lib/i18n/limbi'
import { limbaRetinuta, retineLimba } from '@/lib/i18n/preferinta'
import { traduSegment, traduSegmentIntern } from '@/lib/i18n/rute'

/* ============================================================
   AlegeLimba.tsx — întrebarea de primă vizită: română sau engleză.

   DE CE ÎNTREBĂM ÎN LOC SĂ REDIRECȚIONĂM (T08)
   --------------------------------------------
   `preferinta.ts` spune explicit că NU redirecționăm automat după
   `localStorage` sau după `Accept-Language`: un redirect ar ascunde
   `/en` de crawlere și ar muta omul de sub degete. Regula rămâne.

   Dar între „redirect automat" și „nimic" există varianta asta: îl
   întrebăm o dată, alege el, ținem minte. Nimeni nu e mutat fără să
   apese.

   DE CE NU STRICĂ SEO-UL
   ----------------------
   Se randează DOAR după montare (`useEffect`), deci nu apare niciodată
   în HTML-ul livrat. Un crawler nu-l vede: nici ca interstițial
   intruziv, nici ca CLS, nici ca text concurent. Pentru vizitator e un
   dialog; pentru Google, pagina arată exact ca înainte.

   Fără JavaScript nu apare deloc — și nu trebuie: comutatorul din antet
   e format din linkuri reale, care funcționează oricum.
   ============================================================ */

const TEXTE: Record<Limba, { titlu: string; explicatie: string }> = {
  ro: {
    titlu: 'Alege limba',
    explicatie: 'Poți schimba oricând, din colțul de sus al paginii.',
  },
  en: {
    titlu: 'Choose your language',
    explicatie: 'You can change it any time, from the top of the page.',
  },
}

export function AlegeLimba({ limba = LIMBA_IMPLICITA }: { limba?: Limba }) {
  const [vizibil, setVizibil] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const primulButon = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Prima vizită = nicio alegere salvată. Atât.
    if (limbaRetinuta() === null) setVizibil(true)
  }, [])

  useEffect(() => {
    if (!vizibil) return
    primulButon.current?.focus()
    const laTasta = (e: KeyboardEvent) => {
      // Escape = „rămân unde sunt", dar tot e o alegere: o reținem, ca
      // dialogul să nu reapară la fiecare pagină.
      if (e.key === 'Escape') alege(limba)
    }
    document.addEventListener('keydown', laTasta)
    return () => document.removeEventListener('keydown', laTasta)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vizibil, limba])

  if (!vizibil) return null

  function alege(aleasa: Limba) {
    retineLimba(aleasa)
    setVizibil(false)
    if (aleasa === limba) return

    // Calea curentă, fără prefix și cu segmentul adus înapoi la numele
    // real al rutei, ca s-o putem retraduce în limba aleasă. `/en/rooms`
    // → `/camere` → `/rooms`, apoi prefixul limbii noi.
    const faraPrefix = LIMBI.reduce(
      (p, l) => (p === `/${l}` || p.startsWith(`/${l}/`) ? p.slice(`/${l}`.length) || '/' : p),
      pathname || '/',
    )
    const interna = traduSegmentIntern(faraPrefix, limba)
    router.push(caleaPublica(aleasa, traduSegment(interna, aleasa)))
  }

  const t = TEXTE[limba] ?? TEXTE.ro

  return (
    <div className="alege-limba" role="dialog" aria-modal="true" aria-labelledby="alege-limba-titlu">
      <div className="alege-limba-card">
        <h2 id="alege-limba-titlu">{t.titlu}</h2>
        <div className="alege-limba-optiuni">
          {LIMBI.map((l, i) => (
            <button
              key={l}
              ref={i === 0 ? primulButon : undefined}
              type="button"
              className={l === limba ? 'btn btn-primary' : 'btn btn-ghost'}
              lang={l}
              onClick={() => alege(l)}
            >
              {ETICHETE[l]}
            </button>
          ))}
        </div>
        <p className="alege-limba-nota">{t.explicatie}</p>
      </div>
    </div>
  )
}
