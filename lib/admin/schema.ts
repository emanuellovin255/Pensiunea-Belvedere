/* ============================================================
   schema.ts — ce formular arată panoul pentru fiecare fișier.

   ATENȚIE, PENTRU CINE ÎNTREȚINE MOTORUL: parte din panoul de
   administrare, o modificare locală față de motorul-sursă. Vezi
   `MOTOR-MODIFICAT.md`.

   DE CE O SCHEMĂ ȘI NU UN TEXTAREA
   --------------------------------
   Un textarea cu markdown-ul brut ar fi fost o zi de muncă, nu o
   săptămână. Dar ar fi mutat exact problema pe care panoul trebuie s-o
   rezolve: gazda ar trebui în continuare să știe că prețul se scrie fără
   „lei", că `Poze:` cere numele exact al fișierului, că o listă pe un
   rând se taie la virgulă. Adică ar fi GitHub cu alt fundal.

   Schema mută cunoștințele acelea în cod: fiecare câmp are un tip, o
   etichetă în română și o explicație. Un preț e un câmp numeric cu
   sufixul „lei". O poză e o grilă de miniaturi. O listă e etichete
   adăugate una câte una, deci întrebarea „unde pun virgula" nu se mai
   pune deloc.

   AJUTOARELE VIN DIN FIȘIERE
   --------------------------
   Textele de la `ajutor` sunt luate din comentariile `<!-- … -->` deja
   scrise în fișierele din `date/`. Nu sunt explicații noi, inventate
   aici: sunt aceleași, mutate lângă câmp. Cine editează din GitHub și
   cine editează din panou citesc același lucru.

   CHEILE SUNT SINGURA SURSĂ DE ADEVĂR
   -----------------------------------
   `cheie` trebuie să fie EXACT cheia normalizată din `.md`, altfel
   panoul scrie un câmp pe care motorul îl ignoră. Listele de chei
   acceptate există deja în `lib/continut/index.ts` (`CHEI_CAMERA`,
   `CHEI_OFERTA`, `CHEI_RECENZIE`); `scripts/proba-patch.ts` verifică pe
   fișierele reale că schema și motorul văd aceleași chei.
   ============================================================ */

import { FISIERE } from '@/lib/continut/fisiere'

/* ------------------------------------------------------------------ */
/* Tipuri                                                             */
/* ------------------------------------------------------------------ */

export type TipCamp =
  /** Un rând. */
  | 'text'
  /** Mai multe rânduri, pentru fraze. */
  | 'paragraf'
  /** Doar cifre. Panoul afișează sufixul și refuză „380 lei". */
  | 'numar'
  /** O poză din `poze/`, aleasă din grilă. */
  | 'poza'
  /** Mai multe poze, în ordine. Prima e cea de pe card. */
  | 'poze'
  /** Un clip din `poze/`. */
  | 'video'
  /** Listă de rânduri: fiecare element pe rândul lui în fișier. */
  | 'lista'
  /** Listă de etichete scurte, pe un rând, despărțite prin virgulă. */
  | 'etichete'
  /** `da` / `nu`. */
  | 'da-nu'
  /** Iconuri din setul lui `components/Icon.tsx`. */
  | 'icon'

export interface Camp {
  /** Cheia normalizată din `.md`. Trebuie să se potrivească EXACT. */
  cheie: string
  /** Cum se scrie cheia când câmpul e adăugat pentru prima dată. */
  cheieScrisa: string
  eticheta: string
  tip: TipCamp
  /** O frază, din comentariile fișierului. Apare sub câmp. */
  ajutor?: string
  /** Text gri în câmpul gol, ca exemplu. */
  exemplu?: string
  /** Pentru `numar`: ce se scrie după cifră pe ecran (nu în fișier). */
  sufix?: string
}

export interface Bloc {
  /** Titlul `##` din fișier. Cu el se caută blocul. */
  titlu: string
  /** Cum se numește pe ecran, dacă altfel decât în fișier. */
  eticheta?: string
  ajutor?: string
  campuri: Camp[]
  /** Blocul are și text liber sub câmpuri? */
  descriere?: { eticheta: string; ajutor?: string }
}

