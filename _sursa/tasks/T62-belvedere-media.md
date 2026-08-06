# T62 · Belvedere Murighiol — media

**Depinde de:** T30, T60

## Obiectiv

Să intre în `clienti/pensiunea-belvedere-murighiol/poze/` doar fișiere care merită servite:
7 clipuri re-encodate cu poster, și fotografiile reale de pe site-ul lor — fără bannerele cu
text ars în imagine.

## Sursele

**Clipuri:** `~/Desktop/Siteuri gata/Resorturi /Pensiunea Belvedere Marghiol/Video pentru camere/`
— 7 fișiere, 68 MB total. Atenție: folderul părinte `Resorturi ` are **spațiu la final**.

**Fotografii:** descărcate de `npm run analiza -- https://www.belvederemurighiol.ro`, plus
cele de pe `pagina-2` (camere) și `pagina-6` (versiunea engleză).

## Clipurile

`ffmpeg` e deja instalat (`/usr/local/bin/ffmpeg`).

```bash
ffmpeg -i "<sursa>.mp4" -c:v libx264 -crf 26 -preset slow -profile:v high \
  -c:a aac -b:a 64k -ac 1 -movflags +faststart "poze/<slug>.mp4"
```

Plus un poster din secunda ~1.5, în WebP. Ținta: sub 4 MB per fișier, sub 25 MB pe tot site-ul
— exact pragurile pe care le verifică `npm run verifica` după T60.

Redenumire după REGULI.md 13 — cratime, fără diacritice, descriptiv:

| Sursă | Devine |
|---|---|
| `camera dubla fara balcon.mp4` | `camera-dubla-fara-balcon.mp4` + `.webp` |
| `camera dubla cu balcon.mp4` | `camera-dubla-cu-balcon.mp4` + `.webp` |
| `camera tripla fara balcon.mp4` | `camera-tripla-fara-balcon.mp4` + `.webp` |
| `Cameră cvadruplă cu balcon.mp4` | `camera-cvadrupla-cu-balcon.mp4` + `.webp` |
| `suita de familie pentru 4 persoane.mp4` | `suita-familie-4-persoane.mp4` + `.webp` |
| `Suită de familie cu balcon pentru 5 persoane.mp4` | `suita-familie-balcon-5-persoane.mp4` + `.webp` |
| `Filmuleț de prezentare.mp4` | `prezentare-pensiune.mp4` + `.webp` |

Pista audio se **păstrează** — vezi T60.

## Fotografiile

Din ce descarcă `analiza` se păstrează **doar fotografiile propriu-zise**, ~25 de bucăți: camere,
băi, piscina, restaurantul, exteriorul, pontonul.

Se aruncă tot ce e banner cu text ars în imagine — grila de facilități, cele 7 carduri de
excursie, „DE CE SĂ VIZITAȚI", „CAMERE MODERNE", paginile de meniu exportate ca JPG. Nu sunt
fotografii, sunt capturi de Canva. Textul din ele se recuperează în T63, ca text real.

Redenumire descriptivă: `camera-dubla-balcon-vedere-lac.webp`, `piscina-exterior.webp`,
`restaurant-sala.webp`, `exterior-aerian-ponton.webp`.

Unde nu există o fotografie clară pentru o cameră anume, se folosește posterul extras din clipul
ei — atribuirea e garantat corectă, ceea ce o poză „de undeva de pe site" nu e.

## Constrângerea de acceptat conștient

Fotografiile lor au **maximum 1200 px** pe latura lungă, majoritatea 828×621, derivate din
Facebook. `standarde/` cere ≥1600 px la camere și ≥2000 px la hero.

Nu există sursă mai bună: clipurile sunt 576 px lățime, deci nici cadrele extrase nu ajută.
Se construiește cu ce există, iar limita se scrie explicit în `CITESTE-MA.md` al clientului:
**o ședință foto e primul upgrade care merită plătit.**

## Criteriu de terminare

- [ ] 7 clipuri sub 4 MB fiecare, cu poster WebP
- [ ] Total video sub 25 MB
- [ ] `ffprobe` confirmă pista audio prezentă și `+faststart` aplicat
- [ ] Zero banner-cu-text în `poze/`
- [ ] Fiecare fișier are nume descriptiv, fără diacritice, fără `IMG_`
- [ ] Fiecare cameră are cel puțin o imagine care e chiar camera aia
- [ ] `npm run dev` copiază tot, inclusiv `.mp4`, prin `sync-media` (fără modificări la script)
- [ ] Limita de rezoluție notată în `CITESTE-MA.md`
