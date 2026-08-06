# T65 · Meniu — restul preparatelor din PDF

**Depinde de:** T63
**Stare:** ⬜ deschis, așteaptă aprobarea mostrei

## Context

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
