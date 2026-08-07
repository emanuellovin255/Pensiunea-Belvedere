# T68 · Conflicte între PDF-ul român și cel englez al meniului

**Depinde de:** T65
**Stare:** ⬜ deschis, așteaptă confirmarea clientului

## Context

Meniul 2026 există în două PDF-uri: `meniu 2026 română  final.pdf` (atenție, **două spații** în
nume) și `meniu 2026 eng final.pdf`. Nu sunt traduceri fidele una alteia — **se contrazic în
șapte locuri**, la prețuri și la gramaje.

Clientul a decis: **româna e sursa de adevăr, în ambele limbi.** Așa s-a și publicat —
`en/07-meniu-restaurant.md` copiază prețurile, gramajele, alergenii și valorile nutriționale din
`date/07-meniu-restaurant.md` și traduce doar textul. PDF-ul englezesc a fost folosit ca sursă de
formulări (cum spun ei „storceag" unui străin), nu de cifre.

Fișierul ăsta există ca să se închidă cercul: cifrele publicate sunt cele din PDF-ul român, dar
nimeni n-a confirmat că PDF-ul român e cel corect. Diferența dintre 40 și 60 de lei pe o salată de
icre nu e greșeală de tipar — e o decizie de preț pe care o ia clientul, nu noi.

## Conflictele

| Preparat | PDF RO (publicat) | PDF EN |
|---|---|---|
| Salată de icre de știucă | 200 g — **60 lei** | 150 g — **40 lei** |
| Platou pescăresc | **2000 g** | 1800 g |
| Ciorbă de pește / storceag | **300 g / 300 g** | 400 g / 400 g |
| Caras prăjit | ulei de **floarea-soarelui** | „palm oil" |
| Frappe clasic | **150 ml** | 300 ml |
| Vinuri Măcin / Murfatlar | secțiune proprie, „Vinuri" | apar sub „SPIRITS", netraduse |
| Red Bull | **Redbull** | „Burn" — alt produs, alt furnizor |

Lipsesc cu totul din PDF-ul englez, deci s-au tradus din română: Cappuccino Vienez, Mujdei ca
extra, Salată de varză (gramaje diferite față de „Fresh cabbage salad").

## Valori care par greșeli de tipar în PDF-ul român

Nu le-am corectat — regula 3 din `REGULI.md`: ce nu e confirmat rămâne necompletat. Rândurile
respective **lipsesc** din `date/`, restul preparatului e întreg.

- sare **93 g** la o porție de pește (ar fi de zece ori doza zilnică);
- **120 g** grăsimi la o cupă de înghețată de 150 g;
- la „Crap la grătar", PDF-ul dă „acizi grași saturați 10,4 g" la 6,8 g lipide totale —
  saturatele nu pot depăși totalul.

## De făcut

1. Trimite clientului tabelul de mai sus și întreabă **care variantă e cea în vigoare** pentru
   fiecare rând.
2. Întreabă separat despre Red Bull vs. Burn: e o schimbare de furnizor sau o greșeală în PDF?
3. Confirmă cele trei valori nutriționale de mai sus, ca să poată fi completate.
4. Corectează `date/07-meniu-restaurant.md` **și** `en/07-meniu-restaurant.md` împreună — sunt
   aceleași cifre în ambele fișiere, prin decizia de mai sus.

## Verificare

```bash
npm run verifica
```

Zero erori. Apoi `/meniu` și `/en/menu` trebuie să arate exact aceleași prețuri și gramaje, în
aceeași ordine — dacă diferă, unul dintre fișiere a fost editat singur.
