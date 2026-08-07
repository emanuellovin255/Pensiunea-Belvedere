/* ============================================================
   lib/whatsapp.ts — un singur loc care construiește linkul de rezervare.

   Locația n-are motor de rezervări (`date/10-rezervari-si-plati.md`:
   „Tip: formular"), deci canalul real e WhatsApp. Fiecare buton
   „Verifică disponibilitatea" din site trebuie să deschidă conversația
   cu mesajul deja scris — și, acolo unde butonul stă lângă o cameră sau
   o ofertă, mesajul trebuie să spună DESPRE CE e vorba. Altfel gazda
   primește zece mesaje identice și tot trebuie să întrebe „la ce cameră?".

   Un singur helper, folosit din toate componentele, ca formularea să nu
   diverge la a treia copiere.
   ============================================================ */

import type { SiteData } from '@/content/types'

/**
 * Mesajul precompletat. `subiect` e numele camerei sau al ofertei; fără
 * el rămâne întrebarea generală de pe prima pagină.
 *
 * Rămâne editabil în WhatsApp — e o schiță, nu un formular trimis.
 */
export function mesajRezervare(numeLocatie: string, subiect?: string): string {
  if (subiect) {
    return `Bună ziua! Aș vrea să știu dacă aveți liber la „${subiect}” (${numeLocatie}). Perioada: `
  }
  return `Bună ziua! Aș vrea să știu dacă aveți camere libere la ${numeLocatie}. Perioada: `
}

/**
 * Linkul pe care îl primește un buton de rezervare.
 *
 * Ordinea de cădere e cea din REGULI.md 3 — nu inventăm o cale care nu
 * există: WhatsApp → telefon apelabil → ancora `#rezervare` (unde stă
 * blocul de contact). Ultima variantă rămâne validă și fără telefon.
 */
export function linkRezervare(date: SiteData, subiect?: string): string {
  const { contact, brand } = date

  if (contact.whatsapp) {
    const text = encodeURIComponent(mesajRezervare(brand.name, subiect))
    return `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}?text=${text}`
  }
  if (contact.phoneHref) return contact.phoneHref
  return '#rezervare'
}

/** `true` când linkul iese din site (deci vrea `target`/`rel`). */
export function esteExtern(href: string): boolean {
  return href.startsWith('https://wa.me/')
}
