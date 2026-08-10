/**
 * The single source of truth for a generated site.
 *
 * `scripts/ingest.ts` writes `content/site.json` against this shape by reading a
 * real hotel website; every component renders from it and nothing else. Adding a
 * field here means adding it to the extractor and to the component that uses it —
 * there is no other place where site-specific content is allowed to live.
 */

export type IconName =
  | 'pin' | 'clock' | 'phone' | 'mail' | 'globe'
  | 'users' | 'bed' | 'ruler' | 'accessible' | 'door'
  | 'wifi' | 'tv' | 'safe' | 'fridge' | 'climate' | 'coffee' | 'shower' | 'parking' | 'ev'
  | 'pool' | 'sauna' | 'spa' | 'dining' | 'bar' | 'terrace'
  | 'check' | 'arrow' | 'plus' | 'chevron' | 'star' | 'search' | 'close' | 'play'
  | 'tag' | 'calendar' | 'refresh' | 'glass' | 'clock-late' | 'shield'
  | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok'
  // T04 — adăugate pentru nișa de cazare din România. Apar des la
  // cabane și pensiuni și nu existau în setul din hotel-forge.
  | 'ciubar' | 'foc-de-tabara' | 'teleschi' | 'pet-friendly' | 'grill'
  | 'biciclete' | 'drumetie' | 'pescuit' | 'sala-conferinte'
  | 'mic-dejun' | 'transfer-aeroport' | 'incalzire-lemne'

export interface Palette {
  /** Primary text. */
  ink: string
  /** Secondary text on light grounds. */
  inkSoft: string
  /** Tertiary text, captions, labels. */
  muted: string
  /** Hairlines and borders. */
  line: string
  /** Page ground. */
  canvas: string
  /** Cards and raised surfaces. */
  surface: string
  /** Recessed bands and alternating sections. */
  surfaceAlt: string
  /** The brand's dominant colour — headers, dark sections, primary buttons. */
  brand: string
  /** A lighter step of the brand, for hover states. */
  brandLift: string
  /** Text/iconography that sits on `brand`. */
  onBrand: string
  /** The single accent. Used sparingly: eyebrows, prices, one CTA. */
  accent: string
  /** A lighter step of the accent, for use on dark grounds. */
  accentLift: string
  /** Positive/confirmation. */
  positive: string
  /** Scarcity and time-sensitive notices. */
  attention: string
}

export interface Typography {
  /** Display family name as it must appear in `font-family`. */
  display: string
  /** Body family name. */
  body: string
  /** Full stacks including fallbacks. */
  displayStack: string
  bodyStack: string
  /** Google Fonts family+weight spec, consumed by `scripts/lib/fonts.ts`. */
  displaySpec: string
  bodySpec: string
  /** Optical correction: some display faces need tighter tracking at large sizes. */
  displayTracking: string
}

export interface Theme {
  colors: Palette
  fonts: Typography
  /** Corner radius token. A brand with hard geometry should get `0px`. */
  radius: string
  /** Set when the source brand reads as classic//luxury rather than contemporary. */
  character: 'classic' | 'contemporary' | 'warm' | 'coastal'
}

export interface NavItem {
  label: string
  href: string
}

export interface Cta {
  label: string
  href: string
  variant?: 'primary' | 'accent' | 'ghost' | 'light'
}

export interface Room {
  slug: string
  name: string
  image: string
  images?: string[]
  /** e.g. "2 persoane" */
  occupancy?: string
  /** e.g. "Pat dublu" */
  bed?: string
  /** e.g. "24 m²" */
  size?: string
  amenities: string[]
  description?: string
  /** Numeric so the template can format and mark up `Offer` schema. */
  priceFrom?: number
  /** Ribbon text. Omit rather than inventing one. */
  tag?: string
  /** Renders the ribbon in the attention colour. Only ever set from real availability. */
  scarce?: boolean
  /**
   * Clip vertical al camerei (T60), filmat cu telefonul. NU e fundal
   * decorativ: are comentariu audio și se redă click-to-play, cu sunet.
   * Elementul `<video>` se montează abia la apăsarea butonului de play,
   * deci până atunci în pagină e doar posterul — zero bytes de video.
   * Randat ca ultim bloc din pagina camerei.
   */
  video?: string
  /** Posterul clipului. Fără el, `VideoVertical` nu se randează (T60, verifica). */
  videoPoster?: string
}

