/* ============================================================
   lib/whatsapp.ts — un singur loc care construiește cererea de rezervare.

   Locația n-are motor de rezervări (`date/10-rezervari-si-plati.md`:
   „Tip: formular"), deci canalul real e WhatsApp. Butonul „Verifică
   disponibilitatea" deschide întâi un calendar (T64) și abia apoi trimite
   în conversație — cu perioada, numărul de oaspeți și camera deja scrise.

   Mesajul NU spune numele pensiunii: omul scrie pe numărul pensiunii, deci
   gazda știe unde e. Ce nu știe e ce cameră, ce perioadă și câți oameni —
   exact ce pune mesajul.
   ============================================================ */

import type { SiteData } from '@/content/types'

export type CerereRezervare = {
  /** Numele camerei sau al ofertei. Lipsește pe prima pagină. */
  subiect?: string
  /** `YYYY-MM-DD`, așa cum le ține calendarul. */
  checkIn?: string
  checkOut?: string
  persoane?: number
}

const LUNI = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
]

/** `2026-08-12` → `12 august 2026`. Fără `Date`, ca să nu intre fusul orar. */
export function dataLizibila(iso: string): string {
  const [a, l, z] = iso.split('-').map(Number)
  if (!a || !l || !z) return iso
  return `${z} ${LUNI[l - 1]} ${a}`
}

/** Nopțile dintre două date ISO. Zero sau negativ → `undefined`. */
export function nopti(checkIn: string, checkOut: string): number | undefined {
  const a = Date.parse(`${checkIn}T00:00:00Z`)
  const b = Date.parse(`${checkOut}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return undefined
  const n = Math.round((b - a) / 86400000)
  return n > 0 ? n : undefined
}

/**
 * Mesajul precompletat. Rămâne editabil în WhatsApp — e o schiță pe care
 * omul o poate completa, nu un formular trimis.
 *
 * Fără date alese (JavaScript oprit, deci fără calendar) rămâne întrebarea
 * scurtă: tot e mai mult decât un „bună ziua" gol.
 */
export function mesajRezervare(c: CerereRezervare = {}): string {
  const randuri = ['Bună ziua! Aș vrea să verific disponibilitatea.']

  if (c.subiect) randuri.push(`Camera: ${c.subiect}`)
  if (c.checkIn) randuri.push(`Sosire: ${dataLizibila(c.checkIn)}`)
  if (c.checkOut) {
    const n = c.checkIn ? nopti(c.checkIn, c.checkOut) : undefined
    randuri.push(`Plecare: ${dataLizibila(c.checkOut)}${n ? ` (${n} ${n === 1 ? 'noapte' : 'nopți'})` : ''}`)
  }
  if (c.persoane) randuri.push(`Oaspeți: ${c.persoane}`)

  return randuri.join('\n')
}

/**
 * Linkul către conversație. `undefined` dacă locația n-are WhatsApp —
 * apelantul cade atunci pe telefon (REGULI.md 3: nu inventăm o cale).
 */
export function urlWhatsApp(contact: SiteData['contact'], c: CerereRezervare = {}): string | undefined {
  if (!contact.whatsapp) return undefined
  return `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mesajRezervare(c))}`
}

/**
 * Linkul pe care îl primește un buton de rezervare, cu tot cu căderile
 * elegante: WhatsApp → telefon apelabil → ancora `#rezervare`.
 *
 * Ăsta e și `href`-ul scris în HTML, deci butonul funcționează și fără
 * JavaScript — doar că fără perioada aleasă în calendar.
 */
export function linkRezervare(date: SiteData, subiect?: string): string {
  return urlWhatsApp(date.contact, { subiect }) ?? date.contact.phoneHref ?? '#rezervare'
}

/** `true` pentru linkurile care ies din site (deci vor `target`/`rel`). */
export function esteExtern(href: string): boolean {
  return href.startsWith('https://wa.me/')
}
