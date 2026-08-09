import type { Limba } from './limbi'

/* ============================================================
   etichete.ts — textele MOTORULUI, pe limbi.

   DE CE EXISTĂ (T08)
   ------------------
   Conținutul se traduce în `date/` și `en/`. Dar motorul are și el
   câteva cuvinte proprii, care nu vin din niciun fișier al clientului:
   „Acasă" din breadcrumb, „Alergeni", „de la" dinaintea prețului,
   etichetele din meniul de navigație. Erau scrise direct în componente,
   în română — adică pe `/en` ieșeau tot în română.

   Aici stau o singură dată, în ambele limbi. Regula rămâne cea din
   REGULI.md 3: aici intră DOAR text de interfață, generat de motor.
   Orice frază despre locație (ce se gătește, cum arată camerele) e
   conținut și stă în `date/`, nu aici — altfel un client ar moșteni
   descrierea altuia.
   ============================================================ */

export interface Etichete {
  /* Navigație — etichetele derivate în `lib/continut/index.ts`. */
  navCamere: string
  navOferte: string
  navMeniu: string
  navEvenimente: string
  navGalerie: string
  navZona: string
  navContact: string

  /* Breadcrumb. */
  acasa: string

  /* Meniul restaurantului. */
  meniuTitlu: string
  meniuCategorii: string
  meniuAlergeni: string
  meniuNutritie: string
  meniuComplet: string
  meniuPdf: string

  /* Prețuri. */
  dela: string
  peNoapte: string

  /**
   * Descrieri de REZERVĂ pentru `<meta description>`, când fișierul
   * clientului n-are una. Se completează cu numele locației.
   */
  descriereCamere: string
  descriereOferte: string

  /* Pagina camerei. */
  camereCeInclude: string
  camereFotografii: string

  /* Pagina de contact. */
  contactTitlu: string
  contactLede: string
  contactDate: string
  contactTelefon: string
  contactWhatsapp: string
  contactEmail: string
  contactAdresa: string
  contactProgram: string
  contactCheckIn: string
  contactCheckOut: string
  contactSocial: string
  contactFormular: string
  contactFormularLede: string

  /* Interfață. */
  actiuniRapide: string
}

const RO: Etichete = {
  navCamere: 'Camere',
  navOferte: 'Oferte',
  navMeniu: 'Meniu',
  navEvenimente: 'Evenimente',
  navGalerie: 'Galerie',
  navZona: 'Zona',
  navContact: 'Contact',

  acasa: 'Acasă',

  meniuTitlu: 'Meniu',
  meniuCategorii: 'Categorii',
  meniuAlergeni: 'Alergeni',
  meniuNutritie: 'Valori nutriționale',
  meniuComplet: 'Vezi meniul complet',
  meniuPdf: 'Descarcă meniul (PDF)',

  dela: 'de la',
  peNoapte: 'noapte',

  descriereCamere: 'Camerele și apartamentele de la',
  descriereOferte: 'Pachete și oferte la',

  camereCeInclude: 'Ce include',
  camereFotografii: 'Fotografii',

  contactTitlu: 'Contact',
  contactLede: 'Ne găsești la telefon, pe WhatsApp sau pe e-mail. Poți trimite o cerere și din formularul de mai jos.',
  contactDate: 'Date de contact',
  contactTelefon: 'Telefon',
  contactWhatsapp: 'Scrie-ne pe WhatsApp',
  contactEmail: 'E-mail',
  contactAdresa: 'Adresă',
  contactProgram: 'Program',
  contactCheckIn: 'Check-in',
  contactCheckOut: 'Check-out',
  contactSocial: 'Pe rețele',
  contactFormular: 'Trimite o cerere',
  contactFormularLede: 'Completează perioada și numărul de persoane, iar noi revenim cu disponibilitatea și tariful.',

  actiuniRapide: 'Acțiuni rapide',
}

const EN: Etichete = {
  navCamere: 'Rooms',
  navOferte: 'Offers',
  navMeniu: 'Menu',
  navEvenimente: 'Events',
  navGalerie: 'Gallery',
  navZona: 'The area',
  navContact: 'Contact',

  acasa: 'Home',

  meniuTitlu: 'Menu',
  meniuCategorii: 'Categories',
  meniuAlergeni: 'Allergens',
  meniuNutritie: 'Nutrition facts',
  meniuComplet: 'See the full menu',
  meniuPdf: 'Download the menu (PDF)',

  dela: 'from',
  peNoapte: 'night',

  descriereCamere: 'Rooms and apartments at',
  descriereOferte: 'Packages and offers at',

  camereCeInclude: "What's included",
  camereFotografii: 'Photos',

  contactTitlu: 'Contact',
  contactLede: 'Reach us by phone, on WhatsApp or by email. You can also send a request using the form below.',
  contactDate: 'Contact details',
  contactTelefon: 'Phone',
  contactWhatsapp: 'Message us on WhatsApp',
  contactEmail: 'Email',
  contactAdresa: 'Address',
  contactProgram: 'Hours',
  contactCheckIn: 'Check-in',
  contactCheckOut: 'Check-out',
  contactSocial: 'Social',
  contactFormular: 'Send a request',
  contactFormularLede: 'Tell us your dates and how many of you there are, and we will come back with availability and the rate.',

  actiuniRapide: 'Quick actions',
}

const TOATE: Record<Limba, Etichete> = { ro: RO, en: EN }

export function etichete(limba: Limba): Etichete {
  return TOATE[limba] ?? RO
}
