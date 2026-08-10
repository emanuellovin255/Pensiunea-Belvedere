# Modificări locale în motor

> Notă tehnică. Dacă tu editezi doar texte și poze, fișierul ăsta nu te privește —
> mergi la [`README.md`](README.md).

Regula 1 din REGULI.md spune că un client nu editează codul motorului. Repo-ul ăsta
are totuși modificări locale, făcute intenționat: fișierele din `date/` trebuie să poarte
nume pe care le înțelege gazda, iar site-ul trebuie să aibă un panou de administrare.

`npm run actualizeaza-motor` **suprascrie** codul motorului. Dacă rulezi comanda fără
să duci întâi modificările astea în motorul-sursă, site-ul se strică: loader-ul va
căuta iar `date/01-identitate.md`, care nu mai există, iar paginile se vor randa goale.
Panoul de la `/admin` dispare cu totul.

Scriptul se oprește singur când vede modificări locale necomise, dar **nu** și când
sunt deja comise — cazul de față. Deci: citește lista de mai jos înainte să-l rulezi.

---

## 1. `lib/continut/fisiere.ts` — fișier nou

Numele fișierelor de conținut, într-un singur loc (`FISIERE`), plus `rezolva()`.

`rezolva(radacina, nume)` caută întâi numele exact; dacă nu-l găsește, caută orice
`.md` din folder care începe cu **același număr din două cifre**. Numărul e identitatea
fișierului, restul numelui e pentru om. O redenumire viitoare care păstrează prefixul
numeric nu strică nimic.

## 2. `lib/continut/index.ts` — trei schimbări

- Cele 34 de nume de fișiere scrise literal (`'01-identitate.md'` și celelalte) au
  fost înlocuite cu constante din `FISIERE`. Comportamentul e identic; numele apar
  acum într-un singur loc, inclusiv în mesajele de eroare.
- `citeste()` folosește `rezolva()` în loc de `path.join` + `existsSync`.
- `citestePoze()` ignoră fișierele `.md` din `poze/` — `poze/README.md` e ghidul
  folderului, nu o imagine. Fără filtru ar fi raportat la fiecare `verifica` drept poză
  nefolosită.

## 3. `lib/continut/meniu.ts` și `scripts/sync-media.ts`

- `incarcaMeniu()` folosește `rezolva()` și `FISIERE.meniu`.
- `sync-media` sare peste `.md` când copiază `poze/` în `public/media/`, din același
  motiv ca `citestePoze()`.

## 4. `scripts/lib/scrie-md.ts`

`scrieDate()` folosește `FISIERE` în loc de numele literale, ca un `npm run analiza`
rulat din nou să scrie **peste** fișierele existente, nu alături de ele.

Numele au fost actualizate și în `scripts/verifica.ts`, `scripts/analiza.ts`,
`scripts/client-nou.ts`, `content/types.ts`, `content/meniu.ts` și în comentariile din
~8 componente și pagini (`components/sectiuni/Subsol.tsx`,
`components/sectiuni/PaginaContact.tsx`, `components/sectiuni/BaraWhatsApp.tsx`,
`app/icon.tsx`, `app/[limba]/contact/page.tsx`,
`app/[limba]/(legal)/politica-confidentialitate/page.tsx`).

---

## 5. Panoul de administrare — cod nou

Tot ce ține de `/admin` e adăugat, nu modificat. Fișiere noi:

| Cale | Ce e |
|---|---|
| `lib/admin/patch.ts` | editorul chirurgical al fișierelor `.md`. Vezi mai jos |
| `lib/admin/schema.ts` | ce formular se arată pentru fiecare fișier: câmpuri, etichete, ajutoare |
| `lib/admin/sesiune.ts` | parola, cookie-ul semnat HMAC, limitarea de rată |
| `lib/admin/github.ts` | API-ul Contents: citire cu `sha`, scriere cu `sha`, listare, ștergere |
| `lib/admin/depozit.ts` | două implementări: `github` în producție, `disc` în dezvoltare |
| `lib/admin/api.ts` | erori traduse în mesaje pe care le poate citi gazda |
| `app/admin/**` | ecranele: acasă, parolă, editor, poze, setări |
| `app/api/admin/**` | rutele: intra, iesi, continut, poze, poza/[nume], setari |
| `components/admin/**` | formularul, câmpurile tipizate, alegerea de poze, biblioteca |
| `styles/admin.css` | stiluri proprii, care NU moștenesc tema site-ului |
| `scripts/proba-patch.ts` | probele editorului, pe fișierele reale (`npm run proba-patch`) |

### De ce `patch.ts` și nu regenerare