export interface Feature {
  id: string
  eyebrow: string
  title: string
  text: string
  image: string
  bullets: string[]
  ctas: Cta[]
  /**
   * Clip vertical în locul pozei, cu aceleași reguli ca la cameră (T60):
   * click-to-play, cu sunet, zero bytes până la click. `image` rămâne
   * completată — e ce se afișează dacă cineva scoate clipul.
   */
  video?: string
  /** Posterul clipului. Fără el, clipul nu se randează deloc. */
  videoPoster?: string
  /** Mirrors the split so consecutive features alternate. */
  reverse?: boolean
}

export interface Offer {
  slug: string
  title: string
  text: string
  image: string
  /** Formatted, because offers are quoted per package not per night. */
  price?: string
  priceWas?: string
  priceUnit?: string
  badge?: string
  href?: string
}

export interface EventSpace {
  title: string
  capacity: string
  text: string
  image: string
  cta: Cta
}

export interface Review {
  quote: string
  author: string
  /** Where it came from. Never leave blank on a live site. */
  source: string
  date: string
  rating: number
}

export interface Faq {
  q: string
  a: string
}

export interface SiteData {
  meta: {
    sourceUrl: string
    generatedAt: string
    locale: string
    localeShort: string
    currency: string
    currencySymbol: string
  }
  brand: {
    name: string
    shortName: string
    tagline: string
    monogram: string
    logo?: string
    stars?: number
  }
  theme: Theme
  seo: {
    title: string
    description: string
    canonical: string
    ogImage?: string
  }
  contact: {
    phone: string
    phoneHref: string
    /** Numărul de WhatsApp, doar cifre — se lipește direct după `https://wa.me/`. */
    whatsapp?: string
    email: string
    street: string
    city: string
    region?: string
    postalCode?: string
    country: string
    countryCode: string
    lat?: number
    lng?: number
    mapsUrl?: string
    hours?: string
    /** Ora de check-in, ca text („de la 15:00"). Din `## Program`. */
    checkIn?: string
    /** Ora de check-out, ca text („până la 12:00"). Din `## Program`. */
    checkOut?: string
    social: { label: string; icon: IconName; url: string }[]
  }
  nav: NavItem[]
  locales: { code: string; label: string; href: string; current?: boolean }[]
  hero: {
    headline: string
    sub: string
    image: string
    /**
     * Video de fundal pentru Șablonul 1 (Hero Video, T20). Opțional:
     * fără el, hero-ul rămâne pe poster (`image`). Nu se redă niciodată
     * pe mobil, sub `prefers-reduced-motion`, pe `saveData` sau pe
     * conexiuni lente — decizia se ia client-side, deci pe mobil nu se
     * descarcă niciun byte (T20). Sub 3 MB, fără pistă audio (ingest).
     */
    videoSrc?: string
    badges: { icon?: IconName; text: string; score?: string }[]
  }
  /** Aggregate guest score. Rendered without naming a platform. */
  rating?: {
    value: string
    scale: number
    label: string
    /** Kept for schema.org even when not displayed. */
    count?: number
    source?: string
  }
  trust: { value: string; label: string }[]
  perks: {
    section: { eyebrow: string; title: string; lede: string }
    items: { icon: IconName; title: string; text: string }[]
    footnote?: { text: string; highlight?: string; cta: Cta }
  }
  rooms: {
    section: { eyebrow: string; title: string; lede: string }
    items: Room[]
  }
  features: Feature[]
  /**
   * Clip de prezentare al locației (T60), pe prima pagină. Vertical, cu
   * comentariu audio, click-to-play — la fel ca video-ul de cameră. Apare
   * doar dacă blocul `## Clip de prezentare` din `03-pagina-principala.md` e
   * completat ȘI `Clip de prezentare` e în `## Secțiuni` din `setari.md`.
   */
  prezentare?: { eyebrow: string; title: string; text: string; video: string; poster: string }
  offers: {
    section: { eyebrow: string; title: string; lede: string }
    items: Offer[]
  }
  events: {
    section: { eyebrow: string; title: string; lede: string }
    items: EventSpace[]
  }
  reviews: {
    section: { eyebrow: string; title: string; lede: string }
    items: Review[]
  }
  faq: {
    section: { eyebrow: string; title: string }
    items: Faq[]
  }
  closing: {
    eyebrow: string
    title: string
    text: string
    cta: Cta
  }
  booking: {
    /** Where the engine lives. Cross-origin engines get a linker warning in the audit. */
    engineUrl: string
    sameOrigin: boolean
    /** Reassurances shown under the date picker. */
    assurances: string[]
    labels: {
      checkIn: string
      checkOut: string
      guests: string
      submit: string
      from: string
      perNight: string
      /**
       * CTA-ul pentru ce se cotează, nu se rezervă: excursii și pachete
       * al căror tarif variază cu vremea, sezonul și numărul de persoane.
       * Ia locul prețului pe cardul și pe pagina unei oferte fără `price`.
       * Cade pe `submit` dacă nu e completat în `date/10-rezervari-si-plati.md`.
       */
      quote: string
    }
    guestOptions: string[]
    /**
     * Cum se ajunge la motorul de rezervări (T12), din `date/10-rezervari-si-plati.md`:
     * - `deep-link`: buton către motorul lor, cu datele deja completate (preferat);
     * - `iframe`: motorul lor încărcat leneș, la click/în viewport;
     * - `formular`: locația n-are motor — cererea merge pe email (T10) + telefon.
     */
    mod: 'deep-link' | 'iframe' | 'formular'
    /** Cheia furnizorului pentru formatul de parametri la deep-link (previo, siteminder, cloudbeds, booking…). */
    furnizor?: string
  }
  /**
   * Plăți online prin Netopia (T13). Implicit OPRIT: majoritatea locațiilor
   * încasează la sosire sau prin sistemul lor. Când e `false`, nimic din
   * `lib/plati/` nu e importat, iar site-ul se buildează fără să atingă modulul.
   * Comutatorul vine din `date/10-rezervari-si-plati.md` („## Plăți", „Activ: nu").
   */
  payments: {
    enabled: boolean
  }
  legal: {
    company: string
    registration?: string
    links: NavItem[]
  }
  /** Renders the proposal banner and enables the improvements overlay. */
  mockup: {
    enabled: boolean
    notice: string
  }
}

export type Severity = 'critic' | 'important' | 'minor'
export type Area = 'performanta' | 'seo' | 'conversie' | 'tracking' | 'accesibilitate'

export interface AuditFinding {
  id: string
  severity: Severity
  area: Area
  title: string
  /** What was actually measured on the source site. Never a generic claim. */
  evidence: string
  /** What this template does instead. */
  fix: string
  /** DOM id the improvements overlay pins the marker to. */
  anchor?: string
}

export interface AuditReport {
  sourceUrl: string
  generatedAt: string
  findings: AuditFinding[]
  metrics: {
    htmlBytes?: number
    assetBytes?: number
    cssFiles?: number
    jsFiles?: number
    images?: number
    largestMedia?: { url: string; bytes: number; type: string }
    cacheControl?: string
    schemaTypes?: string[]
    hreflang?: string[]
    lang?: string
    sitemapPages?: number
    pricesFound?: number
  }
}
