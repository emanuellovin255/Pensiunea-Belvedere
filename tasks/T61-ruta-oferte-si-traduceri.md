# T61 · Ruta `/oferte/[slug]` și titlurile de secțiune traductibile

**Depinde de:** T05, T07, T08
**Se editează în:** `~/Desktop/Structura Resorturi/_motor/` — acolo e originalul. Copia din
acest folder vine prin `client-nou` / `actualizeaza-motor`; o corecție făcută direct în copie
se pierde la prima actualizare.

## Obiectiv

Două defecte de motor, descoperite pregătind primul client real. Amândouă lovesc orice client,
nu doar Belvedere.

## Defectul 1 — fiecare ofertă duce în 404

`_motor/lib/continut/index.ts:478` construiește:

```ts
href: `/oferte/${slug(b.titlu)}`
```

iar `Oferte.tsx:38` folosește acel href. Dar în `_motor/app/[limba]/` **nu există nicio rută
`oferte`**. Singura rută dinamică e `camere/[slug]`. Deci fiecare card de ofertă publicat până
acum trimite vizitatorul într-un 404.

La Belvedere sunt 9 astfel de carduri: 2 pachete turistice și 7 trasee de excursie în Deltă. Cele
7 trasee sunt principalul lor diferențiator față de orice altă pensiune din Murighiol și fiecare
merită o pagină proprie, indexabilă — „excursie Pădurea Letea din Murighiol" e o căutare reală.

**De făcut:** `_motor/app/[limba]/oferte/page.tsx` și `_motor/app/[limba]/oferte/[slug]/page.tsx`,
construite **după modelul existent** `camere/[slug]/page.tsx`:

- același `generateStaticParams`, inclusiv logica de a sări `en` când `!setari.module.engleza`
- același tipar de `generateMetadata` cu canonical și hreflang din `lib/seo/meta.ts`
- `notFound()` pe slug necunoscut
- JSON-LD `Offer` unde există preț

`lib/i18n/rute.ts` are deja perechea `oferte↔offers`. Nu se atinge.

Componenta de pagină reia structura din `PaginaCamera.tsx` — titlu, imagine, text, preț, CTA. Dacă
diferența ajunge cosmetică, se extrage partea comună; dacă nu, rămân separate. Nu se forțează o
abstracție peste două cazuri.

## Defectul 2 — patru titluri hardcodate în română

`_motor/lib/continut/index.ts:727-731`:

```ts
offers:  { section: { eyebrow: '', title: 'Oferte', lede: '' }, ... }
events:  { section: { eyebrow: '', title: 'Evenimente', lede: '' }, ... }
reviews: { section: { eyebrow: '', title: 'Ce spun oaspeții', lede: '' }, ... }
faq:     { section: { eyebrow: '', title: 'Întrebări frecvente' }, ... }
```

plus `rating.label = 'Nota oaspeților'`.

Pe `/en` apare „Ce spun oaspeții" deasupra unor recenzii în engleză. T08 e formal ✅, dar patru
titluri scapă prin plasă.

**De făcut:** fiecare se citește dintr-un bloc `## Secțiune` (`Eticheta:`, `Titlu:`,
`Text introductiv:`) din fișierul propriu — `06-oferte.md`, `08-recenzii.md`,
`09-intrebari-frecvente.md` — cu fallback pe valoarea actuală când blocul lipsește. Fișierele
din `en/` îl traduc, ca orice alt conținut.

Blocul se adaugă și în `clienti/_sablon-client/date/`, comentat, ca următorul client să-l vadă.

## Criteriu de terminare

- [ ] `/oferte` și `/oferte/<slug>` răspund 200 în RO și `/en/offers/<slug>` în EN
- [ ] Slug inexistent → 404 propriu, nu eroare de build
- [ ] Ambele rute apar în `sitemap.xml` cu hreflang corect
- [ ] Rich Results Test trece pe o pagină de ofertă cu preț
- [ ] `/en` nu mai conține niciun titlu de secțiune în română
- [ ] Un client fără blocul `## Secțiune` se randează neschimbat — zero regresie
- [ ] `npm run verifica` nu mai raportează linkuri moarte din cardurile de ofertă
