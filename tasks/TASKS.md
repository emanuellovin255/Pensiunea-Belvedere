# Pensiunea Belvedere Murighiol — board de execuție

Site nou pentru Pensiunea Belvedere Murighiol, construit pe motorul din
`~/Desktop/Structura Resorturi`.

**Site actual:** https://www.belvederemurighiol.ro (Gomag)
**Șablon:** 2 · Poveste alternantă
**Limbi:** română + engleză

Legendă: ⬜ nefăcut · 🟡 în lucru · ✅ gata

---

## Unde stă ce

| Folder | Ce e |
|---|---|
| `~/Desktop/Structura Resorturi/` | **sursa de cod și de reguli.** Motorul, cele 3 șabloane, uneltele, `REGULI.md`, `standarde/`, `ghiduri/`. Se citește și se corectează acolo — nu se duplică aici |
| **acest folder** | **site-ul clientului.** `_motor/` e o copie a motorului, plus `date/`, `en/`, `poze/`, `setari.md` |
| `Meniuri/` | sursă: meniul 2026 în PDF, RO și EN, 12 pagini |
| `Video pentru camere/` | sursă: 7 clipuri brute, 68 MB |
| `tasks/` | taskurile de mai jos |

Corecțiile de motor (T60, T61) se fac în `Structura Resorturi/_motor/` — acolo e originalul — și
ajung aici prin `npm run client-nou`, respectiv `npm run actualizeaza-motor`. Altfel se pierd la
prima actualizare.

Regulile din `Structura Resorturi/REGULI.md` se aplică integral. Cea care contează cel mai des
aici e regula 3: **ce nu e confirmat rămâne necompletat.**

---

## Taskuri

| # | Task | Stare | Depinde de |
|---|---|---|---|
| T60 | [Video la cameră și clip de prezentare](tasks/T60-video-camera-prezentare.md) | ⬜ | — |
| T61 | [Ruta `/oferte/[slug]` și titluri traductibile](tasks/T61-ruta-oferte-si-traduceri.md) | ⬜ | — |
| T62 | [Media: clipuri re-encodate + fotografii](tasks/T62-belvedere-media.md) | ⬜ | T60 |
| T63 | [Conținutul: `date/` și `en/`](tasks/T63-belvedere-continut.md) | ⬜ | T60, T61, T62 |
| T64 | [Verificare, migrare SEO, lansare](tasks/T64-belvedere-verificare-lansare.md) | ⬜ | T63 |

T60 și T61 sunt corecții de motor, nu muncă de client — profită orice client viitor. Pot merge
în paralel.

---

## Pașii de pornire

```bash
brew install poppler
```

```bash
npm --prefix "$HOME/Desktop/Structura Resorturi/_motor" run analiza -- https://www.belvederemurighiol.ro
```

```bash
npm --prefix "$HOME/Desktop/Structura Resorturi/_motor" run client-nou -- "Pensiunea Belvedere Murighiol" --sablon 2
```

Scheletul generat se așază în acest folder (layout standalone: `_motor/` lângă `date/`, `poze/`
și `setari.md` — `radacinaClientDir()` îl recunoaște).

---

## Ce am aflat despre client

**Firmă:** SC Inima Deltei SRL · CUI RO38559817 · Str. Peninsula 2, Murighiol, jud. Tulcea,
827150 · IBAN RO11UGBI0000252015729RON, Garanti Bank
**Contact:** 0754 318 813 · WhatsApp +40754318813 · belvederemurighiol@gmail.com ·
facebook.com/murighiol2
**Poziționare:** „perla Deltei Dunării", pe malul Lacului Murighiol, restaurant propriu,
~4 ore cu mașina din București
**Rezervări:** niciun motor de rezervări. Telefon, email, transfer bancar, vouchere de vacanță.
→ `Tip: formular`, `Plăți online: nu`, fără bază de date

**Ce are site-ul actual și noi recuperăm ca text:** cele 10 facilități și cele 7 trasee de
excursie sunt azi imagini JPG, deci invizibile pentru Google. Le-am extras integral.

---

## Constrângeri de care depinde rezultatul

1. **Toate clipurile sunt verticale** — 576×1024 și 464×832, cu sunet, 32–62 s. De asta Șablonul
   1 e exclus și clipurile primesc player portret cu buton de play, nu autoplay mut.
2. **Fotografiile sunt sub standard** — maximum 1200 px, majoritatea 828×621, derivate din
   Facebook. Standardul cere ≥1600 px. O ședință foto e primul upgrade care merită plătit.
3. **Meniul nu are prețuri** — căsuțele din PDF sunt goale la toate cele ~90 de preparate.
4. **Prețul de 200 lei/noapte e placeholder**, pus la cererea ta. Blocant de publicare.
5. **Coordonatele GPS lipsesc** de pe site și de pe Facebook. Harta nu se randează până le avem.

---

## Blocante de publicare

1. Prețurile reale ale celor 6 camere
2. Linkul de Google Maps, pentru coordonate
3. Nota medie Google și numărul total de recenzii
4. Restul de ~80 de preparate din meniu, după ce aprobi mostra de 10

---

## Bugetul de performanță — condiție de livrare

Măsurat pe mobil cu 4G simulat.

| Indicator | Țintă |
|---|---|
| LCP | sub 2,5 s |
| INP | sub 200 ms |
| CLS | sub 0,1 |
| Lighthouse Performance | minim 90 |
| Lighthouse Accessibility | minim 95 |
| Lighthouse SEO | 100 |
| Greutate prima încărcare | sub ~600 KB |
