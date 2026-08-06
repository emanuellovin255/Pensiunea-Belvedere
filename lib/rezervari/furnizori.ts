/* ============================================================
   lib/rezervari/furnizori.ts — formatul de parametri al fiecărui motor.

   Deep-link înseamnă să trimiți vizitatorul direct în pasul 2 al rezervării,
   cu datele deja completate. Fiecare furnizor își numește parametrii altfel;
   maparea de aici e EXPLICITĂ, cu o notă despre sursa formatului (documentație
   sau URL observat pe un site real). Ce nu e aici cade pe iframe sau formular —
   nu inventăm un format de parametri pe care nu-l știm (REGULI.md 3).

   Intrarea comună: date `YYYY-MM-DD` (exact ce dă `<input type="date">`) și un
   număr de persoane extras din opțiunea aleasă („2 persoane" → 2).
   ============================================================ */

export type ParamRezervare = {
  checkIn: string
  checkOut: string
  adulti: number
}

/** Construiește query string-ul pentru un furnizor, sau `null` dacă nu-l știm. */
type Constructor = (p: ParamRezervare) => Record<string, string>

/**
 * Fiecare intrare = cum își numește furnizorul parametrii. Cheile sunt
 * normalizate (litere mici). Formatele sunt cele documentate / observate;
 * dacă un furnizor și le schimbă, se editează aici, într-un singur loc.
 */
export const FURNIZORI: Record<string, Constructor> = {
  // Previo (booking.previo.app) — deep-link cu date ISO și număr de persoane.
  // Observat pe widget-urile Previo ale pensiunilor RO.
  previo: ({ checkIn, checkOut, adulti }) => ({
    dateFrom: checkIn,
    dateTo: checkOut,
    persons: String(adulti),
  }),

  // SiteMinder / The Booking Button — checkin/checkout + adults.
  // Documentat în deep-link-urile TheBookingButton.
  siteminder: ({ checkIn, checkOut, adulti }) => ({
    checkin: checkIn,
    checkout: checkOut,
    adults: String(adulti),
  }),

  // Cloudbeds (hotels.cloudbeds.com) — checkin/checkout + adults.
  cloudbeds: ({ checkIn, checkOut, adulti }) => ({
    checkin: checkIn,
    checkout: checkOut,
    adults: String(adulti),
  }),

  // Booking.com — foarte frecvent la cabane care n-au motor propriu.
  // Parametrii din URL-urile de căutare Booking.com. Alias „booking.com"
  // fiindcă exact așa se scrie în date/10 („Sistem: booking.com").
  booking: ({ checkIn, checkOut, adulti }) => ({
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(adulti),
  }),
  'booking.com': ({ checkIn, checkOut, adulti }) => ({
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(adulti),
  }),
}

/** `true` dacă știm formatul de deep-link al furnizorului. */
export function areDeepLink(furnizor?: string): boolean {
  return Boolean(furnizor && FURNIZORI[furnizor.toLowerCase()])
}

/** Extrage numărul de adulți dintr-o opțiune de tip „2 persoane" / „2 adults". Minim 1. */
export function numarPersoane(optiune: string): number {
  const m = optiune.match(/\d+/)
  const n = m ? parseInt(m[0], 10) : 1
  return Number.isFinite(n) && n > 0 ? n : 1
}
