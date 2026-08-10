# Site-ul Pensiunii Belvedere — ghid de modificare

Aici stă tot ce se vede pe site: texte, prețuri, poze, meniul restaurantului, orele de
check-in, datele de contact.

**Nu trebuie să știi programare ca să schimbi ceva.** Ai două drumuri, amândouă duc în
același loc:

| | Drumul | Pentru cine |
|---|---|---|
| **1** | **Panoul de administrare** — intri pe `/admin`, apeși pe ce vrei să schimbi, scrii, salvezi | drumul normal, de zi cu zi |
| **2** | **Fișierele din GitHub** — deschizi fișierul, dai click pe creion, schimbi textul | când vrei să vezi tot dintr-o privire, sau când panoul nu are ce-ți trebuie |

Amândouă scriu în **aceleași fișiere**. Ce salvezi din panou se vede în GitHub și invers.
Nu trebuie să alegi unul și să te ții de el.

---

## Drumul 1: panoul de administrare

Adresa: **`adresa-site-ului.ro/admin`**. Scrii parola, intri.

Panoul are cinci intrări mari:

| Intrarea | Ce schimbi de acolo |
|---|---|
| **Prima pagină** | titlul mare de sus, poza mare, „Povestea noastră", cifrele de încredere, blocurile poză + text, textul de final |
| **Camerele** | nume, preț, câte persoane, ce pat, poze, dotări, descriere. Adaugi o cameră nouă sau scoți una |
| **Ofertele și excursiile** | pachetele, prețurile, ce include fiecare, excursiile cu barca |
| **Pozele** | tragi o poză de pe telefon, o alegi la o cameră sau la o ofertă. Panoul o micșorează singur |
| **Setări** | ce secțiuni apar pe prima pagină și în ce ordine, ce pagini sunt pornite |

Plus: recenziile, întrebările frecvente, meniul restaurantului, datele de contact,
culorile și fonturile.

**Ce nu poate face panoul:** un **tip nou de pagină** cere cod. Panoul aprinde și stinge
paginile care există deja (Meniu, Zona, Galerie) și adaugă **elemente** în cele existente
(o cameră nouă, o ofertă nouă, o recenzie), dar nu inventează pagini noi. Nici design-ul
nu se schimbă de acolo, în afară de culori și fonturi.

**După fiecare salvare, site-ul se reface în 1–2 minute.** Panoul îți spune când e gata.

Instalarea panoului (o dată, la început): [`ADMIN.md`](ADMIN.md).

---

## Drumul 2: fișierele. Cel mai scurt drum: „vreau să schimb…"

| Vreau să schimb | Deschid fișierul |
|---|---|
| Numele pensiunii, sloganul, logo-ul, descrierea din Google | [`date/01-nume-logo-si-descriere.md`](date/01-nume-logo-si-descriere.md) |
| Telefonul, WhatsApp-ul, e-mailul, adresa, orele de check-in | [`date/02-telefon-email-si-adresa.md`](date/02-telefon-email-si-adresa.md) |
| Titlul mare de pe prima pagină, poza de sus, blocurile poză + text | [`date/03-pagina-principala.md`](date/03-pagina-principala.md) |
| Camerele: nume, preț, poze, dotări | [`date/04-camere.md`](date/04-camere.md) |
| Lista „Ce găsești aici" (piscină, restaurant, pontoane…) | [`date/05-facilitati.md`](date/05-facilitati.md) |
| Pachetele turistice și excursiile cu barca | [`date/06-oferte-si-excursii.md`](date/06-oferte-si-excursii.md) |
| Meniul restaurantului, cu prețuri | [`date/07-meniu-restaurant.md`](date/07-meniu-restaurant.md) |
| Recenziile oaspeților | [`date/08-recenzii.md`](date/08-recenzii.md) |
| Întrebările frecvente | [`date/09-intrebari-frecvente.md`](date/09-intrebari-frecvente.md) |
| Butonul „Verifică disponibilitatea" și textele de rezervare | [`date/10-rezervari-si-plati.md`](date/10-rezervari-si-plati.md) |
| Culorile și fonturile site-ului | [`date/11-culori-si-fonturi.md`](date/11-culori-si-fonturi.md) |
| Datele firmei din subsol, CUI, documentele legale | [`date/12-firma-si-documente-legale.md`](date/12-firma-si-documente-legale.md) |
| **Pozele** — adaug una nouă sau înlocuiesc una | folderul [`poze/`](poze/) → [ghidul de acolo](poze/README.md) |
| Textele în engleză | folderul [`en/`](en/) → [ghidul de acolo](en/README.md) |
| Ce secțiuni apar pe prima pagină, în ce ordine | [`setari.md`](setari.md) |

> Fiecare fișier are, chiar în capul lui, o explicație a ceea ce controlează.
> Deschide-l și citește primele rânduri înainte să schimbi ceva.

---

## Harta site-ului: ce pagină, ce secțiune, ce fișier

