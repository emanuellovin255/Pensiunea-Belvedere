import type { Metadata } from 'next'

import { type Limba } from '@/lib/i18n/limbi'
import { siteCurent } from '@/lib/site'

/**
 * Politica de confidențialitate (T11). Descrie FLUXUL REAL al acestui motor,
 * nu un text generic: formularul trimite EMAIL prin Resend, nu stochează în
 * bază de date, nu scrie în Google Sheets. Dacă se activează plăți (T13),
 * pagina se actualizează (apare procesatorul și stocarea). Datele firmei vin
 * din `date/12-legal-firma.md`, nu sunt scrise în cod.
 */
export const metadata: Metadata = {
  title: 'Politica de confidențialitate',
  description: 'Ce date colectăm prin formularul de pe site, unde ajung, cât le păstrăm și ce drepturi ai.',
}

export default async function Politica({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const { date } = siteCurent(limba as Limba)
  const { legal, contact, brand } = date
  const operator = legal.company || brand.name

  return (
    <>
      <h1>Politica de confidențialitate</h1>
      <p className="legal-actualizat">Ultima actualizare: 5 august 2026</p>

      <h2>Cine este operatorul</h2>
      <p>
        {operator} este operatorul datelor cu caracter personal colectate prin acest site.
        {legal.registration ? ` ${legal.registration}.` : ''}
        {contact.phone ? ` Telefon: ${contact.phone}.` : ''}
        {contact.email ? ` E-mail: ${contact.email}.` : ''}
      </p>

      <h2>Ce date colectăm</h2>
      <p>Prin formularul de contact colectăm doar ce completezi tu:</p>
      <ul>
        <li>numele pe care îl scrii;</li>
        <li>numărul de telefon și/sau adresa de e-mail;</li>
        <li>perioada dorită (sosire, plecare) și numărul de persoane, dacă le completezi;</li>
        <li>mesajul scris de tine.</li>
      </ul>
      <p>
        Nu cerem CNP, serie și număr de act de identitate, date medicale sau date bancare. Nu
        folosim formulare care colectează date fără să le vezi.
      </p>

      <h2>De ce le colectăm</h2>
      <p>
        Ca să te putem contacta și să răspundem la cererea ta de cazare. Temeiul legal este
        consimțământul tău, exprimat prin bifarea căsuței din formular, împreună cu demersurile
        precontractuale făcute la cererea ta (art. 6 alin. 1 lit. a și b din Regulamentul general
        privind protecția datelor).
      </p>

      <h2>Unde ajung, exact</h2>
      <p>
        Când trimiți formularul, datele completate ajung într-un <strong>e-mail</strong> către
        adresa locației, prin serviciul de trimitere Resend (Resend, Inc.). Dacă ai lăsat un e-mail,
        primești și tu o confirmare la aceeași adresă. Nu stocăm cererea într-o bază de date și nu o
        scriem în niciun tabel — după trimiterea e-mailului, datele nu mai sunt reținute de site.
      </p>
      <p>
        Pentru a bloca trimiterile automate, formularul folosește Cloudflare Turnstile (Cloudflare,
        Inc.), o verificare anti-spam care nu îți cere să rezolvi nimic. Site-ul este găzduit de
        Vercel Inc.; jurnalele tehnice ale găzduirii rețin temporar adresa IP a cererii, strict ca
        protecție împotriva abuzului, iar datele pe care le completezi în formular nu apar în aceste
        jurnale. Nu vindem, nu închiriem și nu schimbăm datele tale cu nimeni.
      </p>

      <h2>Cookie-uri și măsurare</h2>
      <p>
        Detaliile despre cookie-uri sunt pe pagina{' '}
        <a href={limba === 'en' ? '/en/politica-cookies' : '/politica-cookies'}>Politica de cookies</a>.
        Pe scurt: folosim doar stocare strict necesară funcționării site-ului, iar Google Analytics
        se încarcă <strong>numai după</strong> ce accepți categoria „analitice" în bannerul de
        consimțământ. Înainte de accept nu pleacă niciun request către servere de urmărire.
      </p>

      <h2>Cât le păstrăm</h2>
      <p>
        Cererile primite prin e-mail se păstrează în căsuța locației cel mult 12 luni de la ultimul
        contact, dacă nu devii oaspete. Dacă rezervarea se realizează, se aplică termenele legale de
        păstrare a documentelor.
      </p>

      <h2>Ce drepturi ai</h2>
      <p>
        Ai dreptul de acces, de rectificare, de ștergere, de restricționare a prelucrării, de
        portabilitate și de opoziție, precum și dreptul de a-ți retrage oricând consimțământul, fără
        să afecteze prelucrarea de dinainte. Îți poți exercita oricare dintre ele{' '}
        {contact.phone ? `sunând la ${contact.phone}` : ''}
        {contact.email ? ` sau scriind la ${contact.email}` : ''}. Răspundem în cel mult 30 de zile.
      </p>
      <p>
        Ai, de asemenea, dreptul de a depune plângere la Autoritatea Națională de Supraveghere a
        Prelucrării Datelor cu Caracter Personal (
        <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
          dataprotection.ro
        </a>
        ).
      </p>

      <h2>Minori</h2>
      <p>
        Site-ul nu se adresează persoanelor sub 16 ani și nu colectăm cu bună știință date de la
        acestea.
      </p>

      <h2>Modificări</h2>
      <p>
        Dacă schimbăm felul în care prelucrăm datele — de exemplu la activarea plăților online —
        actualizăm această pagină și data de mai sus.
      </p>
    </>
  )
}
