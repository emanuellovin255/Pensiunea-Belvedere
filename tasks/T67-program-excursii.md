# T67 · Programul detaliat al celor 6 excursii

**Depinde de:** —
**Stare:** ⬜ deschis, așteaptă textul de la client

## Context

Pe 7 august 2026 clientul a confirmat că se fac **șase** trasee, nu opt, și a început să dicteze
programul detaliat al fiecăruia. **Mesajul lui s-a întrerupt la traseul 3**, la jumătatea
propoziției („…prin Delta Dunării până Pădurea Le"). Ce a apucat să trimită e transcris mai jos,
ca să nu se piardă.

Între timp, `date/06-oferte.md` a rămas cu descrierile vechi, preluate de pe site-ul lor: fiecare
traseu are înșiruirea canalelor și a lacurilor, dar niciun program cu ore. Așa a cerut clientul —
descrierile actuale rămân până vine textul întreg.

## Ce a dat clientul (verbatim, needitat)

**Cadrul comun.** Excursiile se fac cu ambarcațiuni mari, acoperite și închise, cu canapele și
fotolii din piele, special amenajate pentru excursii.

**1. Turul celor 7 lacuri.** Excursie de 2 h, tur de admirare a faunei și florei din Delta
Dunării. Plecare ora 10:00, întoarcere ora 12:00. Preț 120 lei/persoană.

**2. Mila 23.** Excursie cu barca până la Mila 23, 2 h de traseu de admirare a faunei și florei.
Ajunși la ora 12:00, se vizitează Muzeul Ivan Patzaichin, 1 h. După aceea, prânzul la un punct
gastronomic local pe malul Dunării, în plină natură: storceag de sturion, pește prăjit,
mămăliguță și mujdei, desert, apă plată/minerală, vin și țuică incluse — prânz complet
100 lei/persoană. Se stă la masă 1–1,5 h, după care se revine pe un alt traseu, 2 h până în port.
Preț 200 lei/persoană.

**3. Pădurea Letea.** „Excursie cu barca prin Delta Dunării până Pădurea Le" — **aici s-a tăiat
mesajul.**

## Ce lipsește

1. **Traseele 3–6 integral.** Traseul 3 e Pădurea Letea; care sunt celelalte trei și în ce
   ordine, nu se știe. Cele șase blocuri din fișier sunt acum: Șapte lacuri, Plaja Sulina,
   Plaja Sfântu Gheorghe, Pădurea Letea, Pădurea Caraorman, Mila 23.
2. **Numele lacului al șaptelea.** Clientul îi zice „turul celor 7 lacuri", dar lista publicată
   de ei are șase nume: Uzlina, Durnuleapca, Isăcel, CabluVata, Criscioara, Hleboca. Titlul
   cardului a fost schimbat în „Șapte lacuri din Deltă"; lista a rămas de șase.
3. **Durata reală a turului scurt.** Clientul zice 2 h (10:00–12:00), fișierul zice „2,5 – 3 ore",
   preluat de pe site-ul lor. Una din două e greșită.

## De făcut, când vine textul

1. Rescrie corpul fiecărui bloc `## Excursie: …` din `date/06-oferte.md` cu programul dictat:
   ore de plecare și întoarcere, ce se vizitează, unde se oprește la masă.
2. **Sumele intră în textul programului, nu în `Preț:`.** Decizie explicită a clientului:
   tarifele variază cu sezonul, cu vremea și cu numărul de persoane, deci pe card rămâne
   „Cere ofertă". Un `Preț:` adăugat aici ar apărea automat și în schema Offer din Google, ca
   ofertă fermă.
3. Adaugă lacul al șaptelea în lista de la „Șapte lacuri din Deltă" și șterge comentariul de
   avertizare de sub bloc.
4. Corectează `Valabil:` la turul scurt, după ce se lămurește 2 h vs. 2,5–3 h. (Atenție:
   `Valabil:` e o cheie validă, dar motorul n-o citește în `Offer` — azi nu se vede nicăieri
   în site. Dacă durata trebuie afișată, e muncă de motor, nu de conținut.)
5. Menționează undeva vizibil ambarcațiunile: mari, acoperite și închise, cu canapele și fotolii
   din piele. Azi prima pagină spune doar „ambarcațiuni mari și acoperite" — detaliul cu
   interiorul e un diferențiator real față de bărcile deschise ale concurenței.

## Verificare

```bash
npm run verifica && npm run build
```

Fiecare din cele 6 pagini `/oferte/excursie-…` are program cu ore, iar niciun card de excursie
nu afișează preț.