Site-ul are **11 feluri de pagini**, adică 22 de pagini în română și tot atâtea în
engleză. Lista completă, cu adresele lor: **[PAGINI.md](PAGINI.md)**. Mai jos, pe scurt.

### Peste tot, pe orice pagină

| Ce se vede | Fișierul |
|---|---|
| **Antetul** (logo + meniul de sus) | logo: `01-nume-logo-si-descriere.md` · butonul de rezervare: `10-rezervari-si-plati.md` |
| **Bara de jos, pe telefon** (sună / WhatsApp / disponibilitate) | `02-telefon-email-si-adresa.md` |
| **Butonul verde de WhatsApp** | `02-telefon-email-si-adresa.md` (se pornește din `setari.md`) |
| **Subsolul** (adresă, program, firmă, ANPC, link-uri legale) | `02-telefon-email-si-adresa.md` + `12-firma-si-documente-legale.md` |

### Prima pagină (adresa `/`)

Secțiunile apar în ordinea din `setari.md`. De sus în jos, așa cum e acum:

| # | Secțiunea, așa cum se vede | Fișierul din care vine |
|---|---|---|
| 1 | **Prima secțiune** — poza mare de sus, titlul, cele două butoane | `03-pagina-principala.md` → blocul `## Prima secțiune` |
| 2 | **Bandă de încredere** — cifrele scurte de sub poza mare | `03-pagina-principala.md` → `## Bandă de încredere` |
| 3 | **Facilități** — „Ce găsești aici", cu iconuri | titlul: `03-pagina-principala.md` → `## Secțiunea de facilități` · lista: `05-facilitati.md` |
| 4 | **Camere** — cardurile cu cele șase camere | titlul: `03-pagina-principala.md` → `## Secțiunea de camere` · camerele: `04-camere.md` |
| 5 | **Feature-uri alternante** — cele patru blocuri poză + text (piscina, restaurantul, Delta, pensiunea) | `03-pagina-principala.md` → `## Feature-uri alternante` |
| 6 | **Clip de prezentare** — filmul, cu poza de copertă | `03-pagina-principala.md` → `## Clip de prezentare` |
| 7 | **Oferte** — pachetele și excursiile | `06-oferte-si-excursii.md` |
| 8 | **Recenzii** — citatele oaspeților și nota medie | `08-recenzii.md` |
| 9 | **Meniu restaurant** — specialitățile casei + „Vezi meniul complet" | `07-meniu-restaurant.md` |
| 10 | **Hartă** — harta Google cu locația | coordonatele din `02-telefon-email-si-adresa.md` |
| 11 | **Întrebări frecvente** | `09-intrebari-frecvente.md` |
| 12 | **Secțiune de închidere** — ultimul îndemn, înainte de subsol | `03-pagina-principala.md` → `## Secțiunea de închidere` |

Secțiuni și pagini care **există în motor, dar sunt oprite acum** din `setari.md`:
spațiile de evenimente, galeria extinsă, pagina „Zona". Se pornesc de acolo, sau din
panou, de la **Setări**.

### Celelalte pagini

| Pagina | Adresa | Din ce fișier |
|---|---|---|
| **Camere** | `/camere` | `04-camere.md` |
| **O cameră anume** (×6) | `/camere/camera-dubla-cu-balcon` | `04-camere.md`, blocul camerei |
| **Oferte** | `/oferte` | `06-oferte-si-excursii.md` |
| **O ofertă sau o excursie** (×8) | `/oferte/pachet-paste-2026` | `06-oferte-si-excursii.md`, blocul ei |
| **Meniu** | `/meniu` | `07-meniu-restaurant.md` |
| **Contact** | `/contact` | `02-telefon-email-si-adresa.md` |
| **Mulțumim** (după trimiterea formularului) | `/multumim` | text al site-ului, nu se editează din `date/` |
| **Termeni** | `/termeni` | `12-firma-si-documente-legale.md` |
| **Politica de confidențialitate** | `/politica-confidentialitate` | `12-firma-si-documente-legale.md` |
| **Politica de cookies** | `/politica-cookies` | `12-firma-si-documente-legale.md` |
| **Politica de anulare** | `/politica-anulare` | `12-firma-si-documente-legale.md` |

Fiecare pagină are și varianta în engleză, sub `/en` — vezi [`en/README.md`](en/README.md).

> **Lista completă, pagină cu pagină**, cu adresa în română și în engleză, cu tot ce se
> vede pe fiecare și de unde vine fiecare bucată: **[PAGINI.md](PAGINI.md)**.
> Tot acolo sunt și paginile tehnice (`sitemap.xml`, `robots.txt`, paginile de test).

---

## Cum modifici, pas cu pas, direct din GitHub

Nu ai nevoie de niciun program instalat. Totul se face din browser.

