import type { Metadata } from 'next'

import { esteLimba, type Limba } from '@/lib/i18n/limbi'
import { siteCurent } from '@/lib/site'

/**
 * Politica de confidențialitate (T11). Descrie FLUXUL REAL al acestui motor,
 * nu un text generic: formularul trimite EMAIL prin Resend, nu stochează în
 * bază de date, nu scrie în Google Sheets. Dacă se activează plăți (T13),
 * pagina se actualizează (apare procesatorul și stocarea). Datele firmei vin
 * din `date/12-legal-firma.md`, nu sunt scrise în cod.
 *
 * BILINGV (T69): vezi comentariul din `politica-cookies/page.tsx`. Trimiterile
 * la GDPR și la ANSPDCP rămân aceleași în ambele limbi — e aceeași lege.
 */
const META: Record<Limba, Metadata> = {
  ro: {
    title: 'Politica de confidențialitate',
    description: 'Ce date colectăm prin formularul de pe site, unde ajung, cât le păstrăm și ce drepturi ai.',
  },
  en: {
    title: 'Privacy policy',
    description: 'What data the form on this site collects, where it goes, how long we keep it and what rights you have.',
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

interface Operator {
  operator: string
  inregistrare?: string
  telefon?: string
  email?: string
  caleCookies: string
}

/** Titlul se randează o dată, în export — vezi `politica-cookies/page.tsx`. */
const TITLU: Record<Limba, { h1: string; actualizat: string }> = {
  ro: { h1: 'Politica de confidențialitate', actualizat: 'Ultima actualizare: 5 august 2026' },
  en: { h1: 'Privacy policy', actualizat: 'Last updated: 5 August 2026' },
}

function Ro({ operator, inregistrare, telefon, email, caleCookies }: Operator) {
  return (
    <>
      <h2>Cine este operatorul</h2>
      <p>
        {operator} este operatorul datelor cu caracter personal colectate prin acest site.
        {inregistrare ? ` ${inregistrare}.` : ''}
        {telefon ? ` Telefon: ${telefon}.` : ''}
        {email ? ` E-mail: ${email}.` : ''}
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
        Detaliile despre cookie-uri sunt pe pagina <a href={caleCookies}>Politica de cookies</a>. Pe
        scurt: folosim doar stocare strict necesară funcționării site-ului, iar Google Analytics se
        încarcă <strong>numai după</strong> ce accepți categoria „analitice" în bannerul de
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
        {telefon ? `sunând la ${telefon}` : ''}
        {email ? ` sau scriind la ${email}` : ''}. Răspundem în cel mult 30 de zile.
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

function En({ operator, inregistrare, telefon, email, caleCookies }: Operator) {
  return (
    <>
      <h2>Who the controller is</h2>
      <p>
        {operator} is the controller of the personal data collected through this site.
        {inregistrare ? ` ${inregistrare}.` : ''}
        {telefon ? ` Phone: ${telefon}.` : ''}
        {email ? ` E-mail: ${email}.` : ''}
      </p>

      <h2>What data we collect</h2>
      <p>Through the contact form we collect only what you fill in yourself:</p>
      <ul>
        <li>the name you write;</li>
        <li>your phone number and/or e-mail address;</li>
        <li>the dates you want (arrival, departure) and the number of guests, if you fill them in;</li>
        <li>the message you write.</li>
      </ul>
      <p>
        We do not ask for a national ID number, identity document details, medical data or bank
        details. We do not use forms that collect data you cannot see.
      </p>

      <h2>Why we collect it</h2>
      <p>
        So that we can contact you and answer your accommodation request. The legal basis is your
        consent, given by ticking the box in the form, together with the pre-contractual steps taken
        at your request (Article 6(1)(a) and (b) of the General Data Protection Regulation).
      </p>

      <h2>Where it goes, exactly</h2>
      <p>
        When you submit the form, what you filled in goes into an <strong>e-mail</strong> to the
        guesthouse&apos;s address, through the sending service Resend (Resend, Inc.). If you left an
        e-mail address, you receive a confirmation at the same address. We do not store the request
        in a database and we do not write it into any spreadsheet — once the e-mail is sent, the site
        retains nothing.
      </p>
      <p>
        To block automated submissions, the form uses Cloudflare Turnstile (Cloudflare, Inc.), an
        anti-spam check that asks you to solve nothing. The site is hosted by Vercel Inc.; the
        hosting&apos;s technical logs briefly retain the IP address of the request, strictly as
        protection against abuse, and the data you type into the form does not appear in those logs.
        We do not sell, rent or exchange your data with anyone.
      </p>

      <h2>Cookies and measurement</h2>
      <p>
        The details about cookies are on the <a href={caleCookies}>Cookie policy</a> page. In short:
        we use only storage that is strictly necessary for the site to work, and Google Analytics
        loads <strong>only after</strong> you accept the “analytics” category in the consent banner.
        Before you accept, no request leaves for any tracking server.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Requests received by e-mail stay in the guesthouse&apos;s mailbox for at most 12 months from
        the last contact, if you do not become a guest. If the booking goes ahead, the legal document
        retention periods apply.
      </p>

      <h2>What rights you have</h2>
      <p>
        You have the right of access, rectification, erasure, restriction of processing, portability
        and objection, as well as the right to withdraw your consent at any time, without affecting
        the processing carried out before. You can exercise any of them{' '}
        {telefon ? `by calling ${telefon}` : ''}
        {email ? ` or by writing to ${email}` : ''}. We answer within 30 days at the latest.
      </p>
      <p>
        You also have the right to lodge a complaint with the Romanian National Supervisory Authority
        for Personal Data Processing (
        <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
          dataprotection.ro
        </a>
        ).
      </p>

      <h2>Minors</h2>
      <p>
        The site is not addressed to people under 16 and we do not knowingly collect data from them.
      </p>

      <h2>Changes</h2>
      <p>
        If we change the way we process data — for example when online payments are switched on — we
        update this page and the date above.
      </p>
    </>
  )
}

export default async function Politica({ params }: { params: Promise<{ limba: string }> }) {
  const { limba } = await params
  const { date } = siteCurent(esteLimba(limba) ? limba : 'ro')
  const { legal, contact, brand } = date
  const props: Operator = {
    operator: legal.company || brand.name,
    inregistrare: legal.registration,
    telefon: contact.phone,
    email: contact.email,
    caleCookies: limba === 'en' ? '/en/politica-cookies' : '/politica-cookies',
  }
  const l: Limba = limba === 'en' ? 'en' : 'ro'

  return (
    <>
      <h1>{TITLU[l].h1}</h1>
      <p className="legal-actualizat">{TITLU[l].actualizat}</p>
      {l === 'en' ? <En {...props} /> : <Ro {...props} />}
    </>
  )
}
