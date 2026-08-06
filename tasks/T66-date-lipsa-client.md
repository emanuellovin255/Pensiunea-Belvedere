# T66 · Date care lipsesc — de cerut clientului

**Depinde de:** —
**Stare:** ⬜ blocant de publicare

Site-ul e complet și trece verificarea, dar câteva date nu există nicăieri: nici pe
belvederemurighiol.ro, nici pe Facebook, nici în PDF-ul meniului. Nu se pot deduce și nu se pot
inventa. Până vin, site-ul poate merge pe un domeniu de test, nu pe cel final.

---

## 1. Prețurile reale ale celor 6 camere — blocant

Toate cele 6 camere din `date/04-camere.md` au acum `Preț de la: 300`, un placeholder pe care
l-ai păstrat conștient. Un preț greșit afișat public e practică comercială incorectă.

**De cerut:** prețul pe noapte pentru fiecare cameră, cu sezonul de care ține (site-ul lor
diferențiază prețul pe luni la pachete, deci probabil și la camere).

**Unde se pune:** `Preț de la:` în fiecare bloc `##` din `date/04-camere.md`. Prețul intră
automat și în JSON-LD, deci în Google.

---

## 2. Coordonatele GPS — de confirmat, nu de cerut

`date/02-contact.md` are acum `45.053429868667216, 29.149477073274277`, deci harta se randează.
Coordonatele sunt însă deduse automat de `npm run analiza` din adresă, nu preluate de la ei —
pe site și pe Facebook nu există niciun link de hartă. Cad pe malul Lacului Murighiol, dar nu
neapărat pe clădirea exactă.

**De confirmat:** cere-le linkul locației lor din Google Business și înlocuiește cele două
câmpuri dacă diferă. Un pin greșit cu 200 m trimite oaspeții pe drumul greșit.

---

## 3. Nota medie Google și numărul de recenzii

`date/08-recenzii.md` are 5 recenzii reale, cu autor și sursă, preluate de pe pagina lor de
testimoniale. Blocul `## Nota medie` lipsește **intenționat**: o notă inventată în schema.org
e o problemă reală, nu o formalitate — Google penalizează AggregateRating fabricat.

**De cerut:** nota medie și numărul total de recenzii de pe profilul lor Google Business,
plus link-ul profilului.

**Unde se pune:** blocul comentat din capul lui `date/08-recenzii.md` — se decomentează și
se completează.

---

## 4. Data fiecărei recenzii

Cele 5 recenzii au `Data:` gol. Nu blochează afișarea, dar o recenzie datată e mai credibilă
și e câmp valid în schema.org.

---

## Două lucruri de confirmat, nu de cerut

**Pachetul de Paște.** Pe `/pagina-5` scrie „PACHET PAŞTE 2026", dar intervalul „10.04-13.04.**2025**".
Anul din interval e greșeală de tipar la ei — Paștele ortodox din 2026 cade pe 12 aprilie, deci
10–13 aprilie 2026 e corect, și așa l-am scris. Confirmă înainte de publicare.

**Oferta de Sfânta Maria.** Există un banner „14–17 august, 1900 lei/persoană", fără an și fără
ce include. Nu l-am publicat — o ofertă fără an și fără conținut nu se poate publica. Cere
detaliile și devine al treilea pachet în `date/06-oferte.md`.

**Prețurile excursiilor.** Cele 8 trasee n-au tarif publicat nicăieri. Cardurile arată acum doar
titlu, poză și descriere, iar butonul duce la formular. Când primești tarifele, se adaugă
`Preț:` și `Unitate:` la fiecare bloc și apar automat, inclusiv în schema Offer.