export interface Fisier {
  /** Cheia din URL: `/admin/text/<id>`. */
  id: string
  /** Numele fișierului din `date/`. */
  fisier: string
  titlu: string
  /** O frază pe ecranul de acasă. */
  rezumat: string
  /** Unde se vede pe site — ca gazda să știe ce schimbă. */
  undeSeVede: string
  /** Emoji-free: numele unui icon din `components/Icon.tsx`. */
  icon: string
  forma:
    | {
        /** Blocuri cu titluri fixe: nu se adaugă și nu se șterg. */
        fel: 'fixe'
        blocuri: Bloc[]
      }
    | {
        /** Listă de elemente de același fel: se adaugă, se șterg, se mută. */
        fel: 'lista'
        /** Antet opțional, un bloc fix înaintea listei (`## Secțiune`). */
        antet?: Bloc
        /** Cum se numește un element: „cameră", „ofertă". */
        singular: string
        plural: string
        campuri: Camp[]
        descriere?: { eticheta: string; ajutor?: string }
        /** Titlul devine adresa paginii? Atunci se avertizează la redenumire. */
        titluEsteAdresa?: boolean
        /** Elementele trebuie să existe și în `en/`, în aceeași ordine? */
        cerePereche?: boolean
      }
}

/* ------------------------------------------------------------------ */
/* Câmpuri refolosite                                                 */
/* ------------------------------------------------------------------ */

const ETICHETA: Camp = {
  cheie: 'eticheta',
  cheieScrisa: 'Eticheta',
  eticheta: 'Supratitlu',
  tip: 'text',
  ajutor: 'Cuvântul mic de deasupra titlului. Lasă gol și nu apare nimic.',
  exemplu: 'Camerele',
}

const TITLU: Camp = { cheie: 'titlu', cheieScrisa: 'Titlu', eticheta: 'Titlu', tip: 'text' }

const TEXT_INTRO: Camp = {
  cheie: 'text introductiv',
  cheieScrisa: 'Text introductiv',
  eticheta: 'Text introductiv',
  tip: 'paragraf',
  ajutor: 'Una–două fraze sub titlu.',
}

/* ------------------------------------------------------------------ */
/* Fișierele                                                         */
/* ------------------------------------------------------------------ */

