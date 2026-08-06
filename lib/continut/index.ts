/* ============================================================
   continut/index.ts — de la fișiere `.md` la un `SiteData` validat.

   Ăsta e task-ul care face sistemul „ușor de editat": un om fără
   cunoștințe tehnice editează text în română, iar din el se generează
   site-ul, cu conținutul în HTML (T05).

   Trei principii care se văd peste tot mai jos:

   1. CÂMP NECOMPLETAT = CÂMP ABSENT, niciodată o valoare implicită
      inventată (REGULI.md 3). De asta `text()` întoarce `undefined`
      pentru `''`: o componentă nu trebuie să poată randa un titlu urmat
      de gol.

   2. EROARE UTILĂ. Nu „unexpected token", ci fișierul, blocul, câmpul
      și ce e de făcut. Destinatarul nu poate citi codul.

   3. SURSA DE ADEVĂR RĂMÂN FIȘIERELE `.md`. `content/site.json` e
      artefact de build, util la debug. Intră în `.gitignore`.
   ============================================================ */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { Cta, Faq, Feature, IconName, Offer, Review, Room, SiteData } from '@/content/types'

import { analizeaza, boolean, lista, numar, slug, sugereaza, text, type Bloc, type Document } from './md'
import { radacinaClientDir } from './radacina'
import { Raport } from './raport'
import { citesteSetari, type Setari } from './setari'

export { Raport } from './raport'
export type { Constatare, Nivel } from './raport'
export { IMPLICIT } from './setari'
export type { Setari } from './setari'
export { radacinaClientDir } from './radacina'

export interface ContinutClient {
  date: SiteData
  setari: Setari
  raport: Raport
  /** Pozele găsite în `poze/`, pentru verificări și pentru T31. */
  poze: string[]
}

/* ------------------------------------------------------------------ */
/* Citire                                                              */
/* ------------------------------------------------------------------ */

interface Sursa {
  fisier: string
  doc: Document
}

function citeste(
  radacina: string,
  fisier: string,
  raport: Raport,
  optiuni: { optional?: boolean } = {},
): Sursa | null {
  const cale = path.join(radacina, fisier)
  if (!existsSync(cale)) {
    // `optional` = pe /en un fișier lipsă înseamnă doar că secțiunea aceea
    // nu apare (T08), nu o problemă de raportat.
    if (!optiuni.optional) {
      raport.avertisment({
        fisier,
        mesaj: 'Fișierul lipsește.',
        solutie: `Copiază-l din clienti/_sablon-client/${fisier} și completează-l.`,
      })
    }
    return null
  }
  return { fisier, doc: analizeaza(readFileSync(cale, 'utf8')) }
}

/** Blocul cu titlul cerut, indiferent de diacritice și de majuscule. */
function bloc(s: Sursa | null, ...nume: string[]): Bloc | undefined {
  if (!s) return undefined
  return s.doc.blocuri.find((b) => {
    const t = b.titlu.toLowerCase()
    return nume.some((n) => t.includes(n.toLowerCase()))
  })
}

/** Blocurile care chiar au conținut — cele goale din șablon nu contează. */
function blocuriCompletate(s: Sursa | null): Bloc[] {
  if (!s) return []
  return s.doc.blocuri.filter(
    (b) => b.titlu.trim() !== '' || b.text.trim() !== '' || [...b.campuri.values()].some(Boolean),
  )
}

function camp(b: Bloc | undefined, cheie: string): string | undefined {
  return b ? text(b.campuri.get(cheie)) : undefined
}

/**
 * Verifică cheile pe care nu le recunoaștem și propune cea mai
 * apropiată. O cheie scrisă greșit și ignorată în tăcere e cel mai
 * enervant fel de bug pentru cineva care nu poate citi codul.
 */
function verificaChei(b: Bloc, cunoscute: readonly string[], fisier: string, raport: Raport) {
  for (const cheie of b.campuri.keys()) {
    if (cunoscute.includes(cheie)) continue
    const s = sugereaza(cheie, cunoscute)
    raport.nota({
      fisier,
      linie: b.linie,
      unde: b.titlu || undefined,
      mesaj: `Nu recunosc câmpul „${cheie}", deci e ignorat.`,
      solutie: s ? `Ai vrut să scrii „${s}"?` : `Câmpurile acceptate aici: ${cunoscute.join(', ')}.`,
    })
  }
}

/* ------------------------------------------------------------------ */
/* Poze                                                                */
/* ------------------------------------------------------------------ */

/**
 * Numele fișierelor din `poze/`.
 *
 * Sursa de adevăr e folderul, citit direct — așa „am pus o poză nouă"
 * funcționează imediat la `npm run dev` și la `verifica`. Dar pe Vercel
 * paginile se randează la cerere (nonce-ul CSP), iar funcția serverless
 * n-are folderul: zeci de MB nu intră într-o funcție ca să-i citim numele.
 * Pentru cazul ăla, `sync-media` scrie la prebuild `content/poze.json`, cu
 * exact aceleași nume. Calea e literală, deci o vede și urmăritorul de
 * fișiere al Next.
 */
