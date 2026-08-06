import type { Metadata } from 'next'

/**
 * Politica de cookies (T11). Descrie exact ce se stochează, cine îl pune și cât
 * trăiește — pe fluxul REAL al motorului: consimțământ ținut local, Analytics
 * doar după accept, harta Google încărcată abia la click (facade, T06/T12).
 */
export const metadata: Metadata = {
  title: 'Politica de cookies',
  description: 'Ce cookie-uri și stocare locală folosește site-ul, cine le pune și cât trăiesc.',
}

export default function PoliticaCookies() {
  return (
    <>
      <h1>Politica de cookies</h1>
      <p className="legal-actualizat">Ultima actualizare: 5 august 2026</p>

      <p>
        Un cookie (sau o valoare de stocare locală) este un mic fișier pe care site-ul îl salvează în
        browserul tău. Le folosim la minimum și îți cerem acordul înainte de orice nu e strict
        necesar. Nimic din ce e opțional nu se încarcă înainte să alegi în banner.
      </p>

      <h2>Strict necesare</h2>
      <p>
        Fac site-ul să funcționeze și nu au nevoie de consimțământ. Alegerea ta din bannerul de
        cookies se salvează local (localStorage), ca să nu te întrebăm la fiecare pagină. Rămâne pe
        dispozitivul tău, nu ajunge la noi, și o poți șterge oricând curățând datele site-ului.
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
        Harta Google se afișează întâi ca imagine statică. Harta reală, cu cookie-urile Google, se
        încarcă doar dacă apeși pe ea — deci nu se transmite nimic către Google fără o acțiune
        explicită a ta.
      </p>

      <h2>Cum îți schimbi alegerea</h2>
      <p>
        Oricând, din butonul „Setări cookies" din subsolul site-ului. Poți accepta, refuza sau alege
        pe categorii. Refuzul e la fel de simplu ca acceptul — un singur click.
      </p>
    </>
  )
}
