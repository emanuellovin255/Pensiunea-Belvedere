'use client'

import { useEffect } from 'react'

import { initDepthTilt } from '@/lib/depth'
import { initHeaderScroll } from '@/lib/reveal'

/**
 * Montează stratul de mișcare O SINGURĂ DATĂ, din layout-ul șablonului.
 *
 * T02 e explicit aici: `depth.js` era un IIFE atașat pe `document`.
 * În Next.js NU devine un listener per componentă — ar însemna zeci de
 * listenere pentru un singur efect. Devine asta: un singur montaj, două
 * inițializări, două funcții de curățare.
 *
 * REVEAL-UL LA SCROLL E OPRIT, la cererea clientului: conținutul nu mai
 * „vine" nicăieri când derulezi, e pur și simplu acolo. Consecința care
 * conta cel mai mult: pe Safari, unde `animation-timeline: view()` nu
 * există, secțiunile mai înalte decât ecranul (oferte, camere) nu
 * atingeau niciodată pragul observerului și rămâneau la `opacity: 0` —
 * adică goale. Fără reveal, problema dispare din rădăcină.
 *
 * Nu randează nimic. Dacă nu se montează deloc (JavaScript oprit),
 * pagina rămâne integral vizibilă.
 */
export function Miscare() {
  useEffect(() => {
    const opresteTilt = initDepthTilt()
    const opresteAntet = initHeaderScroll()
    return () => {
      opresteTilt()
      opresteAntet()
    }
  }, [])

  return null
}