function citestePoze(radacina: string): string[] {
  const dir = path.join(radacina, 'poze')
  if (existsSync(dir)) return readdirSync(dir).filter((f) => !f.startsWith('.'))

  const lista = path.resolve(process.cwd(), 'content', 'poze.json')
  if (!existsSync(lista)) return []
  try {
    const nume = JSON.parse(readFileSync(lista, 'utf8'))
    return Array.isArray(nume) ? nume : []
  } catch {
    return []
  }
}

/** Extensiile acceptate pentru fiecare fel de fișier din `poze/`. */
const EXT_IMAGINE = ['.avif', '.webp', '.jpg', '.jpeg', '.png', '.svg', '.gif'] as const
const EXT_VIDEO = ['.mp4', '.webm', '.mov'] as const

/**
 * Traduce numele unui fișier din `poze/` în adresa lui de pe site și
 * verifică întâi că fișierul chiar există și că are extensia potrivită.
 * Mesajul spune CARE fișier și UNDE — exact ce cere criteriul de
 * terminare din T05.
 *
 * `poza()` și clipurile de video (T60) sunt același lucru — aceeași
 * validare de existență, aceeași sugestie când numele diferă doar prin
 * extensie — deci trec toate pe aici; nu scriem a doua funcție identică.
 */
function fisierMedia(
  nume: string | undefined,
  extensii: readonly string[],
  ctx: { fisier: string; unde?: string; linie?: number },
  poze: string[],
  raport: Raport,
): string | undefined {
  const n = text(nume)
  if (!n) return undefined

  if (!poze.includes(n)) {
    // Același fișier cu altă extensie e cea mai frecventă scăpare.
    const fara = n.replace(/\.[^.]+$/, '')
    const alta = poze.find((p) => p.replace(/\.[^.]+$/, '') === fara)
    raport.eroare({
      ...ctx,
      mesaj: `Am găsit „${n}", dar fișierul nu există în poze/.`,
      solutie: alta
        ? `În poze/ există „${alta}". Scrie exact numele ăsta, cu tot cu extensie.`
        : `Pune fișierul în clienti/<nume>/poze/ sau șterge rândul. Numele trebuie scris identic, cu extensie și cu aceleași majuscule.`,
    })
    return undefined
  }

  const ext = (n.match(/\.[^.]+$/)?.[0] ?? '').toLowerCase()
  if (!extensii.includes(ext)) {
    raport.eroare({
      ...ctx,
      mesaj: `„${n}" are extensia „${ext || '(niciuna)'}", care nu se potrivește aici.`,
      solutie: `Aici merg doar: ${extensii.join(', ')}.`,
    })
    return undefined
  }
  return `/media/${n}`
}

/** Cazul obișnuit: o imagine din `poze/`. Un apel al lui `fisierMedia`. */
function poza(
  nume: string | undefined,
  ctx: { fisier: string; unde?: string; linie?: number },
  poze: string[],
  raport: Raport,
): string | undefined {
  return fisierMedia(nume, EXT_IMAGINE, ctx, poze, raport)
}

/* ------------------------------------------------------------------ */
/* Butoane                                                             */
/* ------------------------------------------------------------------ */

/**
 * Un buton se scrie ca text simplu („Vezi camerele") sau ca
 * `Text | /adresa`. Fără adresă, se deduce din text — și dacă nu se
 * poate deduce, butonul nu se randează deloc, în loc să ducă nicăieri.
 */
const DESTINATII: [RegExp, string][] = [
  [/camer/i, '/camere'],
  [/ofert|pachet/i, '/oferte'],
  [/galeri|poz|foto/i, '/galerie'],
  [/contact|scrie|mesaj/i, '/contact'],
  [/meniu|restaurant|mânc|manc/i, '/facilitati/restaurant'],
  [/eveniment|nunt|conferint/i, '/evenimente'],
  [/zon|împrejur|imprejur|atracți|atracti/i, '/zona'],
  [/disponibil|rezerv|caut/i, '#rezervare'],
  [/telefon|sun[ăa]|apel/i, 'tel'],
]

function cta(brut: string | undefined, variant?: Cta['variant']): Cta | undefined {
  const v = text(brut)
  if (!v) return undefined
  const [eticheta, href] = v.split('|').map((x) => x.trim())
  if (!eticheta) return undefined
  if (href) return { label: eticheta, href, variant }
  const gasit = DESTINATII.find(([re]) => re.test(eticheta))
  return gasit ? { label: eticheta, href: gasit[1], variant } : undefined
}

/* ------------------------------------------------------------------ */
/* Încărcarea propriu-zisă                                             */
/* ------------------------------------------------------------------ */

const CHEI_CAMERA = [
  'pret de la',
  'persoane',
  'pat',
  'suprafata',
  'poze',
  'facilitati',
  'eticheta',
  'video',
  'poster video',
] as const

