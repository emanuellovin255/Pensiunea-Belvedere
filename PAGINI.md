# Toate paginile site-ului

Lista completă, cu adresa în română și în engleză, cu ce se vede pe fiecare și din ce
fișier vine fiecare bucată.

**22 de pagini în română, 22 în engleză** — 44 în total, din 11 feluri de pagini.
Ele sunt exact paginile din `sitemap.xml`: sitemap-ul se generează din aceleași date, deci
nu poate lista o pagină care nu există.

Pentru drumul scurt („vreau să schimb X, unde mă duc?") vezi [`README.md`](README.md).

---

## 1 · Prima pagină

| | |
|---|---|
| **Adresa** | `/` · în engleză: `/en` |
| **Șablonul** | 2 — „Poveste alternantă" (`setari.md` → `## Șablon`) |

Secțiunile apar în ordinea din `setari.md` → `## Secțiuni pe prima pagină`. Ștergi un rând
de acolo și secțiunea dispare; muți rândul și se mută secțiunea.

| # | Secțiunea | Ce se vede | De unde vine |
|---|---|---|---|
| — | **Prima secțiune** | poza mare de sus, titlul, subtitlul, două butoane | `03-pagina-principala.md` → `## Prima secțiune` |
| — | **Bara de disponibilitate** | Sosire / Plecare / Oaspeți + butonul | `10-rezervari-si-plati.md` → `## Etichete` |
| 1 | **Bandă de încredere** | cifrele scurte de sub poza mare | `03-pagina-principala.md` → `## Bandă de încredere` |
| 2 | **Facilități** | „Ce găsești aici", cu iconuri | titlu: `03-…` → `## Secțiunea de facilități` · lista: `05-facilitati.md` |
| 3 | **Camere** | cardurile celor șase camere | titlu: `03-…` → `## Secțiunea de camere` · camerele: `04-camere.md` |
| 4 | **Feature-uri alternante** | patru blocuri poză + text: piscina, restaurantul, Delta, pensiunea văzută dinspre lac | `03-pagina-principala.md` → `## Feature-uri alternante` (blocurile `###`) |
| 5 | **Clip de prezentare** | `prezentare-pensiune.mp4`, cu poza de copertă | `03-pagina-principala.md` → `## Clip de prezentare` |
| 6 | **Oferte** | pachetele și excursiile | `06-oferte-si-excursii.md` |
| 7 | **Recenzii** | citatele oaspeților și nota medie | `08-recenzii.md` |
| 8 | **Meniu restaurant** | specialitățile casei + „Vezi meniul complet" | `07-meniu-restaurant.md` |
| 9 | **Hartă** | harta Google, încărcată la click | coordonatele din `02-telefon-email-si-adresa.md` |
| 10 | **Întrebări frecvente** | acordeonul cu întrebări | `09-intrebari-frecvente.md` |
| 11 | **Secțiune de închidere** | ultimul îndemn, înainte de subsol | `03-pagina-principala.md` → `## Secțiunea de închidere` |

---

## 2 · Camere (lista)

| | |
|---|---|
| **Adresa** | `/camere` · `/en/rooms` |
| **Din** | `04-camere.md` (engleza: `en/04-camere.md`) |

Toate camerele, cu preț de la, câte persoane, ce pat, suprafață și prima poză.

## 3 · O cameră anume — 6 pagini

| Adresa în română | Adresa în engleză |
|---|---|
| `/camere/camera-dubla-cu-balcon` | `/en/rooms/double-room-with-balcony` |
| `/camere/suita-de-familie-cu-balcon-5-persoane` | `/en/rooms/family-suite-with-balcony-5-people` |
| `/camere/camera-cvadrupla-cu-balcon` | `/en/rooms/quadruple-room-with-balcony` |
| `/camere/suita-de-familie-4-persoane` | `/en/rooms/family-suite-4-people` |
| `/camere/camera-tripla-fara-balcon` | `/en/rooms/triple-room-without-balcony` |
| `/camere/camera-dubla-fara-balcon` | `/en/rooms/double-room-without-balcony` |

Fiecare are: galeria de poze, clipul camerei (dacă are), preț, dotări, descriere, buton de
rezervare. Toate vin din blocul `##` al camerei din `04-camere.md`.

> **Adresa se face din titlul `##`.** Schimbi titlul → se schimbă adresa, iar ce era
> indexat în Google o ia de la capăt. Titlurile camerelor merită schimbate rar.

---

## 4 · Oferte (lista)

| | |
|---|---|
| **Adresa** | `/oferte` · `/en/offers` |
| **Din** | `06-oferte-si-excursii.md`, plus antetul din blocul `## Secțiune` |

## 5 · O ofertă sau o excursie — 8 pagini

| Adresa în română | Adresa în engleză |
|---|---|
| `/oferte/pachet-promotional-3-nopti-si-4-zile` | `/en/offers/promotional-package-3-nights-and-4-days` |
| `/oferte/pachet-paste-2026` | `/en/offers/easter-package-2026` |
| `/oferte/excursie-plaja-sulina` | `/en/offers/boat-trip-sulina-beach` |
| `/oferte/excursie-plaja-sfantu-gheorghe` | `/en/offers/boat-trip-sfantu-gheorghe-beach` |
| `/oferte/excursie-padurea-letea` | `/en/offers/boat-trip-the-letea-forest` |
| `/oferte/excursie-padurea-caraorman` | `/en/offers/boat-trip-the-caraorman-forest` |
| `/oferte/excursie-sapte-lacuri-din-delta` | `/en/offers/boat-trip-seven-lakes-of-the-delta` |
| `/oferte/excursie-mila-23` | `/en/offers/boat-trip-mila-23` |

Primele două sunt pachete de cazare, celelalte șase sunt trasee de excursie cu barca.
Toate din blocurile `##` ale lui `06-oferte-si-excursii.md`.

---

## 6 · Meniu

| | |
|---|---|
| **Adresa** | `/meniu` · `/en/menu` |
| **Din** | `07-meniu-restaurant.md` |

Meniul complet, indexabil: `##` e categoria, `###` e preparatul, cu preț, gramaj,
alergeni și valori nutriționale. Jos e și linkul către PDF, dacă `setari.md` →
`Meniu PDF:` are o cale.

Modulul se pornește din `setari.md` → `## Module` → `Meniu restaurant`. Ca să apară **și**
pe prima pagină, trebuie trecut **și** la `## Secțiuni pe prima pagină`.

---

## 7 · Contact

| | |
|---|---|
| **Adresa** | `/contact` · `/en/contact` |
| **Din** | `02-telefon-email-si-adresa.md` |

Telefon, WhatsApp, e-mail, adresă, program, harta, formularul de contact.
Formularul trimite pe e-mail prin Resend și e protejat de Turnstile — cheile stau în
variabilele de mediu, nu în `date/`.

## 8 · Mulțumim

| | |
|---|---|
| **Adresa** | `/multumim` |
| **Din** | textele site-ului, nu din `date/` |

Pagina de după trimiterea formularului. Nu e în meniu și nu e în sitemap.

---

## 9–11 · Paginile legale

Toate din `12-firma-si-documente-legale.md`. Își păstrează adresa românească și pe `/en` —
sunt documente cerute de legea română.

| Pagina | Adresa | Blocul din fișier |
|---|---|---|
| **Termeni și condiții** | `/termeni` · `/en/termeni` | `## Documente legale` → `Termeni și condiții:` |
| **Politica de confidențialitate** | `/politica-confidentialitate` · `/en/politica-confidentialitate` | `## Documente legale` + `## Responsabil protecția datelor` |
| **Politica de cookies** | `/politica-cookies` · `/en/politica-cookies` | `## Documente legale` → `Politica de cookies:` |
| **Politica de anulare** | `/politica-anulare` · `/en/politica-anulare` | `## Politica de anulare — textul` |

Datele firmei din subsol (denumire, CUI, Nr. Reg. Com., ANPC, SOL) vin din blocurile
`## Firmă`, `## Autorizații` și `## Link-uri obligatorii în footer` din același fișier.

---

## Pe orice pagină

| Ce se vede | De unde vine |
|---|---|
| **Antetul** — logo + meniul de sus | logo: `01-nume-logo-si-descriere.md` · butonul: `10-rezervari-si-plati.md` |
| **Comutatorul RO / EN** | automat, din `setari.md` → `Engleză: da` |
| **Bara de jos, pe telefon** — sună / WhatsApp / disponibilitate | `02-telefon-email-si-adresa.md` |
| **Butonul verde de WhatsApp** | numărul din `02-…`, pornit din `setari.md` → `Buton WhatsApp` |
| **Subsolul** — adresă, program, firmă, ANPC, link-uri legale | `02-…` + `12-firma-si-documente-legale.md` |
| **Bannerul de cookies** | textele site-ului; Analytics se încarcă doar după accept |
| **Culorile și fonturile** | `11-culori-si-fonturi.md` |

---

## Pagini care există în motor, dar sunt OPRITE acum

Se pornesc din `setari.md` → `## Module`, sau din panou, la **Setări**. Textele lor nu
există încă — trebuie scrise.

| Pagina | Adresa pe care ar avea-o | Ce ar trebui completat |
|---|---|---|
| **Zona** — atracții și distanțe | `/zona` · `/en/area` | un fișier `date/13-zona-si-atractii.md` |
| **Galerie extinsă** | `/galerie` · `/en/gallery` | nimic — se construiește din pozele deja folosite |
| **Spații de evenimente** | `/evenimente` · `/en/events` | secțiune de evenimente în `03-pagina-principala.md` |

---

## Pagini tehnice

Nu se editează și nu apar în meniu.

| Adresa | Ce e |
|---|---|
| `/sitemap.xml` | lista celor 44 de pagini, pentru Google. Se generează din date |
| `/robots.txt` | ce are voie să indexeze un crawler. `/admin`, `/api/` și `/probe/` sunt interzise |
| `/llms.txt` | rezumatul site-ului pentru asistenții AI (ChatGPT, Perplexity, Claude) |
| `/icon` | favicon-ul, generat din logo |
| `/admin` | panoul de administrare. Cere parolă, nu se indexează |
| `/probe/sectiuni`, `/probe/formular`, `/probe/iconuri` | pagini de test ale motorului. Nu se indexează |
