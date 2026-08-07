# T69 · Site bilingv RO/EN, pornit

**Depinde de:** T63, T65
**Stare:** ✅ gata

## Context

Motorul avea toată infrastructura bilingvă construită încă de la T08 — `LIMBI = ['ro','en']`,
rewrite de limbă în `middleware.ts`, `hreflang` în `lib/seo/meta.ts`, comutator în antet, sitemap
pe limbi. Era stinsă dintr-un singur rând: `Engleză: nu` în `setari.md`, plus lipsa folderului
`en/`.

Nefiind niciodată exercitată, engleza avea **trei defecte care apăreau abia la pornire**. Le
notez aici fiindcă sunt corecții de MOTOR, nu de client — profită orice site viitor.

## Ce era rupt și cum s-a reparat

### `/en/rooms` dădea 404

`traduSegment()` producea adresa publică `/en/rooms`, dar folderul din `app/[limba]/` se numește
`camere/`. Nicio rută nu răspundea.

**Reparat** cu `traduSegmentIntern()` în `lib/i18n/rute.ts`, aplicat în `middleware.ts` înainte de
rewrite: bara de adrese păstrează `/en/rooms`, Next primește `/en/camere`. Cheia din `SEGMENTE`
**este** numele folderului — de asta merge inversarea, și de asta cheia nu se redenumește fără să
se redenumească folderul.

### `hreflang` trimitea la slug-uri românești

`lib/seo/meta.ts` construia `languages[l]` din calea românească netradusă, deci `hreflang="en"`
arăta către `/en/camere/...` — o adresă care nu e publică. Google ignoră perechea și tratează
paginile ca duplicate.

**Reparat:** `traduSegment` se aplică și acolo, și în `ruteCuLimbi()` din `lib/seo/rute.ts`.
Sitemap-ul avea aceeași problemă mai adânc: construia URL-urile fiecărei limbi din datele
ROMÂNEȘTI, deci paginile engleze apăreau cu slug-uri românești. Acum fiecare limbă își citește
propriile date.

### Slug-urile de cameră și de ofertă diferă între limbi

`camera-dubla-cu-balcon` ↔ `double-room-with-balcony`. Nu există regulă care să ducă de la unul la
altul: amândouă se generează din titlul `##` al fișierului limbii respective.

**Reparat** cu `lib/i18n/perechi.ts`, care mapează **după poziția în fișier**: a cincea cameră din
română e a cincea cameră din engleză.

⚠️ **Convenția care trebuie ținută minte:** ordinea blocurilor din `en/04-camere.md` și
`en/06-oferte.md` trebuie să rămână identică cu cea din `date/`. Cine reordonează un singur fișier
rupe comutatorul și `hreflang`-ul, **tăcut**. Nu cere niciun câmp nou în markdown, iar dacă lipsește
poziția se cade pe slug-ul curent — un link netradus, nu unul mort. E scris și în capul fiecărui
fișier `en/`.

## Ce s-a tradus

| Fișier | Ce e |
|---|---|
| `en/01-identitate.md` | slogan și descriere. Numele locației NU se traduce — e nume propriu |
| `en/03-prima-pagina.md` | toate secțiunile primei pagini |
| `en/04-camere.md` | cele 6 camere, în aceeași ordine |
| `en/05-facilitati.md` | cele 9 facilități, cu `Icon:` neatins |
| `en/06-oferte.md` | cele 6 trasee. Toponimele Deltei rămân netraduse |
| `en/07-meniu-restaurant.md` | 100 de preparate, 15 categorii. Cifrele din română (T68) |
| `en/08-recenzii.md` | recenziile ca CITATE — traduse fidel, fără înfrumusețare |
| `en/09-intrebari-frecvente.md` | cele 10 întrebări |
| `en/10-rezervari-si-plati.md` | **doar** blocul `## Etichete`; restul e structural |

`02-contact.md`, `11-culori-si-fonturi.md` și `12-legal-firma.md` nu au variantă engleză
**dinadins**: adresa, telefonul, culorile și datele firmei nu se traduc. Loader-ul le ia din
`date/`, în orice limbă.

## Textele motorului

Erau scrise direct în componente, în română — adică apăreau în română și pe `/en`. Acum stau
într-un singur loc, `lib/i18n/etichete.ts`: navigația, „Acasă" din breadcrumb, „Alergeni",
„Valori nutriționale", „de la" dinaintea prețului, descrierile de rezervă pentru `<meta>`.

Proza legală (confidențialitate, cookies, termeni, anulare) era integral românească în JSX. Are
acum variantă engleză în același fișier, pe tiparul `Record<Limba, …>`. **Cele două variante se
modifică împreună** — dacă se schimbă un flux real (procesator de plăți, hartă), se schimbă
amândouă, altfel una dintre ele devine o declarație falsă.

## Dialogul de alegere a limbii

`components/AlegeLimba.tsx`. Decizia veche din `lib/i18n/preferinta.ts` rămâne intactă: **nu
redirecționăm automat după `Accept-Language`.** Întrebăm.

- apare doar dacă nu există o limbă reținută **și** engleza e pornită;
- se randează **numai după montare**, ca `BannerCookies`. Consecință intenționată: nu apare în
  HTML-ul livrat, deci niciun crawler nu-l vede și nu poate fi penalizat ca interstițial intruziv.
  Zero efect pe LCP;
- `Esc` sau click pe fundal = rămâi în limba curentă, dar alegerea **se reține**, ca să nu reapară
  la fiecare pagină;
- bannerul de cookies așteaptă (`asteaptaLimba`) până se alege limba — două dialoguri simultan la
  prima vizită ar fi fost rele.

## Ce a rămas de făcut

- Meniul englez folosește cifrele românești prin decizie de client. Confirmarea conflictelor —
  **T68**.
- Prețul de 300 lei/noapte e placeholder în ambele limbi — **T66**.