const CHEI_OFERTA = [
  'pret',
  'pret anterior',
  'unitate',
  'poza',
  'badge',
  'include',
  'valabil',
] as const

const CHEI_RECENZIE = ['autor', 'sursa', 'data', 'nota'] as const

export function incarcaClient(nume: string, limba = 'ro'): ContinutClient {
  const raport = new Raport()
  const radacinaClient = radacinaClientDir(nume)

  if (!existsSync(radacinaClient)) {
    throw new Error(
      `\nNu există clienti/${nume}/.\n` +
        `Rulează \`npm run client-nou\` sau verifică numele folderului.\n`,
    )
  }

  // Româna stă mereu în `date/`. E ȘI baza pentru orice altă limbă:
  // datele care NU se traduc — telefon, email, adresă, CUI, culori
  // (T08) — se citesc mereu de aici, oricare ar fi limba paginii.
  const radacinaRo = path.join(radacinaClient, 'date')
  // Conținutul traductibil vine din folderul limbii (`en/` pentru /en).
  // Pentru română, cele două coincid.
  const radacinaLimba = limba === 'ro' ? radacinaRo : path.join(radacinaClient, limba)
  const poze = citestePoze(radacinaClient)

  // Fișiere STRUCTURALE — nu se traduc, mereu din română.
  const contact = citeste(radacinaRo, '02-contact.md', raport)
  const rezervari = citeste(radacinaRo, '10-rezervari-si-plati.md', raport)
  const stil = citeste(radacinaRo, '11-culori-si-fonturi.md', raport)
  const legalSursa = citeste(radacinaRo, '12-legal-firma.md', raport)

  // Fișiere de CONȚINUT — din folderul limbii. Pe /en, un fișier lipsă
  // înseamnă doar că secțiunea aceea nu apare (T08), deci nu e o
  // problemă de raportat: `optional` taie avertismentul de „lipsește".
  const optional = limba !== 'ro'
  const identitate = citeste(radacinaLimba, '01-identitate.md', raport, { optional })
  const prima = citeste(radacinaLimba, '03-prima-pagina.md', raport, { optional })
  const camereSursa = citeste(radacinaLimba, '04-camere.md', raport, { optional })
  const facilitatiSursa = citeste(radacinaLimba, '05-facilitati.md', raport, { optional })
  const oferteSursa = citeste(radacinaLimba, '06-oferte.md', raport, { optional })
  const recenziiSursa = citeste(radacinaLimba, '08-recenzii.md', raport, { optional })
  const faqSursa = citeste(radacinaLimba, '09-intrebari-frecvente.md', raport, { optional })
  // Meniul (07) se citește separat, prin lib/continut/meniu.ts.

  const setariDoc = existsSync(path.join(radacinaClient, 'setari.md'))
    ? analizeaza(readFileSync(path.join(radacinaClient, 'setari.md'), 'utf8'))
    : null
  const setari = citesteSetari(setariDoc)

  /* ---------------------------------------------------------------- */
  /* 01 · Identitate — fără nume, site-ul n-are ce randa               */
  /* ---------------------------------------------------------------- */

  // Numele locației NU se traduce (T08): pe /en se ia din română dacă
  // en/01-identitate.md nu-l repetă. Slogan și descriere SE traduc.
  const identitateRo = optional ? citeste(radacinaRo, '01-identitate.md', raport) : identitate
  const bNume = bloc(identitate, 'nume') ?? bloc(identitateRo, 'nume')
  const numeLocatie = camp(bloc(identitate, 'nume'), 'nume') ?? camp(bloc(identitateRo, 'nume'), 'nume')
  if (!numeLocatie) {
    raport.eroare({
      fisier: '01-identitate.md',
      unde: 'Nume',
      mesaj: 'Numele locației lipsește.',
      solutie: 'Completează „Nume:" — apare în titlul paginii, în antet și în footer.',
    })
  }
  const numeScurt = camp(bNume, 'nume scurt') ?? numeLocatie ?? ''
  const slogan = camp(bloc(identitate, 'slogan'), 'slogan') ?? ''
  const stele = numar(camp(bloc(identitate, 'clasificare'), 'stele'))
  const descriere = camp(bloc(identitate, 'descriere'), 'descriere') ?? ''
  const logo = poza(
    camp(bloc(identitate, 'logo'), 'logo'),
    { fisier: '01-identitate.md', unde: 'Logo' },
    poze,
    raport,
  )

  if (!descriere) {
    raport.avertisment({
      fisier: '01-identitate.md',
      unde: 'Descriere scurtă',
      mesaj: 'Descrierea lipsește, deci Google va inventa singur un fragment sub titlu.',
      solutie: 'Scrie 2-3 propoziții pentru cineva care nu știe nimic despre locație.',
    })
  }

  /* ---------------------------------------------------------------- */
  /* 02 · Contact — fără telefon, un site de cazare nu are rost        */
  /* ---------------------------------------------------------------- */

  const bTel = bloc(contact, 'telefon')
  const telefon = camp(bTel, 'telefon')
  if (!telefon) {
    raport.eroare({
      fisier: '02-contact.md',
      unde: 'Telefon',
      mesaj: 'Telefonul lipsește.',
      solutie:
        'Completează „Telefon:". La cabane și pensiuni telefonul e principalul canal de rezervare — fără el, bara lipită de pe mobil n-are ce afișa.',
    })
  }
  const telefonAfisat = camp(bTel, 'telefon afisat') ?? telefon ?? ''
  const whatsapp = camp(bTel, 'whatsapp')
  const email = camp(bloc(contact, 'email'), 'email') ?? ''

  const bAdr = bloc(contact, 'adres')
  const oras = camp(bAdr, 'oras') ?? ''
  if (!oras) {
    raport.avertisment({
      fisier: '02-contact.md',
      unde: 'Adresă',
      mesaj: 'Orașul lipsește, deci locația nu poate apărea corect în căutările locale.',
      solutie: 'Completează cel puțin „Oraș:" și „Județ:". Trebuie să fie identice cu Google Business Profile.',
    })
  }

  const bGps = bloc(contact, 'coordonate')
  const bProgram = bloc(contact, 'program')
  const bSocial = bloc(contact, 'sociale')

  const RETELE: [string, IconName][] = [
    ['facebook', 'facebook'],
    ['instagram', 'instagram'],
    ['tiktok', 'tiktok'],
    ['youtube', 'youtube'],
  ]
  const social = RETELE.flatMap(([cheie, icon]) => {
    const url = camp(bSocial, cheie)
    return url ? [{ label: cheie[0].toUpperCase() + cheie.slice(1), icon, url }] : []
  })

  /* ---------------------------------------------------------------- */
  /* 03 · Prima pagină                                                 */
  /* ---------------------------------------------------------------- */

  const bHero = bloc(prima, 'prima secțiune', 'prima sectiune')
  const heroImagine = poza(
    camp(bHero, 'poza'),
    { fisier: '03-prima-pagina.md', unde: 'Prima secțiune', linie: bHero?.linie },
    poze,
    raport,
  )
  if (!heroImagine) {
    raport.avertisment({
      fisier: '03-prima-pagina.md',
      unde: 'Prima secțiune',
      mesaj: 'Prima secțiune n-are poză, deci se va randa pe culoarea de brand, fără imagine.',
      solutie: 'Pune cea mai bună poză a locației în poze/ și scrie numele ei la „Poza:".',
    })
  }

  const bTrust = bloc(prima, 'încredere', 'incredere')
  const trust = lista(bTrust?.campuri.get('elemente')).flatMap((rand) => {
    // „9,2 din 10 — nota oaspeților" → valoare + etichetă
    const [val, ...rest] = rand.split(/\s+[—–-]\s+/)
    const label = rest.join(' — ').trim()
    return val && label ? [{ value: val.trim(), label }] : []
  })

  const sectiune = (b: Bloc | undefined) => ({
    eyebrow: camp(b, 'eticheta') ?? '',
    title: camp(b, 'titlu') ?? '',
    lede: camp(b, 'text introductiv') ?? '',
  })

  // Ca `sectiune`, dar cu un titlu implicit când blocul lipsește sau n-are
  // „Titlu:" — pentru secțiunile al căror nume era înainte hardcodat (T61).
  const sectiuneNumita = (b: Bloc | undefined, titluImplicit: string) => {
    const s = sectiune(b)
    return { ...s, title: s.title || titluImplicit }
  }

  /* ---------------------------------------------------------------- */
  /* 04 · Camere — fiecare devine o pagină proprie (T07)              */
  /* ---------------------------------------------------------------- */

  const camere: Room[] = []
  const sluguriVazute = new Set<string>()

  for (const b of blocuriCompletate(camereSursa)) {
    const ctx = { fisier: '04-camere.md', linie: b.linie, unde: b.titlu || '(cameră fără nume)' }
    verificaChei(b, CHEI_CAMERA, '04-camere.md', raport)

    if (!b.titlu) {
      raport.eroare({
        ...ctx,
        mesaj: 'O cameră n-are nume, dar are date completate.',
        solutie: 'Scrie numele după „## ". Din el se face și adresa paginii: „Apartament Deluxe" → /camere/apartament-deluxe',
      })
      continue
    }

    let s = slug(b.titlu)
    if (sluguriVazute.has(s)) {
      raport.eroare({
        ...ctx,
        mesaj: `Două camere ar primi aceeași adresă: /camere/${s}.`,
        solutie: 'Schimbă numele uneia. Două pagini cu aceeași adresă înseamnă că una dintre ele dispare.',
      })
      s = `${s}-2`
    }
    sluguriVazute.add(s)

    const numePoze = lista(b.campuri.get('poze'))
    const imagini = numePoze.flatMap((n) => {
      const u = poza(n, ctx, poze, raport)
      return u ? [u] : []
    })
    if (!imagini.length) {
      raport.avertisment({
        ...ctx,
        mesaj: 'Camera n-are nicio poză, deci cardul ei va apărea gol.',
        solutie: 'Pune cel puțin o poză în poze/ și scrie numele ei la „Poze:". Prima e cea de pe card.',
      })
    }

    // Clipul camerei (T60): vertical, click-to-play. Fără poster nu se
    // randează (verifica îl prinde ca eroare), deci dacă e video dar nu e
    // poster, îl semnalăm aici, la sursă.
    const video = fisierMedia(b.campuri.get('video'), EXT_VIDEO, ctx, poze, raport)
    const videoPoster = poza(b.campuri.get('poster video'), ctx, poze, raport)
    if (video && !videoPoster) {
      raport.eroare({
        ...ctx,
        mesaj: 'Camera are „Video:", dar n-are „Poster video:".',
        solutie:
          'Scrie la „Poster video:" numele unui cadru din clip (imagine din poze/). Fără poster, clipul e o zonă goală până la click.',
      })
    }

    const pret = numar(b.campuri.get('pret de la'))
    if (pret === undefined && b.campuri.has('pret de la') && b.campuri.get('pret de la')?.trim()) {
      raport.avertisment({
        ...ctx,
        mesaj: `Nu pot citi un preț din „${b.campuri.get('pret de la')}".`,
        solutie: 'Scrie doar numărul: „480". Fără „lei", fără „/noapte" — formatarea o face site-ul.',
      })
    }

    camere.push({
      slug: s,
      name: b.titlu,
      image: imagini[0] ?? '',
      images: imagini.length > 1 ? imagini : undefined,
      occupancy: camp(b, 'persoane'),
      bed: camp(b, 'pat'),
      size: camp(b, 'suprafata'),
      amenities: lista(b.campuri.get('facilitati')),
      description: b.text || undefined,
      priceFrom: pret,
      tag: camp(b, 'eticheta'),
      video: videoPoster ? video : undefined,
      videoPoster: videoPoster && video ? videoPoster : undefined,
    })
  }

  if (!camere.length) {
    raport.avertisment({
      fisier: '04-camere.md',
      mesaj: 'Nicio cameră completată, deci secțiunea de camere nu se va afișa.',
      solutie: 'Completează cel puțin o cameră. E secțiunea care aduce cele mai multe rezervări.',
    })
  }

  /* ---------------------------------------------------------------- */
  /* 05 · Facilități                                                   */
  /* ---------------------------------------------------------------- */

  const facilitati = blocuriCompletate(facilitatiSursa).flatMap((b) => {
    if (!b.titlu) return []
    const icon = (camp(b, 'icon') ?? 'check') as IconName
    return [{ icon, title: b.titlu, text: camp(b, 'text') ?? b.text ?? '' }]
  })

  /* ---------------------------------------------------------------- */
  /* 06 · Oferte                                                       */
  /* ---------------------------------------------------------------- */

  // Titlul secțiunii se citește dintr-un bloc `## Secțiune` traductibil
  // (T61), nu mai e hardcodat în română. Blocul NU e o ofertă, deci se
  // exclude din listă.
  const bSectiuneOferte = bloc(oferteSursa, 'secțiune', 'sectiune')
  const oferte: Offer[] = blocuriCompletate(oferteSursa).flatMap((b) => {
    if (!b.titlu || b === bSectiuneOferte) return []
    const ctx = { fisier: '06-oferte.md', linie: b.linie, unde: b.titlu }
    verificaChei(b, CHEI_OFERTA, '06-oferte.md', raport)
    return [
      {
        slug: slug(b.titlu),
        title: b.titlu,
        text: camp(b, 'include') ?? b.text ?? '',
        image: poza(camp(b, 'poza'), ctx, poze, raport) ?? '',
        price: camp(b, 'pret'),
        priceWas: camp(b, 'pret anterior'),
        priceUnit: camp(b, 'unitate'),
        badge: camp(b, 'badge'),
        href: `/oferte/${slug(b.titlu)}`,
      },
    ]
  })

  /* ---------------------------------------------------------------- */
  /* 08 · Recenzii — sursa e obligatorie (REGULI.md 3)                */
  /* ---------------------------------------------------------------- */

  const bSectiuneRecenzii = bloc(recenziiSursa, 'secțiune', 'sectiune')
  const bNota = bloc(recenziiSursa, 'nota medie', 'notă medie')
  const notaValoare = camp(bNota, 'nota')
  const rating = notaValoare
    ? {
        value: notaValoare,
        scale: numar(camp(bNota, 'din')) ?? 5,
        // Eticheta notei se traduce din blocul `## Nota medie` (T61).
        label: camp(bNota, 'eticheta') ?? 'Nota oaspeților',
        count: numar(camp(bNota, 'numar recenzii')),
        source: camp(bNota, 'sursa'),
      }
    : undefined

  if (rating && !rating.source) {
    raport.eroare({
      fisier: '08-recenzii.md',
      unde: 'Nota medie',
      mesaj: 'Nota medie e completată, dar nu spune de unde vine.',
      solutie:
        'Completează „Sursă:" (Google, Booking.com…). Fără ea nu putem genera AggregateRating — o notă fără sursă e o afirmație pe care nimeni n-o poate verifica.',
    })
  }

  const recenzii: Review[] = []
  for (const b of blocuriCompletate(recenziiSursa)) {
    // Blocurile „Nota medie" și „Secțiune" nu sunt recenzii; sar peste ele.
    if (b === bNota || b === bSectiuneRecenzii) continue
    if (!b.text.trim() && !b.titlu) continue
    verificaChei(b, CHEI_RECENZIE, '08-recenzii.md', raport)

    const sursa = camp(b, 'sursa')
    const autor = camp(b, 'autor')
    const citat = b.text.trim() || b.titlu

    if (!sursa) {
      // Nu e eroare de build: e o secțiune care pur și simplu nu apare.
      raport.avertisment({
        fisier: '08-recenzii.md',
        linie: b.linie,
        unde: autor ?? citat.slice(0, 40),
        mesaj: 'Recenzia n-are sursă, deci NU se afișează pe site.',
        solutie:
          'Completează „Sursă:" (de unde vine) și „Data:". O recenzie fără sursă e o practică comercială incorectă, nu doar un gol de design.',
      })
      continue
    }
    if (!citat) continue

    recenzii.push({
      quote: citat,
      author: autor ?? '',
      source: sursa,
      date: camp(b, 'data') ?? '',
      rating: numar(camp(b, 'nota')) ?? 0,
    })
  }

  /* ---------------------------------------------------------------- */
  /* 09 · Întrebări frecvente                                          */
  /* ---------------------------------------------------------------- */

  const bSectiuneFaq = bloc(faqSursa, 'secțiune', 'sectiune')
  const faq: Faq[] = blocuriCompletate(faqSursa).flatMap((b) =>
    b !== bSectiuneFaq && b.titlu && b.text.trim() ? [{ q: b.titlu, a: b.text.trim() }] : [],
  )

  /* ---------------------------------------------------------------- */
  /* 03 · Feature-uri alternante — motorul Șablonului 2               */
  /* ---------------------------------------------------------------- */

  const bFeatures = bloc(prima, 'feature')
  const features: Feature[] = (bFeatures?.subblocuri ?? []).flatMap((sb, i) => {
    if (!sb.titlu) return []
    const ctx = { fisier: '03-prima-pagina.md', linie: sb.linie, unde: sb.titlu }
    const buton = cta(sb.campuri.get('buton'), 'ghost')
    return [
      {
        id: slug(sb.titlu),
        eyebrow: camp(sb, 'eticheta') ?? '',
        title: sb.titlu,
        text: camp(sb, 'text') ?? sb.text ?? '',
        image: poza(camp(sb, 'poza'), ctx, poze, raport) ?? '',
        bullets: lista(sb.campuri.get('buline')),
        ctas: buton ? [buton] : [],
        // Alternanța e calculată, nu scrisă de mână: cine adaugă un
        // feature la mijloc nu trebuie să reordoneze restul.
        reverse: i % 2 === 1,
      },
    ]
  })

  /* ---------------------------------------------------------------- */
  /* 03 · Clip de prezentare (T60) — vertical, click-to-play          */
  /* ---------------------------------------------------------------- */

  const bPrezentare = bloc(prima, 'clip de prezentare')
  const prezentareVideo = fisierMedia(
    bPrezentare?.campuri.get('video'),
    EXT_VIDEO,
    { fisier: '03-prima-pagina.md', unde: 'Clip de prezentare', linie: bPrezentare?.linie },
    poze,
    raport,
  )
  const prezentarePoster = poza(
    bPrezentare?.campuri.get('poster'),
    { fisier: '03-prima-pagina.md', unde: 'Clip de prezentare', linie: bPrezentare?.linie },
    poze,
    raport,
  )
  // Secțiunea apare doar cu video ȘI poster: un clip fără poster e o zonă
  // goală până la click (REGULI.md 3 — mai bine lipsă decât pe jumătate).
  if (prezentareVideo && !prezentarePoster) {
    raport.eroare({
      fisier: '03-prima-pagina.md',
      unde: 'Clip de prezentare',
      linie: bPrezentare?.linie,
      mesaj: 'Clipul de prezentare are „Video:", dar n-are „Poster:".',
      solutie:
        'Scrie la „Poster:" numele unui cadru din clip (imagine din poze/). Fără poster, secțiunea nu se afișează.',
    })
  }
  const prezentare =
    prezentareVideo && prezentarePoster
      ? {
          eyebrow: camp(bPrezentare, 'eticheta') ?? '',
          title: camp(bPrezentare, 'titlu') ?? '',
          text: camp(bPrezentare, 'text') ?? bPrezentare?.text ?? '',
          video: prezentareVideo,
          poster: prezentarePoster,
        }
      : undefined

  /* ---------------------------------------------------------------- */
  /* 10 · Rezervări (contractul cu T12)                                */
  /* ---------------------------------------------------------------- */

  const bRez = bloc(rezervari, 'rezervări', 'rezervari')
  const bEtichete = bloc(rezervari, 'etichete')
  const adresaMotor = camp(bRez, 'adresa') ?? ''
  const tipRezervare = (camp(bRez, 'tip') ?? 'formular').toLowerCase()

  if (tipRezervare !== 'formular' && !adresaMotor) {
    raport.eroare({
      fisier: '10-rezervari-si-plati.md',
      unde: 'Rezervări',
      mesaj: `Tipul e „${tipRezervare}", dar „Adresă:" e goală.`,
      solutie:
        'Scrie adresa motorului de rezervări, sau pune „Tip: formular" ca cererile să vină pe email.',
    })
  }

  /* ---------------------------------------------------------------- */
  /* 11 · Temă                                                         */
  /* ---------------------------------------------------------------- */

  const bCulori = bloc(stil, 'culori')
  const bFonturi = bloc(stil, 'fonturi')
  const c = (cheie: string, implicit: string) => camp(bCulori, cheie) ?? implicit

  /* ---------------------------------------------------------------- */
  /* 12 · Legal (REGULI.md 14)                                         */
  /* ---------------------------------------------------------------- */

  const bFirma = bloc(legalSursa, 'firm')
  const denumire = camp(bFirma, 'denumire')
  const cui = camp(bFirma, 'cui')
  if (!denumire || !cui) {
    raport.avertisment({
      fisier: '12-legal-firma.md',
      unde: 'Firmă',
      mesaj: 'Denumirea firmei sau CUI-ul lipsesc din footer.',
      solutie:
        'Completează-le înainte de lansare. Sunt obligatorii pentru un site de cazare care primește cereri online — lipsa lor e motiv de amendă ANPC.',
    })
  }

  const bDocumente = bloc(legalSursa, 'documente legale')
  const linkuriLegale = [
    ['Politica de confidențialitate', camp(bDocumente, 'politica de confidentialitate')],
    ['Politica de cookies', camp(bDocumente, 'politica de cookies')],
    ['Termeni și condiții', camp(bDocumente, 'termeni si conditii')],
    ['Politica de anulare', camp(bDocumente, 'politica de anulare')],
  ].flatMap(([label, href]) => (label && href ? [{ label, href }] : []))

  /* ---------------------------------------------------------------- */
  /* Navigația — se generează din ce EXISTĂ, nu dintr-o listă fixă    */
  /* ---------------------------------------------------------------- */

  const nav = [
    camere.length ? { label: 'Camere', href: '/camere' } : null,
    oferte.length ? { label: 'Oferte', href: '/oferte' } : null,
    setari.module.meniuRestaurant ? { label: 'Restaurant', href: '/facilitati/restaurant' } : null,
    setari.module.evenimente ? { label: 'Evenimente', href: '/evenimente' } : null,
    setari.module.galerieExtinsa ? { label: 'Galerie', href: '/galerie' } : null,
    setari.module.zona ? { label: 'Zona', href: '/zona' } : null,
    { label: 'Contact', href: '/contact' },
  ].filter((x): x is { label: string; href: string } => x !== null)

  const date: SiteData = {
    meta: {
      sourceUrl: '',
      generatedAt: new Date().toISOString(),
      locale: limba === 'ro' ? 'ro-RO' : 'en-GB',
      localeShort: limba,
      currency: 'RON',
      currencySymbol: 'lei',
    },
    brand: {
      name: numeLocatie ?? '',
      shortName: numeScurt,
      tagline: slogan,
      // Monogramă din inițiale, doar dacă n-are logo. Nu e „date
      // inventate": e o reprezentare a numelui pe care îl avem deja.
      monogram: (numeScurt || numeLocatie || '')
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0] ?? '')
        .join('')
        .toUpperCase(),
      logo,
      stars: stele,
    },
    theme: {
      colors: {
        ink: c('text principal', '#17201C'),
        inkSoft: c('text secundar', '#414D47'),
        muted: c('text estompat', '#64706B'),
        line: c('linii si margini', '#E3DED5'),
        canvas: c('fundal pagina', '#FCFBF9'),
        surface: c('fundal carduri', '#FFFFFF'),
        surfaceAlt: c('fundal sectiuni alternante', '#F4F1EC'),
        brand: c('culoare principala', '#1F3D33'),
        brandLift: c('culoare principala, varianta deschisa', '#2C5648'),
        onBrand: c('text pe culoarea principala', '#FFFFFF'),
        accent: c('culoare de accent', '#8A5A22'),
        accentLift: c('culoare de accent, varianta deschisa', '#C79B5C'),
        positive: c('culoare de confirmare', '#2E7D5B'),
        attention: c('culoare de atentionare', '#B03A2E'),
      },
      fonts: {
        display: camp(bFonturi, 'font pentru titluri') ?? 'Satoshi',
        body: camp(bFonturi, 'font pentru text') ?? 'Inter',
        displayStack: `'${camp(bFonturi, 'font pentru titluri') ?? 'Satoshi'}', 'Inter', system-ui, sans-serif`,
        bodyStack: `'${camp(bFonturi, 'font pentru text') ?? 'Inter'}', system-ui, sans-serif`,
        displaySpec: '',
        bodySpec: '',
        displayTracking: '-0.02em',
      },
      radius: camp(bFonturi, 'rotunjire colturi') ?? '14px',
      character: (camp(bFonturi, 'caracter') ?? 'warm') as SiteData['theme']['character'],
    },
    seo: {
      title: numeLocatie ? `${numeLocatie}${oras ? ` · ${oras}` : ''}` : '',
      description: descriere,
      canonical: '',
      ogImage: heroImagine,
    },
    contact: {
      phone: telefonAfisat,
      // `tel:` are nevoie de forma fără spații; afișarea rămâne lizibilă.
      phoneHref: telefon ? `tel:${telefon.replace(/[^\d+]/g, '')}` : '',
      email,
      street: camp(bAdr, 'strada') ?? '',
      city: oras,
      region: camp(bAdr, 'judet'),
      postalCode: camp(bAdr, 'cod postal'),
      country: camp(bAdr, 'tara') ?? 'România',
      countryCode: 'RO',
      lat: numar(camp(bGps, 'latitudine')),
      lng: numar(camp(bGps, 'longitudine')),
      mapsUrl: camp(bGps, 'link google maps'),
      hours: camp(bProgram, 'receptie'),
      social,
    },
    nav,
    locales: [],
    hero: {
      headline: camp(bHero, 'titlu') ?? numeLocatie ?? '',
      sub: camp(bHero, 'subtitlu') ?? slogan,
      image: heroImagine ?? '',
      badges: [],
    },
    rating,
    trust,
    perks: { section: sectiune(bloc(prima, 'facilit')), items: facilitati },
    rooms: { section: sectiune(bloc(prima, 'camere')), items: camere },
    features,
    prezentare,
    // Titlurile de secțiune se citesc din blocul `## Secțiune` al fiecărui
    // fișier și se traduc pe /en (T61); fără bloc, se cade pe valoarea de
    // dinainte, deci un client fără blocul respectiv se randează neschimbat.
    offers: { section: sectiuneNumita(bSectiuneOferte, 'Oferte'), items: oferte },
    events: { section: { eyebrow: '', title: 'Evenimente', lede: '' }, items: [] },
    reviews: { section: sectiuneNumita(bSectiuneRecenzii, 'Ce spun oaspeții'), items: recenzii },
    faq: { section: sectiuneNumita(bSectiuneFaq, 'Întrebări frecvente'), items: faq },
    closing: {
      eyebrow: camp(bloc(prima, 'închidere', 'inchidere'), 'eticheta') ?? '',
      title: camp(bloc(prima, 'închidere', 'inchidere'), 'titlu') ?? '',
      text: camp(bloc(prima, 'închidere', 'inchidere'), 'text') ?? '',
      cta: cta(bloc(prima, 'închidere', 'inchidere')?.campuri.get('buton'), 'accent') ?? {
        label: '',
        href: '',
      },
    },
    booking: {
      engineUrl: adresaMotor,
      sameOrigin: false,
      assurances: lista(bEtichete?.campuri.get('asigurari')),
      labels: {
        checkIn: camp(bEtichete, 'sosire') ?? 'Sosire',
        checkOut: camp(bEtichete, 'plecare') ?? 'Plecare',
        guests: camp(bEtichete, 'persoane') ?? 'Persoane',
        submit: camp(bEtichete, 'text buton') ?? 'Verifică disponibilitatea',
        from: 'de la',
        perNight: 'pe noapte',
      },
      guestOptions: lista(bEtichete?.campuri.get('optiuni persoane')),
      // Vocabularul din fișier (link/widget/formular) → modul intern.
      mod: tipRezervare === 'link' ? 'deep-link' : tipRezervare === 'widget' ? 'iframe' : 'formular',
      furnizor: camp(bRez, 'sistem')?.toLowerCase(),
    },
    // Plăți online (T13) — implicit OPRIT. Se pornește explicit din date/10.
    payments: {
      enabled: ['da', 'activ', 'pornit', 'true', 'on'].includes(
        (camp(bloc(rezervari, 'plăți', 'plati'), 'activ') ?? 'nu').toLowerCase(),
      ),
    },
    legal: {
      company: denumire ?? '',
      registration: [cui, camp(bFirma, 'nr. reg. com.')].filter(Boolean).join(' · ') || undefined,
      links: linkuriLegale,
    },
    mockup: { enabled: false, notice: '' },
  }

  // WhatsApp e un canal de rezervare, nu o rețea socială — de asta stă
  // separat, nu în `social`.
  if (whatsapp && setari.butonWhatsApp) {
    date.contact.social.unshift({ label: 'WhatsApp', icon: 'phone', url: `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}` })
  }

  return { date, setari, raport, poze }
}
