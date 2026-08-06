# T60 · Video la cameră și clip de prezentare

**Depinde de:** T05, T06
**Se editează în:** `~/Desktop/Structura Resorturi/_motor/` — acolo e originalul. Copia din
acest folder vine prin `client-nou` / `actualizeaza-motor`; o corecție făcută direct în copie
se pierde la prima actualizare.

## Obiectiv

Motorul nu poate afișa niciun video în afara fundalului de hero din Șablonul 1. Belvedere
Murighiol vine cu 7 clipuri — unul pentru fiecare din cele 6 camere, plus unul de prezentare —
și fără acest task cerința „clipul fiecărei camere, ultimul la scroll" nu e implementabilă.

Nu e specific clientului: orice pensiune care filmează camerele cu telefonul are aceeași nevoie.
De asta stă în `_motor/`, nu în folderul clientului.

## Ce e de rezolvat

| # | Lipsa | Unde |
|---|---|---|
| 1 | `Room` n-are câmp de video, iar `CHEI_CAMERA` respinge cheia `Video:` | `_motor/content/types.ts`, `_motor/lib/continut/index.ts:192` |
| 2 | Nu există niciun player în afara `sabloane/01-hero-video/HeroVideo.tsx` | `_motor/components/sectiuni/` |
| 3 | `hero.videoSrc` există în tipuri, dar loader-ul nu-l populează niciodată | `_motor/lib/continut/index.ts:720` |

## Formatul real al materialului

Clipurile reale nu sunt footage de dronă. Sunt filmări de telefon:

- **verticale** — 576×1024 (5 buc.) și 464×832 (2 buc.)
- **cu pistă audio** — 48–64 kbps, gazda comentează în timp ce filmează
- 32–62 s, 6–13 MB brut

Trei consecințe de proiectare, care nu se negociază:

1. **Player portret**, `aspect-ratio: 9/16`, lățime maximă ~380 px. Un clip vertical întins pe
   lățimea ecranului arată rupt.
2. **Click-to-play, nu autoplay.** Clipurile au comentariu — nu sunt fundal decorativ. Sunetul
   rămâne pornit.
3. **Zero octeți până la click.** `preload="none"`, iar `<video>` se montează abia la apăsarea
   butonului de play. Până atunci în pagină e doar posterul, ca `next/image`.

## De făcut

**Tipuri** — `_motor/content/types.ts`
```ts
// în Room
video?: string
videoPoster?: string

// în SiteData
prezentare?: { eyebrow: string; title: string; text: string; video: string; poster: string }
```

**Loader** — `_motor/lib/continut/index.ts`
- `'video'` și `'poster video'` intră în `CHEI_CAMERA` (linia 192). Fără asta, loader-ul
  raportează „Nu recunosc câmpul" cu sugestie Levenshtein.
- Bloc nou `## Clip de prezentare` citit din `03-prima-pagina.md` → `SiteData.prezentare`.
- Rezolvarea căii: **se refolosește tiparul din `poza()` (index.ts:132-155)** — aceeași validare
  că fișierul chiar există în `poze/`, aceeași sugestie când extensia e greșită. Se generalizează
  în `fisierMedia(nume, extensiiAcceptate)`, iar `poza()` devine un apel al ei. Nu se scrie a doua
  funcție care face același lucru.
- `hero.videoSrc` rămâne nepopulat intenționat: cu material vertical, hero-ul video n-are sens.
  Se documentează în `DECIZII.md` ca să nu fie raportat iar ca bug.

**Componente noi** — `_motor/components/sectiuni/`
- `VideoVertical.tsx` (`'use client'`) — posterul + butonul de play; la click montează
  `<video controls playsInline preload="none" poster>`. Buton cu `aria-label`, focus vizibil,
  țintă de atingere ≥44 px.
- `Prezentare.tsx` — `AntetSectiune` + `VideoVertical`, în ramă, pe fundal contrastant.

**Randare**
- `PaginaCamera.tsx` — `<VideoVertical>` ca **ultim bloc**, după `card-foot` cu prețul și butonul
  de rezervare. Poziția e cerință explicită de la client, nu preferință.
- `dispecer.tsx` + `lib/continut/setari.ts` — id nou `prezentare`, mapat din rândul
  `Clip de prezentare` al blocului `## Secțiuni` din `setari.md`.

**Verificator** — `_motor/scripts/verifica.ts:571-596`

Controlul actual se uită doar la `hero.videoSrc`. Se extinde peste hero + prezentare + toate
clipurile de cameră:

| Regulă | Nivel |
|---|---|
| Un fișier video peste 4 MB | eroare |
| Toate videourile însumate peste 25 MB | eroare |
| Video fără poster | eroare |
| Pistă audio la videoul de **hero** | avertisment |
| Pistă audio la un clip click-to-play | nimic — e intenționat |

## Criteriu de terminare

- [ ] `npm run typecheck` curat
- [ ] Pe o pagină de cameră, fără click: **0 octeți** de video în transfer, confirmat în panoul de rețea
- [ ] La click: clipul pornește, cu sunet, cu controale native
- [ ] Clipul e ultimul element din `<article>`, sub preț
- [ ] Secțiunea de prezentare apare pe prima pagină doar dacă `Clip de prezentare` e în `setari.md`
- [ ] Fără `Video:` în `04-camere.md`, pagina de cameră arată exact ca înainte — zero regresie
- [ ] `npm run verifica` prinde un video de 12 MB și unul fără poster
- [ ] Testat în Safari pe iOS: `playsInline` chiar previne intrarea în fullscreen
- [ ] Nicio culoare hardcodată în componentele noi (REGULI.md 1)
