'use client'

import { useEffect } from 'react'

import { initDepthTilt } from '@/lib/depth'
import { initHeaderScroll, initReveal } from '@/lib/reveal'

/**
 * Montează stratul de mișcare O SINGURĂ DATĂ, din layout-ul șablonului.
 *
 * T02 e explicit aici: `depth.js` era un IIFE atașat pe `document`.
 * În Next.js NU devine un listener per componentă — ar însemna zeci de
 * listenere pentru un singur efect. Devine asta: un singur montaj, trei
 * inițializări, trei funcții de curățare.
 *
 * Nu randează nimic. Dacă nu se montează deloc (JavaScript oprit),
 * pagina rămâne integral vizibilă — motion.css se ocupă, prin
 * `html:not(.js-reveal)`.
 */
export function Miscare() {
  useEffect(() => {
    const opresteTilt = initDepthTilt()
    const opresteReveal = initReveal()
    const opresteAntet = initHeaderScroll()
    return () => {
      opresteTilt()
      opresteReveal()
      opresteAntet()
    }
  }, [])

  return null
}
