# T65 · Meniu — restul preparatelor din PDF

**Depinde de:** T63
**Stare:** ✅ gata — 100 de preparate publicate pe `/meniu` și `/en/menu`

## Ce s-a făcut

Clientul a aprobat mostra și a cerut publicarea integrală. S-a transcris **tot** meniul 2026:
**100 de preparate în 15 categorii**, în ordinea din PDF, cu preț, gramaj, ingrediente, alergeni
și valori nutriționale.

| # | Categorie | Poziții | | # | Categorie | Poziții |
|---|---|---|---|---|---|---|
| 1 | Mic dejun | 6 | | 9 | Cafea și ceai | 9 |
| 2 | Extra la micul dejun | 9 | | 10 | Apă | 4 |
| 3 | Ciorbe | 2 | | 11 | Răcoritoare | 7 |
| 4 | Preparate din pește | 14 | | 12 | Bere | 6 |
| 5 | Preparate din carne | 4 | | 13 | Vinuri | 9 |
| 6 | Garnituri | 6 | | 14 | Băuturi spirtoase | 8 |
| 7 | Salate | 6 | | 15 | Cocktailuri | 5 |
| 8 | Desert | 5 | | | | |

Cele 6 poziții de la micul dejun n-au preț: sunt incluse în cazare. Corect așa — câmp
necompletat, nu preț inventat (`REGULI.md` 3).

**Punctul 3 de mai jos s-a rezolvat cu prima variantă**, la cererea clientului: prima pagină arată
specialitățile casei — ciorbele și peștele, alese din `## Secțiune` → „Categorii pe prima pagină",
tăiate la 3 preparate pe categorie — plus butonul „Vezi meniul complet". Meniul întreg stă la
`/meniu`, respectiv `/en/menu`, cu navigație pe ancore și JSON-LD `Menu` complet. PDF-ul rămâne un
link secundar, jos în pagina de meniu: nu mai e singura cale către meniu, care era exact problema
de SEO — Google nu vedea niciun preparat.

**Punctul 5 s-a făcut altfel decât scrie mai jos.** Clientul a decis ca **româna să fie sursa de
adevăr în ambele limbi**, fiindcă cele două PDF-uri se contrazic. `en/07-meniu-restaurant.md`
copiază cifrele din română și traduce doar textul; PDF-ul englez a servit la formulări, nu la
cifre. Conflictele — **T68**. Restul englezei — **T69**.

**Ce a rămas:** confirmarea prețurilor cu clientul (punctul 4) e acum T68. Nu mai blochează
publicarea — a cerut explicit publicarea PDF-ului 2026 ca atare.

---

## Contextul de la deschidere

`date/07-meniu-restaurant.md` are azi **10 preparate**, publicate ca mostră la cererea ta.
Sursa completă e `Meniu/meniu 2026 română  final.pdf` (atenție: **două spații** în numele
fișierului), cu perechea lui în engleză, `meniu 2026 eng final.pdf`.

PDF-ul dă pentru fiecare preparat exact câmpurile pe care motorul le acceptă acum, după
extinderea din T63:

| Câmp în `date/` | Ce e în PDF |
|---|---|
| `Preț:` | prețul în lei |
| `Gramaj:` | porția, în grame sau ml |
| `Ingrediente:` | lista completă |
| `Valori nutriționale:` | kcal, proteine, lipide, glucide la porție |
| `Alergeni:` | numerotarea din legenda PDF-ului |

## Cele 10 publicate acum

Ciorbe — ciorbă de pește, storceag.
Preparate din pește — platou pescăresc (4 persoane), caras prăjit, crap la grătar, saramură de
crap, plachie de crap, șalău pane, chifteluțe din pește.
Desert — papanași cu dulceață.

## De făcut

1. **Confirmă mostra cu clientul.** Dacă cele 10 arată cum trebuie pe `/#meniu`, restul e
   muncă mecanică. Dacă nu, se schimbă întâi structura, apoi se multiplică.
2. **Transcrie restul de ~80 de preparate** din PDF, grupate pe aceleași categorii `##`.
   Ordinea categoriilor din PDF se păstrează — e ordinea în care mănâncă oamenii.
3. **Decide ce se afișează.** ~90 de preparate într-o singură secțiune pe prima pagină e
   prea mult. Două variante:
   - secțiunea de pe prima pagină rămâne la 10–12 „specialități ale casei", iar meniul
     complet primește pagina lui;
   - sau secțiunea capătă filtre pe categorie. Costă muncă de motor, deci un task separat.
4. **Verifică prețurile cu clientul înainte de publicare.** Un preț greșit afișat public e
   problemă comercială, nu greșeală de tipar. PDF-ul e datat 2026, dar confirmă că e în vigoare.
5. **Traducerea în `en/`** se face din PDF-ul englezesc, nu din română — au deja versiunea lor,
   folosește-o. Doar dacă pornești „Engleză: da" în `setari.md`.

## Verificare

```bash
npm run verifica
npm run build
```

Zero erori, iar `/#meniu` arată fiecare preparat cu preț, gramaj și ingrediente.