Panoul nu rescrie fișierul din formular. Găsește blocul după linia lui `##`, câmpul după
linia `Cheie:` și înlocuiește **doar valoarea**. Comentariile `<!-- … -->`, separatoarele
`---` și orice linie neatinsă rămân octet cu octet.

Consecința care contează: după o salvare din panou, fișierul e în continuare editabil de
mână din GitHub, cu tot cu instrucțiunile lui. Cele două drumuri de editare nu se bat cap
în cap.

Două invariante, verificate de `npm run proba-patch` pe conținutul real:

- **O rescriere identică nu atinge fișierul.** Formularul trimite toate câmpurile la
  fiecare salvare; fără invarianta asta, prima salvare ar reformata tot fișierul.
- **Panoul citește exact ce citește motorul** — aceleași blocuri, aceleași câmpuri,
  același text. `patch.ts` refolosește `normalizeaza()` din `md.ts` și repetă aceeași
  definiție de câmp și aceeași tratare a comentariilor.

### Trei atingeri în motor, cerute de `/admin`

1. **`middleware.ts`** — `/admin` sare peste rewrite-ul de limbă (altfel `/admin` →
   `/ro/admin` → 404), dar **rămâne** în matcher, ca să primească nonce, CSP și HSTS.
   Logica de limbă a fost scoasă într-o funcție, `rewriteCuLimba()`.
2. **`app/robots.ts`** — `/admin` intră la `disallow`, lângă `/probe/` și `/api/`.
   Panoul e apărat de parolă, nu de `robots.txt`; `app/admin/layout.tsx` pune și `noindex`.
3. **`lib/csp.ts`** — `'unsafe-eval'` în `script-src`, **doar** când
   `NODE_ENV === 'development'`.

Al treilea e reparația unui bug care exista deja și nu ținea de panou: HMR-ul lui Next
evaluează module ca șiruri, CSP-ul le bloca, `main-app.js` murea cu `EvalError` și **niciun**
component client nu se hidrata în `npm run dev` — banner de cookies inert, formular mort.
Eroarea apărea doar în consolă, deci a trecut neobservată. În producție nu există HMR,
deci politica strictă rămâne neatinsă acolo.

### Un bug de conținut, găsit de probe

`date/09-intrebari-frecvente.md` avea răspunsul „Da, la pachetele turistice: 75%…".
Parserul citea „Da, la pachetele turistice" ca **nume de câmp** (patru cuvinte, nicio
punctuație de frază înainte de `:`), răspunsul rămânea gol, iar o întrebare fără răspuns nu
se randează — întrebarea lipsea complet de pe site. Reparat cu o linie lungă în loc de două
puncte, plus un comentariu care explică regula. `npm run proba-patch` prinde de acum orice
altă cheie scrisă cu literă mică, în `date/` și în `en/`.

### Ce NU face panoul

Adaugă, șterge și reordonează **elemente**, și aprinde sau stinge **secțiuni și pagini care
există deja** în motor. Un tip nou de pagină cere cod. Nu atinge `app/`, `components/` sau
`lib/` — doar `date/`, `en/`, `poze/` și `setari.md`.

---

## Cum duci modificările în motorul-sursă

În repo-ul motorului, aceleași fișiere: `lib/continut/fisiere.ts`, `lib/continut/index.ts`,
`lib/continut/meniu.ts`, `scripts/sync-media.ts`, `scripts/lib/scrie-md.ts`, plus tot
`lib/admin/`, `app/admin/`, `app/api/admin/`, `components/admin/`, `styles/admin.css`,
`scripts/proba-patch.ts`, `middleware.ts`, `app/robots.ts` și `lib/csp.ts`. După aceea,
`actualizeaza-motor` devine din nou sigur.

Panoul merită dus în motor, nu ținut local: e generic. Singurul lucru specific Belvedere e
`lib/admin/schema.ts` — câmpurile, etichetele și ajutoarele — iar acela e prin natura lui
fișier de client, ca `date/`.

Redenumirile aplicate în `date/` și `en/`:

| vechi | nou |
|---|---|
| `01-identitate.md` | `01-nume-logo-si-descriere.md` |
| `02-contact.md` | `02-telefon-email-si-adresa.md` |
| `03-prima-pagina.md` | `03-pagina-principala.md` |
| `06-oferte.md` | `06-oferte-si-excursii.md` |
| `12-legal-firma.md` | `12-firma-si-documente-legale.md` |

Fișierele `04`, `05`, `07`, `08`, `09`, `10` și `11` aveau deja nume clare și au rămas
neschimbate. Belvedere n-are `13-zona` (modul oprit) și n-are fișier separat pentru pagina
de contact — aceea își ia textele din `02-…`.

Verificat după redenumire: `npx tsc --noEmit` curat și `npm run verifica` cu 0 erori și
0 avertismente.
