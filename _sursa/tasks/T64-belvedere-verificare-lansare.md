# T64 · Belvedere Murighiol — verificare, migrare SEO, lansare

**Depinde de:** T63

## Obiectiv

Site-ul să treacă bugetul de performanță, iar trecerea de pe Gomag să nu piardă pozițiile pe
care le au azi în Google.

## Verificarea funcțională

```bash
npm run dev
```

- prima pagină pe mobil (375 px) și pe desktop, în RO și în EN
- `/camere/camera-dubla-cu-balcon` — clipul e **ultimul** element din pagină, sub preț
- fără click pe play: **0 octeți** de video în transferul paginii
- la click: clipul pornește, cu sunet
- `/oferte/pachet-paste-2026` și `/oferte/padurea-letea` răspund 200, nu 404
- comutatorul de limbă duce la pagina echivalentă, nu pe prima pagină
- formularul trimite email și duce la `/multumim`
- harta: câtă vreme GPS-ul lipsește, secțiunea nu se randează — nu trebuie să apară un gol

```bash
npm run verifica
```

Trebuie curat. Erorile de video (peste 4 MB, lipsă poster) vin din pragurile adăugate la T60.

## Migrarea SEO — partea care nu se poate rata

```bash
npm run migrare -- https://www.belvederemurighiol.ro
```

Site-ul actual are pagini indexate cu nume generate de Gomag. Fiecare trebuie să ajungă la
echivalentul nou, altfel devine 404 și pierdem tot ce aduceau:

| Vechi | Nou |
|---|---|
| `/pagina-2` | `/camere` |
| `/pagina-3` | `/restaurant` |
| `/pagina-4` | `/en/menu` |
| `/pagina-5` | `/oferte` |
| `/pagina-6` | `/en` |
| `/pagina-7` | `/en/offers` |
| `/pagina-8` | `/contact` |
| `/testimoniale` | `/#recenzii` |
| `/despre-noi` | `/` |
| `/termeni-si-conditii` | `/termeni` |
| `/politica-de-confidentialitate` | `/politica-confidentialitate` |
| `/politica-de-cookies` | `/politica-cookies` |
| `/info-transport` | eliminat — e „politică de livrare" de magazin online, n-are sens la o pensiune |
| `/inregistrare`, `/cos-de-cumparaturi`, `/wishlist`, `/noutati` | 410, nu 301 — pagini de e-commerce care nu mai există |

Tabelul de mai sus se verifică față de ce scoate `migrare`, nu se ia orbește: dacă apare o
adresă pe care n-am prevăzut-o, intră și ea.

## Bugetul de performanță — condiție de livrare

Măsurat pe **mobil cu 4G simulat**, nu pe laptop cu fibră.

| Indicator | Țintă |
|---|---|
| LCP | sub 2,5 s |
| INP | sub 200 ms |
| CLS | sub 0,1 |
| Lighthouse Performance | minim 90 |
| Lighthouse Accessibility | minim 95 |
| Lighthouse SEO | 100 |
| Greutate prima încărcare | sub ~600 KB |

Cele 68 MB de video nu intră în buget cât timp `preload="none"` își face treaba. Dacă bugetul
pică, se verifică întâi asta.

## Blocante de publicare

Nu se publică până nu sunt rezolvate:

1. **Prețurile reale ale celor 6 camere** — acum 200 lei placeholder
2. Coordonatele GPS, pentru hartă
3. Nota medie Google și numărul de recenzii, pentru `AggregateRating`
4. Restul meniului, dacă mostra de 10 e aprobată

## Publicarea

```bash
npm run publica
```

**Nu se rulează fără cerere explicită.** Creează repo privat, proiect Vercel, variabile de
mediu, branch protection.

După lansare: sitemap trimis în Google Search Console, apoi **monitorizare 404 timp de 4–6
săptămâni** — acolo se văd redirecturile ratate.

## Criteriu de terminare

- [ ] `npm run verifica` curat
- [ ] Toate țintele de performanță atinse pe mobil cu 4G simulat
- [ ] Rich Results Test trece pe prima pagină, pe o cameră și pe o ofertă
- [ ] Fiecare URL vechi indexat are 301 sau 410, verificat manual
- [ ] Testat pe un telefon fizic, cu date mobile, nu pe WiFi
- [ ] Testat în Safari pe iOS
- [ ] Cele 4 blocante rezolvate sau acceptate în scris de client
- [ ] Rollback testat
