# Folderul `poze/` — toate imaginile și clipurile site-ului

Aici stau **toate** pozele și clipurile, într-un singur loc, fără subfoldere. Le pui o
dată aici și apoi le chemi după nume, din orice fișier din [`date/`](../date/):

```
Poza: piscina-cu-apa-incalzita.webp
```

Nu se scrie nicio cale, niciun `/`, niciun `poze/` — doar numele fișierului, exact cum
apare în listă, **cu tot cu extensie**.

---

## Cel mai simplu: din panoul de administrare

Intri pe `/admin` → **Poze** → tragi poza acolo. Panoul o **micșorează singur** și o
transformă în `.webp` înainte s-o urce, deci poți trage direct o poză de 12 MB făcută cu
telefonul. Apoi o alegi dintr-o listă cu miniaturi, la camera sau la oferta care o
folosește — nu mai scrii niciun nume de fișier de mână.

Restul acestui ghid e pentru când vrei să lucrezi direct din GitHub.

---

## Cum adaugi o poză nouă, direct din GitHub

1. Intri în folderul `poze` de pe pagina repo-ului.
2. Sus, la dreapta: **Add file** → **Upload files**.
3. Tragi poza acolo (sau o alegi de pe calculator).
4. Jos, la **Commit changes**, apeși butonul verde.
5. Te duci în fișierul unde vrei să apară poza (de exemplu `date/04-camere.md`) și îi
   scrii numele la câmpul potrivit: `Poza:` sau `Poze:`.

**Doar încărcarea nu e suficientă.** O poză pusă în folder, dar nechemată din niciun
fișier, nu apare nicăieri pe site — stă degeaba și îngreunează repo-ul. `npm run verifica`
îți spune care poze sunt nefolosite.

## Cum înlocuiești o poză existentă

Cel mai simplu: **încarci noua poză cu exact același nume**. GitHub o suprascrie, iar
toate locurile care o foloseau arată automat poza nouă. Nu mai ai nimic de schimbat în
`date/`.

Dacă îi dai alt nume, trebuie să schimbi numele și în fiecare fișier care o folosea.

---

## Reguli pentru fișiere

### Formatul

| Extensie | Când |
|---|---|
| **`.webp`** | formatul folosit peste tot aici. Se încarcă rapid și arată bine |
| `.jpg`, `.jpeg` | merg, dar sunt mai grele. Site-ul le convertește la afișare |
| `.png` | doar pentru logo sau imagini cu fundal transparent (așa e `logo-belvedere.png`) |
| `.svg` | pentru logo, dacă există varianta vectorială |
| `.avif`, `.gif` | acceptate, rar necesare |

### Clipurile video

`.mp4`, `.webm` sau `.mov`. Un clip are nevoie **și** de o poză de copertă — câmpul
`Poster:` sau `Poster video:`. Fără ea, clipul nu se afișează deloc.

Convenția din folder: clipul și coperta lui poartă același nume, cu extensii diferite:

```
Video: camera-dubla-cu-balcon.mp4
Poster video: camera-dubla-cu-balcon.webp
```

Așa stau acum clipurile celor patru camere filmate, plus `prezentare-pensiune.mp4`
(clipul de pe prima pagină) și `plimbare-cu-barca-in-delta.mp4`.

### Numele fișierului

Numele bun descrie ce se vede în poză, în română, cu cratime, fără diacritice:

| Nume | Verdict |
|---|---|
| `camera-dubla-balcon-vedere-lac.webp` | bun |
| `piscina-cu-apa-incalzita.webp` | bun |
| `IMG_20240712_154233.jpg` | greșit — nu spune nimic despre poză |
| `Cameră Dublă (1).webp` | greșit — spații, diacritice, paranteze |

Fără spații, fără diacritice, fără litere mari. Cratime între cuvinte.

### Dimensiunea

Latura mare: în jur de **2000–2400 px**. Mai mult nu se vede pe niciun ecran, dar
încetinește site-ul. Sub 1200 px, pozele mari de pe prima pagină ies neclare pe ecrane
bune.

Greutatea unei poze: ideal sub **300 KB**. Panoul de administrare se ocupă singur de asta.

---

## Ce mai e în folder

- **`_manifest.json`** — listă generată automat. Nu se editează manual.
- **`README.md`** — fișierul ăsta. Nu e imagine și site-ul îl ignoră.

Tot ce e aici se copiază la fiecare build în `public/media/`, de unde îl servește site-ul.
Folderul acela se generează singur — nu pui poze direct acolo, se pierd la următorul build.

---

## Înainte de publicare

```bash
npm run verifica
```

Spune care poze sunt chemate din `date/` dar lipsesc din folder (cu sugestia celui mai
apropiat nume), și care stau în folder fără să fie folosite nicăieri.