export const FISIERE_PANOU: Fisier[] = [
  /* -------------------------------------------------------------- */
  {
    id: 'prima-pagina',
    fisier: FISIERE.primaPagina,
    titlu: 'Prima pagină',
    rezumat: 'Titlul mare de sus, poza mare, blocurile poză + text, textul de final.',
    undeSeVede: 'Prima pagină, de sus până jos.',
    icon: 'globe',
    forma: {
      fel: 'fixe',
      blocuri: [
        {
          titlu: 'Prima secțiune',
          eticheta: 'Sus, prima priveliște',
          ajutor: 'Ce vede cineva în prima secundă: poza mare, titlul și cele două butoane.',
          campuri: [
            { ...TITLU, tip: 'paragraf', ajutor: 'Titlul cel mai mare din site. Scurt și concret.' },
            {
              cheie: 'subtitlu',
              cheieScrisa: 'Subtitlu',
              eticheta: 'Subtitlu',
              tip: 'paragraf',
              ajutor: 'Fraza de sub titlu. Spune unde e locația și ce are ea de special.',
            },
            { cheie: 'poza', cheieScrisa: 'Poza', eticheta: 'Poza mare', tip: 'poza' },
            {
              cheie: 'video',
              cheieScrisa: 'Video',
              eticheta: 'Clip în loc de poză',
              tip: 'video',
              ajutor: 'Numai dacă șablonul e „Hero Video". Lasă gol ca să rămână poza.',
            },
            {
              cheie: 'buton principal',
              cheieScrisa: 'Buton principal',
              eticheta: 'Butonul plin',
              tip: 'text',
              exemplu: 'Verifică disponibilitatea',
            },
            {
              cheie: 'buton secundar',
              cheieScrisa: 'Buton secundar',
              eticheta: 'Butonul cu contur',
              tip: 'text',
              exemplu: 'Vezi camerele',
            },
          ],
        },
        {
          titlu: 'Bandă de încredere',
          eticheta: 'Cifrele de sub poza mare',
          campuri: [
            {
              cheie: 'elemente',
              cheieScrisa: 'Elemente',
              eticheta: 'Elemente',
              tip: 'lista',
              ajutor:
                'Câte unul pe rând, cu linia lungă — între cifră și explicație: „6 trasee — de excursie cu barca".',
              exemplu: '6 trasee — de excursie cu barca în Deltă',
            },
          ],
        },
        {
          titlu: 'Secțiunea de facilități',
          eticheta: 'Titlul secțiunii „Ce găsești aici"',
          ajutor: 'Doar titlul și textul introductiv. Lista propriu-zisă se editează la Facilități.',
          campuri: [ETICHETA, TITLU, TEXT_INTRO],
        },
        {
          titlu: 'Secțiunea de camere',
          eticheta: 'Titlul secțiunii de camere',
          ajutor: 'Doar titlul și textul introductiv. Camerele se editează la Camere.',
          campuri: [ETICHETA, TITLU, TEXT_INTRO],
        },
        {
          titlu: 'Clip de prezentare',
          eticheta: 'Clipul de prezentare',
          ajutor:
            'Apare doar dacă e pornit la Setări ȘI dacă are și clip, și poză de copertă. Nu se redă singur.',
          campuri: [
            ETICHETA,
            TITLU,
            { cheie: 'text', cheieScrisa: 'Text', eticheta: 'Text', tip: 'paragraf' },
            { cheie: 'video', cheieScrisa: 'Video', eticheta: 'Clipul', tip: 'video' },
            {
              cheie: 'poster',
              cheieScrisa: 'Poster',
              eticheta: 'Poza de copertă',
              tip: 'poza',
              ajutor: 'Ce se vede înainte de apăsarea pe play. Fără ea, clipul nu se afișează deloc.',
            },
          ],
        },
        {
          titlu: 'Secțiunea de închidere',
          eticheta: 'Ultimul îndemn, înainte de subsol',
          campuri: [
            ETICHETA,
            TITLU,
            { cheie: 'text', cheieScrisa: 'Text', eticheta: 'Text', tip: 'paragraf' },
            { cheie: 'buton', cheieScrisa: 'Buton', eticheta: 'Butonul', tip: 'text' },
          ],
        },
      ],
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'feature-uri',
    fisier: FISIERE.primaPagina,
    titlu: 'Blocurile poză + text',
    rezumat: 'Cele patru blocuri mari de pe prima pagină: piscina, restaurantul, Delta, pensiunea.',
    undeSeVede: 'Prima pagină, secțiunea cu poze mari alternând stânga-dreapta.',
    icon: 'star',
    forma: {
      fel: 'lista',
      singular: 'bloc',
      plural: 'blocuri',
      campuri: [
        { ...ETICHETA, exemplu: 'Locul' },
        { cheie: 'poza', cheieScrisa: 'Poza', eticheta: 'Poza', tip: 'poza' },
        {
          cheie: 'video',
          cheieScrisa: 'Video',
          eticheta: 'Clip în loc de poză',
          tip: 'video',
          ajutor: 'Opțional. Cu clip, ai nevoie și de poza de copertă de mai jos.',
        },
        { cheie: 'poster video', cheieScrisa: 'Poster video', eticheta: 'Coperta clipului', tip: 'poza' },
        { cheie: 'text', cheieScrisa: 'Text', eticheta: 'Textul', tip: 'paragraf' },
        {
          cheie: 'buline',
          cheieScrisa: 'Buline',
          eticheta: 'Buline',
          tip: 'lista',
          ajutor: 'Câte una pe rând. Pot conține virgule — nu se taie la virgulă.',
        },
        {
          cheie: 'buton',
          cheieScrisa: 'Buton',
          eticheta: 'Butonul',
          tip: 'text',
          ajutor: 'Doar text, sau „Text | adresă": „Vezi excursiile | /oferte".',
          exemplu: 'Vezi camerele',
        },
      ],
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'camere',
    fisier: FISIERE.camere,
    titlu: 'Camerele',
    rezumat: 'Nume, preț, câte persoane, ce pat, poze, dotări, descriere.',
    undeSeVede: 'Secțiunea de camere, pagina /camere și câte o pagină pentru fiecare cameră.',
    icon: 'bed',
    forma: {
      fel: 'lista',
      singular: 'cameră',
      plural: 'camere',
      titluEsteAdresa: true,
      cerePereche: true,
      campuri: [
        {
          cheie: 'pret de la',
          cheieScrisa: 'Preț de la',
          eticheta: 'Preț de la',
          tip: 'numar',
          sufix: 'lei / noapte',
          ajutor: 'Doar cifra. Moneda și „/noapte" le pune site-ul.',
        },
        {
          cheie: 'persoane',
          cheieScrisa: 'Persoane',
          eticheta: 'Câte persoane',
          tip: 'text',
          exemplu: '2 persoane',
        },
        { cheie: 'pat', cheieScrisa: 'Pat', eticheta: 'Patul', tip: 'text', exemplu: 'pat matrimonial 160 × 200' },
        { cheie: 'suprafata', cheieScrisa: 'Suprafață', eticheta: 'Suprafața', tip: 'text', exemplu: '22 m²' },
        {
          cheie: 'poze',
          cheieScrisa: 'Poze',
          eticheta: 'Pozele',
          tip: 'poze',
          ajutor: 'Prima e cea care apare pe card. Trage ca să schimbi ordinea.',
        },
        {
          cheie: 'facilitati',
          cheieScrisa: 'Facilități',
          eticheta: 'Dotări',
          tip: 'icon',
          ajutor: 'Apar ca iconuri pe cardul camerei.',
        },
        {
          cheie: 'eticheta',
          cheieScrisa: 'Etichetă',
          eticheta: 'Bulina de pe card',
          tip: 'text',
          ajutor: 'Un cuvânt sau două, colorate, pe colțul cardului. Gol = fără bulină.',
          exemplu: 'Vedere la lac',
        },
        { cheie: 'video', cheieScrisa: 'Video', eticheta: 'Clipul camerei', tip: 'video' },
        {
          cheie: 'poster video',
          cheieScrisa: 'Poster video',
          eticheta: 'Coperta clipului',
          tip: 'poza',
          ajutor: 'Obligatorie dacă ai pus clip. Fără ea, clipul nu apare.',
        },
      ],
      descriere: {
        eticheta: 'Descrierea camerei',
        ajutor: 'Câteva fraze. Apare pe pagina camerei și în descrierea din Google.',
      },
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'oferte',
    fisier: FISIERE.oferte,
    titlu: 'Ofertele și excursiile',
    rezumat: 'Pachetele de cazare și cele șase trasee cu barca.',
    undeSeVede: 'Secțiunea de oferte, pagina /oferte și câte o pagină pentru fiecare.',
    icon: 'tag',
    forma: {
      fel: 'lista',
      titluEsteAdresa: true,
      cerePereche: true,
      antet: {
        titlu: 'Secțiune',
        eticheta: 'Titlul secțiunii',
        ajutor: 'Antetul de deasupra listei de oferte, pe prima pagină și pe /oferte.',
        campuri: [ETICHETA, TITLU, TEXT_INTRO],
      },
      singular: 'ofertă',
      plural: 'oferte',
      campuri: [
        {
          cheie: 'pret',
          cheieScrisa: 'Preț',
          eticheta: 'Preț',
          tip: 'numar',
          sufix: 'lei',
          ajutor: 'Doar cifra. Gol = pe card apare „Cere ofertă" în loc de preț.',
        },
        {
          cheie: 'pret anterior',
          cheieScrisa: 'Preț anterior',
          eticheta: 'Preț tăiat',
          tip: 'numar',
          sufix: 'lei',
          ajutor: 'Prețul de dinainte de reducere. Apare tăiat, lângă cel nou.',
        },
        {
          cheie: 'unitate',
          cheieScrisa: 'Unitate',
          eticheta: 'Prețul e pentru',
          tip: 'text',
          exemplu: 'de persoană',
        },
        { cheie: 'poza', cheieScrisa: 'Poza', eticheta: 'Poza', tip: 'poza' },
        {
          cheie: 'badge',
          cheieScrisa: 'Badge',
          eticheta: 'Bulina de pe card',
          tip: 'text',
          exemplu: 'Cel mai cerut',
        },
        {
          cheie: 'include',
          cheieScrisa: 'Include',
          eticheta: 'Ce include',
          tip: 'lista',
          ajutor: 'Câte un rând pentru fiecare lucru inclus. Pot conține virgule.',
        },
        {
          cheie: 'valabil',
          cheieScrisa: 'Valabil',
          eticheta: 'Valabilitate',
          tip: 'text',
          exemplu: 'mai – septembrie',
        },
      ],
      descriere: {
        eticheta: 'Detalii',
        ajutor: 'Condiții, prețuri pe luni, ce nu e inclus. Apare pe pagina ofertei.',
      },
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'facilitati',
    fisier: FISIERE.facilitati,
    titlu: 'Facilitățile',
    rezumat: 'Lista „Ce găsești aici": piscina, restaurantul, pontoanele, parcarea.',
    undeSeVede: 'Secțiunea de facilități de pe prima pagină.',
    icon: 'pool',
    forma: {
      fel: 'lista',
      singular: 'facilitate',
      plural: 'facilități',
      campuri: [
        {
          cheie: 'icon',
          cheieScrisa: 'Icon',
          eticheta: 'Iconul',
          tip: 'icon',
          ajutor: 'Un singur icon, cel care descrie cel mai bine facilitatea.',
        },
        { cheie: 'text', cheieScrisa: 'Text', eticheta: 'Textul', tip: 'paragraf' },
      ],
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'recenzii',
    fisier: FISIERE.recenzii,
    titlu: 'Recenziile',
    rezumat: 'Ce spun oaspeții, cu autorul și sursa.',
    undeSeVede: 'Secțiunea de recenzii de pe prima pagină.',
    icon: 'star',
    forma: {
      fel: 'lista',
      singular: 'recenzie',
      plural: 'recenzii',
      campuri: [
        { cheie: 'autor', cheieScrisa: 'Autor', eticheta: 'Cine a scris', tip: 'text', exemplu: 'Andrei M.' },
        {
          cheie: 'sursa',
          cheieScrisa: 'Sursă',
          eticheta: 'De unde vine',
          tip: 'text',
          ajutor:
            'OBLIGATORIU. O recenzie fără sursă nu se afișează pe site — e cerință legală, nu o alegere de design.',
          exemplu: 'Google',
        },
        { cheie: 'data', cheieScrisa: 'Data', eticheta: 'Data', tip: 'text', exemplu: 'august 2025' },
        { cheie: 'nota', cheieScrisa: 'Notă', eticheta: 'Nota', tip: 'numar', sufix: 'din 5' },
      ],
      descriere: { eticheta: 'Textul recenziei' },
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'intrebari',
    fisier: FISIERE.faq,
    titlu: 'Întrebările frecvente',
    rezumat: 'Întrebările pe care le pun oaspeții, cu răspunsurile.',
    undeSeVede: 'Secțiunea de întrebări de pe prima pagină.',
    icon: 'shield',
    forma: {
      fel: 'lista',
      singular: 'întrebare',
      plural: 'întrebări',
      campuri: [],
      descriere: {
        eticheta: 'Răspunsul',
        ajutor: 'Titlul elementului e întrebarea; aici scrii răspunsul.',
      },
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'contact',
    fisier: FISIERE.contact,
    titlu: 'Telefon, e-mail, adresă',
    rezumat: 'Datele de contact, orele de check-in, coordonatele pentru hartă.',
    undeSeVede: 'Subsolul, pagina de contact, bara de jos de pe telefon, harta.',
    icon: 'phone',
    forma: {
      fel: 'fixe',
      blocuri: [
        {
          titlu: 'Telefon',
          campuri: [
            {
              cheie: 'telefon',
              cheieScrisa: 'Telefon',
              eticheta: 'Număr pentru apelare',
              tip: 'text',
              ajutor: 'Cu prefix de țară, fără spații: așa se formează la apăsare pe telefon.',
              exemplu: '+40740123456',
            },
            {
              cheie: 'telefon afisat',
              cheieScrisa: 'Telefon afișat',
              eticheta: 'Cum se scrie pe site',
              tip: 'text',
              exemplu: '0740 123 456',
            },
            {
              cheie: 'whatsapp',
              cheieScrisa: 'WhatsApp',
              eticheta: 'WhatsApp',
              tip: 'text',
              ajutor: 'Cu prefix de țară. Gol = butonul verde și bara de jos nu apar.',
              exemplu: '+40740123456',
            },
          ],
        },
        {
          titlu: 'Email',
          campuri: [{ cheie: 'email', cheieScrisa: 'Email', eticheta: 'E-mail', tip: 'text' }],
        },
        {
          titlu: 'Adresă',
          campuri: [
            { cheie: 'strada', cheieScrisa: 'Stradă', eticheta: 'Strada și numărul', tip: 'text' },
            { cheie: 'oras', cheieScrisa: 'Oraș', eticheta: 'Localitatea', tip: 'text' },
            { cheie: 'judet', cheieScrisa: 'Județ', eticheta: 'Județul', tip: 'text' },
            { cheie: 'cod postal', cheieScrisa: 'Cod poștal', eticheta: 'Codul poștal', tip: 'text' },
            { cheie: 'tara', cheieScrisa: 'Țară', eticheta: 'Țara', tip: 'text' },
          ],
        },
        {
          titlu: 'Coordonate GPS',
          eticheta: 'Locul pe hartă',
          ajutor:
            'Se iau din Google Maps: click dreapta pe locație, apoi pe cifrele de sus. Se scriu cu PUNCT, nu cu virgulă.',
          campuri: [
            { cheie: 'latitudine', cheieScrisa: 'Latitudine', eticheta: 'Latitudine', tip: 'text', exemplu: '45.03' },
            { cheie: 'longitudine', cheieScrisa: 'Longitudine', eticheta: 'Longitudine', tip: 'text', exemplu: '29.16' },
            {
              cheie: 'link google maps',
              cheieScrisa: 'Link Google Maps',
              eticheta: 'Link către Google Maps',
              tip: 'text',
            },
          ],
        },
        {
          titlu: 'Program',
          campuri: [
            { cheie: 'check-in', cheieScrisa: 'Check-in', eticheta: 'Check-in de la', tip: 'text', exemplu: '14.00' },
            { cheie: 'check-out', cheieScrisa: 'Check-out', eticheta: 'Check-out până la', tip: 'text', exemplu: '12.00' },
            { cheie: 'receptie', cheieScrisa: 'Recepție', eticheta: 'Programul recepției', tip: 'text' },
          ],
        },
        {
          titlu: 'Rețele sociale',
          ajutor: 'Adresa completă a paginii. Gol = iconul nu apare în subsol.',
          campuri: [
            { cheie: 'facebook', cheieScrisa: 'Facebook', eticheta: 'Facebook', tip: 'text' },
            { cheie: 'instagram', cheieScrisa: 'Instagram', eticheta: 'Instagram', tip: 'text' },
            { cheie: 'tiktok', cheieScrisa: 'TikTok', eticheta: 'TikTok', tip: 'text' },
            { cheie: 'youtube', cheieScrisa: 'YouTube', eticheta: 'YouTube', tip: 'text' },
          ],
        },
      ],
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'identitate',
    fisier: FISIERE.identitate,
    titlu: 'Nume, logo, descriere',
    rezumat: 'Numele pensiunii, sloganul, logo-ul, descrierea care apare în Google.',
    undeSeVede: 'Antetul, subsolul, titlul din fila browserului, rezultatele Google.',
    icon: 'name',
    forma: {
      fel: 'fixe',
      blocuri: [
        {
          titlu: 'Nume',
          campuri: [
            { cheie: 'nume', cheieScrisa: 'Nume', eticheta: 'Numele complet', tip: 'text' },
            {
              cheie: 'nume scurt',
              cheieScrisa: 'Nume scurt',
              eticheta: 'Numele scurt',
              tip: 'text',
              ajutor: 'Pentru locurile strâmte, cum e titlul filei din browser.',
            },
          ],
        },
        {
          titlu: 'Slogan',
          campuri: [{ cheie: 'slogan', cheieScrisa: 'Slogan', eticheta: 'Sloganul', tip: 'text' }],
        },
        {
          titlu: 'Clasificare',
          campuri: [
            {
              cheie: 'stele',
              cheieScrisa: 'Stele',
              eticheta: 'Margarete sau stele',
              tip: 'numar',
              ajutor: 'Gol = nu se afișează nicio clasificare.',
            },
            { cheie: 'tip', cheieScrisa: 'Tip', eticheta: 'Tipul locației', tip: 'text', exemplu: 'pensiune' },
          ],
        },
        {
          titlu: 'Logo',
          campuri: [
            {
              cheie: 'logo',
              cheieScrisa: 'Logo',
              eticheta: 'Logo-ul',
              tip: 'poza',
              ajutor: 'De preferat cu fundal transparent (.png sau .svg).',
            },
          ],
        },
        {
          titlu: 'Descriere scurtă',
          eticheta: 'Descrierea din Google',
          ajutor:
            'Fraza care apare sub titlu în rezultatele căutării. Între 120 și 160 de caractere e ideal.',
          campuri: [{ cheie: 'descriere', cheieScrisa: 'Descriere', eticheta: 'Descrierea', tip: 'paragraf' }],
        },
      ],
    },
  },

  /* -------------------------------------------------------------- */
  {
    id: 'rezervari',
    fisier: FISIERE.rezervari,
    titlu: 'Textele de rezervare',
    rezumat: 'Ce scrie pe butoane și pe bara de căutare.',
    undeSeVede: 'Butonul „Verifică disponibilitatea", bara de disponibilitate, cardurile de ofertă.',
    icon: 'calendar',
    forma: {
      fel: 'fixe',
      blocuri: [
        {
          titlu: 'Etichete',
          eticheta: 'Textele butoanelor și ale barei',
          campuri: [
            { cheie: 'text buton', cheieScrisa: 'Text buton', eticheta: 'Butonul principal', tip: 'text' },
            {
              cheie: 'buton oferta',
              cheieScrisa: 'Buton ofertă',
              eticheta: 'Butonul pentru „se cotează"',
              tip: 'text',
              ajutor:
                'Apare în locul prețului pe ofertele fără preț fix — excursiile, unde tariful depinde de vreme și de numărul de persoane.',
              exemplu: 'Cere ofertă',
            },
            { cheie: 'sosire', cheieScrisa: 'Sosire', eticheta: 'Eticheta „Sosire"', tip: 'text' },
            { cheie: 'plecare', cheieScrisa: 'Plecare', eticheta: 'Eticheta „Plecare"', tip: 'text' },
            { cheie: 'persoane', cheieScrisa: 'Persoane', eticheta: 'Eticheta „Oaspeți"', tip: 'text' },
            {
              cheie: 'optiuni persoane',
              cheieScrisa: 'Opțiuni persoane',
              eticheta: 'Opțiunile din listă',
              tip: 'etichete',
              ajutor: 'Ce se poate alege la numărul de oaspeți.',
            },
            {
              cheie: 'asigurari',
              cheieScrisa: 'Asigurări',
              eticheta: 'Sub buton, mărunt',
              tip: 'etichete',
              ajutor: 'Trei lucruri liniștitoare, scurte: avans, vouchere, timp de răspuns.',
            },
          ],
        },
      ],
    },
  },
]

/* ------------------------------------------------------------------ */

export function fisierPanou(id: string): Fisier | undefined {
  return FISIERE_PANOU.find((f) => f.id === id)
}

/** Toate câmpurile unui fișier — pentru validare la salvare. */
export function campuriDin(f: Fisier): Camp[] {
  if (f.forma.fel === 'fixe') return f.forma.blocuri.flatMap((b) => b.campuri)
  return [...(f.forma.antet?.campuri ?? []), ...f.forma.campuri]
}