1. Intri pe pagina repo-ului și dai click pe folderul **`date`**.
2. Click pe fișierul pe care vrei să-l schimbi (vezi tabelul de mai sus).
3. Click pe **creionul** din dreapta sus (butonul „Edit this file").
4. Schimbi textul. **Schimbă doar ce e după două puncte**, restul rândului îl lași cum e:

   ```
   Telefon afișat: 0740 123 456
   ─────────────── ▲
    asta rămâne     asta schimbi
   ```

5. Jos, la **Commit changes**, scrii pe scurt ce ai schimbat („am schimbat prețul la
   camera dublă") și apeși butonul verde.
6. Gata. Site-ul se reface singur în 1–2 minute. Reîncarci pagina și vezi schimbarea.

> **Dacă ceva iese prost**, nimic nu e pierdut: fiecare salvare rămâne în istoric și se
> poate reveni la varianta de dinainte. Nu strici site-ul definitiv apăsând un buton.

---

## Regulile de scriere (aceleași în toate fișierele)

Sunt patru, atât:

**1. `##` deschide un element nou.** O cameră, o ofertă, o recenzie, o întrebare.
Ce scrii după `##` devine titlul lui pe site.

```
## Cameră dublă cu balcon
```

**2. `Ceva: valoare` e un câmp.** Numele câmpului dinaintea celor două puncte se
lasă neatins; valoarea de după se schimbă.

```
Preț de la: 380
```

**3. Textul liber de sub câmpuri e descrierea.** Scrii normal, în propoziții. Unde rupi
rândurile nu contează — pe site se lipesc într-un singur bloc de text.

**4. Ce e între `<!--` și `-->` sunt explicații pentru tine.** Nu apar niciodată pe
site. Le poți citi, le poți lăsa acolo. Nu le șterge — sunt instrucțiunile fișierului.

**Un câmp lăsat gol dispare de pe site.** Nu apare „gol" sau „—", pur și simplu nu se
afișează nimic. Deci e mai bine să lași gol decât să scrii ceva nesigur.

Detaliile complete, cu exemple: [`date/README.md`](date/README.md).

---

## Pozele

Toate pozele stau într-un singur folder: **[`poze/`](poze/)**. Le pui acolo o dată și
apoi le chemi după nume, oriunde ai nevoie de ele:

```
Poza: piscina-cu-apa-incalzita.webp
```

Formatul, dimensiunile și cum adaugi una nouă: [`poze/README.md`](poze/README.md).
Din panou e mai simplu: tragi poza în pagina **Poze** și o alegi din listă.

---

## Ce NU se atinge

Folderele astea sunt „motorul" site-ului — codul care ia textele tale și construiește
paginile. Se schimbă doar de către cine se ocupă de partea tehnică.

| Folder | Ce e |
|---|---|
| `app/` | paginile propriu-zise: ce adresă are fiecare pagină. Aici stă și panoul, la `app/admin/` |
| `components/` | bucățile refolosibile: antetul, subsolul, cardul de cameră, galeria |
| `lib/` | logica: citirea fișierelor din `date/`, traducerile, SEO-ul, formularul, panoul |
| `styles/` | stilurile vizuale (culorile concrete vin totuși din `11-culori-si-fonturi.md`) |
| `scripts/` | comenzile de verificare și publicare |
| `sabloane/` | cele trei variante de aranjare a primei pagini |
| `content/` | definiții tehnice; `content/poze.json` se generează singur |
| `public/` | fonturile și pozele deja pregătite pentru web (se generează din `poze/`) |
| `tasks/` | notițele de lucru ale dezvoltatorului |
| `.next/`, `node_modules/` | fișiere generate automat; nu se editează și nu se șterg manual |

Alte fișiere din rădăcină:

- **[`PAGINI.md`](PAGINI.md)** — lista completă a paginilor, cu adresele în română și
  engleză și cu tot ce se vede pe fiecare.
- **[`ADMIN.md`](ADMIN.md)** — cum se instalează și se configurează panoul. O dată, la
  început.
- **`setari.md`** — se editează. Ce secțiuni apar pe prima pagină și în ce ordine.
- **`CITESTE-MA.md`** — raport generat automat: ce e gata și ce a rămas de scris.
  Se rescrie singur, nu-l edita.
- **`PROPUNERE.md`** — analiza site-ului vechi, făcută la început. Doar de citit.
- **`MOTOR-MODIFICAT.md`** — notă tehnică despre modificările din `lib/`, `app/` și
  `scripts/`. Contează numai pentru partea tehnică.
- **`.env.example`** — lista de chei și parole necesare la publicare. Fără valori reale.

---

## Pentru partea tehnică

```bash
npm install
```

```bash
npm run dev
```

Site-ul pornește pe `http://localhost:3000`, panoul pe `http://localhost:3000/admin`.

Înainte de fiecare publicare:

```bash
npm run verifica
```

Verifică texte lipsă, poze inexistente, link-uri moarte, obligațiile legale și bugetul
de performanță. Raportul spune fișierul, rândul și ce e de făcut.
