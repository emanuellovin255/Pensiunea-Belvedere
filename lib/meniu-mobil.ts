/* ============================================================
   meniu-mobil.ts — deschide și închide navigația sub 1024px.

   Butonul „burger" din antet exista în HTML de la început, dar nimic
   nu-l asculta: pe telefon apăsai și nu se întâmpla nimic, iar linkurile
   din `.nav-links` (ascunse de base.css sub 1024px) erau de neatins.

   Mecanismul e o singură clasă pe antet — `.is-menu-open` — plus
   `aria-expanded` pe buton. Restul e CSS. Fără JavaScript, clasa nu
   ajunge niciodată acolo: butonul e ascuns de la bun început în
   `base.css` și apare doar unde îl poate folosi cineva, iar linkurile
   rămân în HTML pentru crawlere.

   Niciun listener pe `scroll` (REGULI.md 11).
   ============================================================ */

/** Lățimea sub care `.nav-links` e ascunsă în base.css. Peste ea, meniul
 *  deschis n-are sens și se închide singur. */
const PRAG = 1024

/** Pornește meniul mobil. Întoarce funcția care îl oprește. */
export function initMeniuMobil(): () => void {
  if (typeof window === 'undefined') return () => {}

  const buton = document.querySelector<HTMLButtonElement>('[data-burger]')
  const antet = document.querySelector<HTMLElement>('[data-antet]')
  if (!buton || !antet) return () => {}

  const meniu = document.getElementById(buton.getAttribute('aria-controls') ?? '')
  if (!meniu) return () => {}

  const seteaza = (deschis: boolean) => {
    antet.classList.toggle('is-menu-open', deschis)
    buton.setAttribute('aria-expanded', String(deschis))
  }

  const laButon = (e: MouseEvent) => {
    e.preventDefault()
    seteaza(buton.getAttribute('aria-expanded') !== 'true')
  }

  // Un click pe un link navighează; pe paginile care se schimbă fără
  // reîncărcare (App Router), antetul rămâne montat, deci panoul ar
  // rămâne deschis peste pagina nouă dacă nu l-am închide aici.
  const laMeniu = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) seteaza(false)
  }

  // Click în afara antetului: la fel ca Escape, doar cu mouse-ul.
  const laDocument = (e: MouseEvent) => {
    if (!antet.contains(e.target as Node)) seteaza(false)
  }

  const laTasta = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    if (buton.getAttribute('aria-expanded') !== 'true') return
    seteaza(false)
    buton.focus()
  }

  // Rotirea telefonului sau o fereastră lărgită peste prag: `.nav-links`
  // redevine bara orizontală, iar panoul deschis ar fi rămas o dublură.
  const lat = window.matchMedia(`(min-width: ${PRAG + 1}px)`)
  const laLatime = () => {
    if (lat.matches) seteaza(false)
  }

  buton.addEventListener('click', laButon)
  meniu.addEventListener('click', laMeniu)
  document.addEventListener('click', laDocument)
  document.addEventListener('keydown', laTasta)
  lat.addEventListener('change', laLatime)

  return () => {
    buton.removeEventListener('click', laButon)
    meniu.removeEventListener('click', laMeniu)
    document.removeEventListener('click', laDocument)
    document.removeEventListener('keydown', laTasta)
    lat.removeEventListener('change', laLatime)
    seteaza(false)
  }
}
