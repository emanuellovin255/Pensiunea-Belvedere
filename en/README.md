# Folderul `en/` — textele site-ului în engleză

Engleza e **pornită** (`setari.md` → `## Module` → `Engleză: da`). Site-ul are toate
paginile și în engleză, sub `/en`, iar la prima vizită întreabă **Română / English**.

Fișierele de aici sunt traducerile celor din [`date/`](../date/). Aceleași nume,
aceleași numere, același format.

---

## Regula de aur: se traduce doar ce e DUPĂ două puncte

Titlurile de bloc (`## Nume`, `## Prima secțiune`) și numele câmpurilor (`Preț de la:`,
`Poze:`) **rămân în română**, în toate fișierele de aici. Nu sunt text pentru vizitator —
sunt chei după care site-ul caută în fișier. Traduse, blocul nu mai e găsit și câmpul
rămâne gol, fără nicio eroare.

```
## Cameră dublă cu balcon        ← rămâne, e cheia blocului
Preț de la: 380                  ← „Preț de la" rămâne, 380 rămâne (cifră)
Persoane: 2 people               ← „Persoane" rămâne, valoarea se traduce
```

Singura excepție: **titlul de după `##` la camere și oferte se traduce**, fiindcă din el
se face adresa paginii în engleză (`/en/rooms/double-room-with-balcony`). La celelalte
fișiere — `01`, `03`, `10` — titlurile de bloc sunt chei fixe și rămân în română.

---

## Ce fișiere există aici și de ce nu toate

| Fișierul | Ce se traduce |
|---|---|
| `01-nume-logo-si-descriere.md` | sloganul și descrierea scurtă. **Numele pensiunii nu** — e nume propriu |
| `03-pagina-principala.md` | toate textele primei pagini |
| `04-camere.md` | numele camerelor, dotările, descrierile |
| `05-facilitati.md` | lista „Ce găsești aici" |
| `06-oferte-si-excursii.md` | pachetele și excursiile |
| `07-meniu-restaurant.md` | categoriile și preparatele |
| `08-recenzii.md` | recenziile traduse |
| `09-intrebari-frecvente.md` | întrebările și răspunsurile |
| `10-rezervari-si-plati.md` | **doar blocul `## Etichete`** — „Sosire" → „Check-in" etc. |

**Lipsesc, și e corect așa:** `02` (telefon, adresă, GPS), `11` (culori, fonturi) și `12`
(firma, CUI, documentele legale). Alea nu se traduc niciodată — un număr de telefon și un
CUI sunt aceleași în orice limbă. Site-ul le citește mereu din `date/`.

---

## Un fișier lipsă nu strică nimic

Dacă un fișier din `en/` lipsește, secțiunea aceea pur și simplu nu apare pe `/en`.
Nu e o eroare și `npm run verifica` nu se plânge. Așa poți traduce pe bucăți, în ritmul
tău, fără să lași site-ul rupt între timp.

La `10-rezervari-si-plati.md`, dacă lipsește, butoanele moștenesc etichetele românești —
nu rămân goale.

---

## ATENȚIE: ordinea camerelor și ofertelor trebuie să fie IDENTICĂ

Asta e singura capcană reală a folderului.

Adresa unei camere în engleză (`double-room-with-balcony`) se face din titlul din
`en/04-camere.md`, iar cea în română (`camera-dubla-cu-balcon`) din titlul din
`date/04-camere.md`. Nu există nicio regulă care să ducă de la un slug la altul, așa că
site-ul le împerechează **după poziție**: a treia cameră din română e a treia cameră din
engleză.

Consecința: dacă adaugi, ștergi sau muți o cameră într-un fișier și nu faci același
lucru în celălalt, comutatorul de limbă ajunge pe camera greșită, iar Google primește o
corespondență falsă între pagini.

**Deci: orice cameră sau ofertă adăugată în `date/` se adaugă și aici, pe aceeași
poziție.** Același lucru la ștergere și la reordonare.

Detaliile tehnice: [`lib/i18n/perechi.ts`](../lib/i18n/perechi.ts).

---

## Adresele se traduc și ele

| Română | Engleză |
|---|---|
| `/camere` | `/en/rooms` |
| `/oferte` | `/en/offers` |
| `/meniu` | `/en/menu` |
| `/contact` | `/en/contact` |

Paginile legale își păstrează adresa românească și pe `/en` (`/en/termeni`,
`/en/politica-cookies`) — sunt documente cerute de legea română.

Harta completă: [`PAGINI.md`](../PAGINI.md).

---

## Restul regulilor

Formatul, listele, prețurile, pozele, cum adaugi un element — toate sunt identice cu ce
scrie în [`date/README.md`](../date/README.md). Nu se schimbă nimic în engleză, în afară
de limba textului.

Pozele se refolosesc: aceeași poză din `poze/`, chemată la fel în amândouă limbile. Nu
există un folder de poze pentru engleză.
