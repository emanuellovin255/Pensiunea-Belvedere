import type { Metadata } from 'next'

import { esteLimba, type Limba } from '@/lib/i18n/limbi'

/**
 * Politica de cookies (T11). Descrie exact ce se stochează, cine îl pune și cât
 * trăiește — pe fluxul REAL al motorului: consimțământ ținut local, Analytics
 * doar după accept, harta Google încărcată odată cu pagina (T62). Textul de
 * mai jos trebuie să descrie fluxul REAL — dacă harta se schimbă, se schimbă
 * și paragraful, altfel politica devine o declarație falsă.
 *
 * BILINGV (T69): proza legală nu vine din `date/`, e a motorului, deci stă aici
 * în ambele limbi — același tipar ca `lib/i18n/etichete.ts`. Varianta engleză e
 * o traducere, nu un text nou: dacă se schimbă un flux, se schimbă AMÂNDOUĂ.
 */
const META: Record<Limba, Metadata> = {
  ro: {
    title: 'Politica de cookies',
    description: 'Ce cookie-uri și stocare locală folosește site-ul, cine le pune și cât trăiesc.',
  },
  en: {
    title: 'Cookie policy',
    description: 'Which cookies and local storage this site uses, who sets them and how long they last.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ limba: string }>
}): Promise<Metadata> {
  const { limba } = await params
  return META[esteLimba(limba) ? limba : 'ro']
}

/**
 * Titlul stă AICI, nu în cele două variante de mai jos: `npm run verifica`
 * numără elementele `<h1>` din fișier, iar două titluri într-un `page.tsx`
 * bilingv arată exact ca greșeala pe care o caută. Se randează o dată.
 */
const TITLU: Record<Limba, { h1: string; actualizat: string }> = {
  ro: { h1: 'Politica de cookies', actualizat: 'Ultima actualizare: 5 august 2026' },
  en: { h1: 'Cookie policy', actualizat: 'Last updated: 5 August 2026' },
}

function Ro() {
  return (
    <>
      <p>
        Un cookie (sau o valoare de stocare locală) este un mic fișier pe care site-ul îl salvează în
        browserul tău. Le folosim la minimum și îți cerem acordul înainte de orice nu e strict
        necesar. Nimic din ce e opțional nu se încarcă înainte să alegi în banner.
      </p>

      <h2>Strict necesare</h2>
      <p>
        Fac site-ul să funcționeze și nu au nevoie de consimțământ. Alegerea ta din bannerul de
        cookies se salvează local (localStorage), ca să nu te întrebăm la fiecare pagină. Tot local
        se reține și limba în care ai ales să vezi site-ul. Rămân pe dispozitivul tău, nu ajung la
        noi, și le poți șterge oricând curățând datele site-ului.
      </p>

      <h2>Analitice (opțional)</h2>
      <p>
        Dacă accepți categoria „analitice", încărcăm Google Analytics (Google Ireland Ltd.), ca să
        înțelegem cum e folosit site-ul — ce pagini se văd, de pe ce fel de dispozitiv. Adresa IP
        este anonimizată. Aceste cookie-uri sunt puse de Google și pot trăi până la 2 ani. Google
        Analytics nu pornește niciun request înainte de acceptul tău.
      </p>

      <h2>Marketing (opțional)</h2>
      <p>
        Categoria există în banner pentru corectitudine, dar implicit nu e configurat niciun pixel
        de reclamă pe acest site. Dacă se adaugă vreodată, apare aici, descris, și tot după accept.
      </p>

      <h2>Harta</h2>
      <p>
        Pagina de contact conține o hartă Google încorporată, care se încarcă odată cu pagina.
        Google poate seta cookie-uri și poate primi adresa ta IP în acest proces. Dacă nu vrei
        asta, adresa exactă e scrisă și ca text deasupra hărții — o poți folosi în orice altă
        aplicație de navigație.
      </p>

      <h2>Cum îți schimbi alegerea</h2>
      <p>
        Oricând, din butonul „Setări cookies" din subsolul site-ului. Poți accepta, refuza sau alege
        pe categorii. Refuzul e la fel de simplu ca acceptul — un singur click.
      </p>
    </>
  )
}

function En() {
  return (
    <>
      <p>
        A cookie (or a local storage value) is a small file the site saves in your browser. We use
        them as little as possible and we ask for your consent before anything that is not strictly
        necessary. Nothing optional loads before you choose in the banner.
      </p>

      <h2>Strictly necessary</h2>
      <p>
        These make the site work and need no consent. Your choice in the cookie banner is saved
        locally (localStorage) so we do not have to ask you on every page. The language you chose for
        the site is stored the same way. Both stay on your device, never reach us, and you can delete
        them at any time by clearing the site data.
      </p>

      <h2>Analytics (optional)</h2>
      <p>
        If you accept the “analytics” category, we load Google Analytics (Google Ireland Ltd.) so we
        can understand how the site is used — which pages are viewed, from what kind of device. The
        IP address is anonymised. These cookies are set by Google and can last up to 2 years. Google
        Analytics sends no request whatsoever before you accept.
      </p>

      <h2>Marketing (optional)</h2>
      <p>
        The category exists in the banner for the sake of completeness, but no advertising pixel is
        configured on this site by default. If one is ever added, it will be described here, and it
        will still load only after you accept.
      </p>

      <h2>The map</h2>
      <p>
        The contact page contains an embedded Google map, which loads together with the page. Google
        may set cookies and may receive your IP address in the process. If you would rather avoid
        that, the exact address is also written as text above the map — you can use it in any other
        navigation app.
      </p>

      <h2>How to change your choice</h2>
      <p>
        At any time, from the “Cookie settings” button in the site footer. You can accept, refuse or
        choose by category. Refusing is exactly as easy as accepting — a single click.
      </p>
    </>
  )
}

export default async function PoliticaCookies({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const l: Limba = limba === 'en' ? 'en' : 'ro'

  return (
    <>
      <h1>{TITLU[l].h1}</h1>
      <p className="legal-actualizat">{TITLU[l].actualizat}</p>
      {l === 'en' ? <En /> : <Ro />}
    </>
  )
}
