# Propunere — Belvedere Murighiol

> Generat de `npm run analiza` din https://www.belvederemurighiol.ro/ la 06.08.2026.
> Un document de decizie, nu conținut de site. Citește-l în 5 minute, apoi rulează `npm run client-nou`.

## 1 · Ce am extras

- **Nume:** Belvedere Murighiol
- **Contact:** 0754 318 813 · belvederemurighiol@gmail.com
- **Adresă:** Str. Peninsula 2, loc. Murighiol, Tulcea
- **Camere:** 0 găsite, dintre care 0 cu preț pe site
- **Oferte:** 0
- **Recenzii:** 3 citate (fără autor/sursă — nu se afișează până nu le completezi)
- **Întrebări frecvente:** 0
- **Imagini descărcate și re-encodate WebP:** 1

## 2 · Ce lipsește (de completat înainte de lansare)

- Nu am identificat camere — completează `date/04-camere.md` manual.
- Nu am găsit întrebări frecvente — adaugă-le în `date/09-intrebari-frecvente.md` (contează pentru FAQPage schema).
- Recenziile preluate NU au autor și sursă — completează-le sau șterge-le, altfel nu se afișează (REGULI.md 3).
- Textele de campanie (`date/03-prima-pagina.md`: titlu hero, subtitlu, secțiune de închidere) sunt goale intenționat — sunt singurele care nu se extrag și trebuie scrise.

## 3 · Auditul site-ului actual

_Argumentul de vânzare. Fiecare constatare are dovada măsurată, nu o afirmație generică._

### [CRITIC] Marcaj structurat greșit pentru un hotel
- **Dovada:** Pagina declară VideoObject, Organization, PostalAddress, Place, GeoCoordinates, WebSite, SearchAction — niciun tip de cazare.
- **Ce facem în loc:** Hotel + LocalBusiness pe homepage, HotelRoom și Offer pe camere, AggregateRating și FAQPage unde există date reale.

### [CRITIC] Prețurile nu sunt vizibile
- **Dovada:** Nicio sumă afișată pe pagină — vizitatorul trebuie să plece de pe site ca să afle cât costă.
- **Ce facem în loc:** Preț „de la" pe fiecare cameră și pe fiecare pachet, marcat Offer pentru Google.

### [CRITIC] Rezervarea pleacă pe alt domeniu
- **Dovada:** Butoanele de rezervare trimit către www.facebook.com, în afara site-ului.
- **Ce facem în loc:** Calendar și disponibilitate direct în pagină; utilizatorul intră în motor abia la pasul de plată, cu datele deja completate.

### [IMPORTANT] HTML-ul nu se cachează
- **Dovada:** Serverul trimite Cache-Control: no-store, no-cache, must-revalidate — fiecare vizitator regenerează pagina.
- **Ce facem în loc:** Pagini pre-randate, servite din CDN, cu revalidare incrementală la publicarea de conținut nou.

### [IMPORTANT] Atribuirea campaniilor se rupe la rezervare
- **Dovada:** Sesiunea trece de pe www.belvederemurighiol.ro pe www.facebook.com; fără linker cross-domain conversia apare ca trafic de recomandare.
- **Ce facem în loc:** Un singur flux de măsurare peste ambele domenii, cu evenimente de conversie definite pe pașii reali.

### [IMPORTANT] Imagini în formate vechi
- **Dovada:** 17 imagini JPEG/PNG față de 0 în format modern.
- **Ce facem în loc:** Toate imaginile re-encodate AVIF/WebP, dimensionate pe punctul de afișare, cu lățime și înălțime declarate.

### [IMPORTANT] Prea puține pagini pentru a domina căutările locale
- **Dovada:** Sitemap-ul listează 25 adrese.
- **Ce facem în loc:** Pagini dedicate pentru fiecare intenție locală reală, nu conținut de umplutură.

## 4 · Șablonul recomandat

**Șablon 2 · Poveste alternantă**

Șablonul 2 (Poveste alternantă) — cel mai versatil, pentru o locație cu o poveste de spus și fără footage video sau o galerie foarte bogată.

```bash
npm run client-nou -- belvedere-murighiol --sablon 2
```

## 5 · Feature-uri propuse

- **Meniu restaurant** — au o pagină de restaurant / meniu. Pornește modulul și completează `date/07-meniu-restaurant.md`.
- **Spații de evenimente** — au conținut despre nunți sau conferințe. Pornește modulul „Spații de evenimente".
- **Engleză** — site-ul are deja o versiune sau marcaj de limbă engleză. Pornește modulul și tradu `date/` în `en/`.

## 6 · Motorul de rezervări detectat

**Fără motor de rezervări** — se recomandă formular + telefon.

La cabane și pensiuni mici, telefonul rămâne canalul principal; formularul trimite cererea pe email, fără bază de date.

