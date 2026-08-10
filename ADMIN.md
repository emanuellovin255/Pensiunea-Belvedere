# Panoul de administrare — instalare

Se face **o singură dată**, la început. După asta, gazda intră pe
`adresa-site-ului.ro/admin`, scrie parola și editează.

Pentru folosirea de zi cu zi, nu instalarea: [`README.md`](README.md).

---

## Ce trebuie pregătit

Patru variabile de mediu în Vercel. Fără ele, `/admin` arată un ecran care spune ce
lipsește — nu se deschide „fără parolă".

| Variabila | Ce e |
|---|---|
| `ADMIN_PAROLA` | parola cu care intră gazda |
| `ADMIN_SECRET` | un șir aleator, cu care se semnează sesiunea |
| `ADMIN_GITHUB_TOKEN` | token GitHub, ca panoul să poată scrie în repo |
| `ADMIN_GITHUB_REPO` | `emanuellovin255/Pensiunea-Belvedere` |

Opțional: `ADMIN_GITHUB_BRANCH` (implicit `main`).

---

## Pasul 1 · Token-ul GitHub

Un token *fine-grained*, cu acces la **un singur repo** și **o singură permisiune**. Dacă
scapă, nu poate face nimic altundeva.

1. GitHub → poza de profil → **Settings**
2. Jos în stânga: **Developer settings** → **Personal access tokens** →
   **Fine-grained tokens**
3. **Generate new token**
4. Completează:
   - **Token name**: `panou-belvedere`
   - **Expiration**: 1 an. Notează-ți în calendar când expiră — când expiră, panoul nu mai
     poate salva și spune exact asta pe ecran.
   - **Repository access**: **Only select repositories** → alege
     **Pensiunea-Belvedere**. Nu „All repositories".
   - **Permissions** → **Repository permissions** → caută **Contents** → pune-l pe
     **Read and write**. Restul rămân pe „No access".
5. **Generate token** și copiază-l. Se vede o singură dată.

---

## Pasul 2 · Parola și secretul

**Parola** o alege gazda. Nu trece prin nimeni altcineva: se scrie direct în Vercel, la
pasul următor. Ceva lung și ușor de ținut minte e mai bun decât ceva scurt și complicat —
patru cuvinte fără legătură între ele, de exemplu.

**Secretul** e un șir aleator, folosit ca să semneze cookie-ul de sesiune. Nu îl vede și
nu îl scrie nimeni niciodată — se generează o dată. Într-un terminal:

```bash
openssl rand -base64 32
```

Dacă schimbi `ADMIN_SECRET` mai târziu, toate sesiunile deschise cad. E singurul mod de a
„deconecta de pe toate dispozitivele".

---

## Pasul 3 · În Vercel

1. Deschide proiectul în Vercel
2. **Settings** → **Environment Variables**
3. Adaugă, pe rând, cele patru variabile. La fiecare, bifează toate cele trei medii
   (Production, Preview, Development).
4. **Deployments** → cel mai recent → **⋯** → **Redeploy**

Variabilele intră în vigoare abia la următoarea publicare.

---

## Pasul 4 · Proba

1. Intră pe `adresa-site-ului.ro/admin` — trebuie să apară ecranul de parolă.
2. Scrie parola. Ar trebui să vezi dalele mari.
3. Deschide **Camerele**, schimbă un preț, apasă **Salvează**.
4. În GitHub, la **Commits**, trebuie să apară un commit nou: „Panou: camerele".
5. După 1–2 minute, prețul nou se vede pe site.

Dacă pasul 4 nu se întâmplă, mesajul de pe ecran spune ce lipsește — token expirat,
permisiune greșită sau repo scris greșit.

---

## Ce e bine să știe gazda

- **Nimic nu se pierde.** Fiecare salvare e o versiune separată în GitHub. Se poate
  reveni la oricare, oricând.
- **Site-ul se reface în 1–2 minute** după fiecare salvare. Nu instant.
- **Nu strici nimic apăsând un buton.** Panoul scrie doar câmpurile pe care le știe, în
  fișierele pe care le știe.
- **Aceleași fișiere, două drumuri.** Ce salvezi din panou se vede în GitHub și invers.

---

## Recomandat, dar nu obligatoriu

`UPSTASH_REDIS_REST_URL` și `UPSTASH_REDIS_REST_TOKEN` (există deja în
[`.env.example`](.env.example) pentru formularul de contact).

Fără ele, limitarea încercărilor de parolă e doar în memoria funcției, care se resetează
la fiecare instanță nouă — deci cineva care încearcă parole are practic încercări
nelimitate. Cu ele, limita e cinci încercări la cinci minute, oriunde ar cădea cererea.
Contul gratuit Upstash e suficient.

---

## Pentru partea tehnică

**Local, panoul merge fără nicio credențială.** Fără `ADMIN_GITHUB_TOKEN`, salvările merg
direct în fișierele de pe disc — vezi
[`lib/admin/depozit.ts`](lib/admin/depozit.ts). Așa se poate dezvolta și proba tot panoul
fără să atingi repo-ul, iar `git diff` arată exact ce ar fi comis în producție.

`ADMIN_PAROLA` și `ADMIN_SECRET` sunt însă necesare și local, altfel panoul e închis. Se
pun în `.env.local`, care e în `.gitignore`.

După orice modificare în `lib/admin/patch.ts` sau în formatul fișierelor din `date/`:

```bash
npm run proba-patch
```

Rulează probele editorului chirurgical pe fișierele reale. Verifică, printre altele, că o
rescriere identică nu atinge fișierul și că schema panoului vede exact aceleași câmpuri ca
motorul. Trebuie să treacă toate înainte de publicare.

Detaliile de arhitectură, și ce anume din motor a fost atins pentru panou:
[`MOTOR-MODIFICAT.md`](MOTOR-MODIFICAT.md).
