# Setări

Ce șablon folosește site-ul și ce secțiuni opționale sunt pornite.

---

## Șablon

Șablon: 2

<!--
  1 = Hero Video              resorturi mari, hoteluri 4-5*, spa. Doar cu filmări bune
  2 = Poveste alternantă      pensiuni, boutique, locații cu o poveste
  3 = Galerie editorială      cabane, chalet-uri, locații spectaculoase
-->

---

## Module

Meniu restaurant: da
Spații de evenimente: nu
Galerie extinsă: nu
Pagina „Zona" (atracții și distanțe): nu
Engleză: da
Plăți online: nu

<!--
  Un modul pe „nu" nu se afișează deloc — nici secțiunea, nici linkul din meniu.

  Meniu restaurant       → completează date/07-meniu-restaurant.md
  Spații de evenimente   → pentru locațiile cu nunți sau conferințe
  Galerie extinsă        → pagină separată de galerie, peste pozele din secțiuni
  Pagina „Zona"          → atracții, distanțe. Aduce trafic din faza „unde mergem?"
  Engleză                → copiază fișierele din date/ în en/ și tradu-le. PORNITĂ: folderul `en/`
                           există, iar la prima vizită site-ul întreabă Română / English
  Plăți online           → NU se pornește fără să citești ghidul 07. Cere bază de date
-->

---

## Secțiuni pe prima pagină

Ordinea de aici e ordinea din site. Șterge un rând ca să scoți secțiunea.

Bandă de încredere: da
Facilități: da
Camere: da
Feature-uri alternante: da
Clip de prezentare: da
Oferte: da
Recenzii: da
Meniu restaurant: da
Hartă: da
Întrebări frecvente: da
Secțiune de închidere: da

<!--
  Clip de prezentare  → apare doar dacă e „da" AICI și dacă blocul
  „## Clip de prezentare" din date/03-prima-pagina.md are video și poster.

  Meniu restaurant    → modulul de mai sus îl PORNEȘTE, dar secțiunea apare pe prima pagină doar
  dacă e trecută și aici. Fără rândul ăsta, meniul nu se randează nicăieri, iar motorul
  te avertizează la `npm run verifica`.
-->


---

## Altele

Buton WhatsApp: da
Meniu PDF: /documente/meniu-belvedere-2026.pdf
Analytics: nu

<!--
  Buton WhatsApp  → un link simplu, nu un widget. La cabane e util
  Meniu PDF       → calea unui fișier din public/. E linkul secundar de jos din pagina `/meniu`,
                    pentru cine vrea meniul salvat pe telefon. NU mai înlocuiește meniul din
                    pagină (T65): prima pagină arată specialitățile casei plus butonul „Vezi
                    meniul complet", iar `/meniu` are tot meniul, indexabil. Șterge rândul ca să
                    scoți linkul către PDF.
  Analytics       → se încarcă doar după acceptul de cookies
-->
