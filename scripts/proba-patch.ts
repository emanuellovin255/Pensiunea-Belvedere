/* ============================================================
   proba-patch.ts — probele editorului chirurgical al panoului.

     npm run proba-patch

   Rulează pe fișierele REALE din `date/` și `en/`, nu pe exemple
   inventate: dacă cineva schimbă un fișier de conținut într-un fel la
   care patch.ts nu se aștepta, probele cad ÎNAINTE ca gazda să apese
   Salvează în panou.

   Ce se verifică, în ordinea importanței:

   1. Panoul citește exact ce citește motorul — aceleași blocuri,
      aceleași câmpuri, același text. Dacă cele două ar diverge, gazda
      ar edita altceva decât ce se vede pe site.
   2. O rescriere IDENTICĂ nu atinge fișierul. Un formular trimite toate
      câmpurile la fiecare salvare; fără asta, prima salvare ar reformata
      tot fișierul și ar face diff-urile din GitHub ilizibile.
   3. O schimbare atinge STRICT liniile ei. Comentariile `<!-- … -->`,
      separatoarele și restul câmpurilor rămân neatinse.
   4. Operațiile inverse se anulează: adaugă+șterge și mută-sus+mută-jos
      refac fișierul octet cu octet.

   Se rulează înainte de `npm run verifica` la orice modificare în
   `lib/admin/patch.ts` sau în formatul fișierelor din `date/`.
   ============================================================ */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { analizeaza, normalizeaza } from '../lib/continut/md'
import {
  blocuri,
  campuri,
  citesteBlocuri,
  gasesteBloc,
  setCamp,
  setDescriere,
  adaugaBloc,
  stergeBloc,
  mutaBloc,
  ordoneazaCampuri,
  stergeCamp,
} from '../lib/admin/patch'
import { FISIERE_PANOU, campuriDin, type Camp } from '../lib/admin/schema'

import { fileURLToPath } from 'node:url'

const RADACINA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATE = path.join(RADACINA, 'date')

let treceri = 0
let picari = 0

function ok(nume: string, condiție: boolean, detaliu = '') {
  if (condiție) {
    treceri++
  } else {
    picari++
    console.log(`  PICAT  ${nume}${detaliu ? '\n         ' + detaliu : ''}`)
  }
}

/**
 * Câte linii s-au schimbat REAL între două texte — cea mai lungă
 * subsecvență comună, ca `git diff`. O comparație linie-cu-linie ar
 * raporta „825 de linii diferite" pentru o singură linie inserată.
 */
function liniiDiferite(a: string, b: string): number {
  const la = a.split('\n')
  const lb = b.split('\n')
  const n = la.length
  const m = lb.length
  // LCS pe rânduri, tabel rulant.
  let prev = new Array(m + 1).fill(0)
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1).fill(0)
    for (let j = 1; j <= m; j++) {
      cur[j] = la[i - 1] === lb[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1])
    }
    prev = cur
  }
  const comune = prev[m]
  return n - comune + (m - comune)
}

/** Comentariile din text, ca listă — trebuie să supraviețuiască orice operație. */
function comentarii(text: string): string[] {
  return text.match(/<!--[\s\S]*?-->/g) ?? []
}

const fisiere = readdirSync(DATE).filter((f) => f.endsWith('.md') && f !== 'README.md')

console.log('\n=== 1. Scanarea vede aceleași blocuri ca parserul motorului ===')
for (const f of fisiere) {
  const text = readFileSync(path.join(DATE, f), 'utf8')
  const alMeu = blocuri(text).filter((b) => b.nivel === 2)
  const alMotorului = analizeaza(text).blocuri
  ok(
    `${f}: număr de blocuri`,
    alMeu.length === alMotorului.length,
    `patch=${alMeu.length} motor=${alMotorului.length}`,
  )
  for (let i = 0; i < Math.min(alMeu.length, alMotorului.length); i++) {
    ok(`${f}: titlu #${i}`, alMeu[i].titlu === alMotorului[i].titlu, `„${alMeu[i].titlu}" vs „${alMotorului[i].titlu}"`)
  }
}

console.log('\n=== 2. Câmpurile citite sunt identice cu ale motorului ===')
for (const f of fisiere) {
  const text = readFileSync(path.join(DATE, f), 'utf8')
  const alMotorului = analizeaza(text).blocuri
  const alMeu = citesteBlocuri(text, 2)
  for (let i = 0; i < Math.min(alMeu.length, alMotorului.length); i++) {
    const m = alMotorului[i]
    const p = alMeu[i]
    for (const [cheie, valoare] of m.campuri) {
      ok(
        `${f} / „${m.titlu}" / ${cheie}`,
        p.campuri[cheie] === valoare,
        `patch=${JSON.stringify(p.campuri[cheie])} motor=${JSON.stringify(valoare)}`,
      )
    }
    // Descrierile se compară cu spațiul alb normalizat, INTENȚIONAT.
    //
    // `md.ts` lipește rândurile unui paragraf cu `\n\n`, iar textul întreg
    // ajunge într-un singur `<p>` (sau într-un `<meta description>`), unde
    // HTML colapsează spațiul alb. Deci „fără cost\n\nsuplimentar" și
    // „fără cost suplimentar" sunt același lucru pe pagină. Panoul arată
    // forma citibilă într-un textarea; ce trebuie să se potrivească e
    // TEXTUL, nu spațiile dintre rânduri.
    const spatii = (x: string) => x.replace(/\s+/g, ' ').trim()
    ok(
      `${f} / „${m.titlu}" / descriere`,
      spatii(p.descriere) === spatii(m.text),
      `patch=${JSON.stringify(p.descriere.slice(0, 70))} motor=${JSON.stringify(m.text.slice(0, 70))}`,
    )
  }
}

console.log('\n=== 3. setCamp schimbă EXACT o linie ===')
{
  const f = '04-camere.md'
  const text = readFileSync(path.join(DATE, f), 'utf8')
  const nou = setCamp(text, { titlu: 'Cameră dublă cu balcon' }, 'pret de la', '999')
  ok('o singură linie atinsă', liniiDiferite(text, nou) === 2, `${liniiDiferite(text, nou)} (o linie scoasă + una pusă)`)
  ok('valoarea nouă e acolo', /Preț de la: 999/.test(nou))
  ok('cheia păstrează diacriticele', /Preț de la:/.test(nou))
  ok('comentariile intacte', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(nou)))
  ok(
    'motorul citește valoarea nouă',
    analizeaza(nou).blocuri.find((b) => b.titlu === 'Cameră dublă cu balcon')?.campuri.get('pret de la') === '999',
  )
  // Celelalte camere nu s-au atins.
  const vechi = analizeaza(text).blocuri
  const dupa = analizeaza(nou).blocuri
  ok(
    'restul camerelor neschimbate',
    vechi.every((b, i) => b.titlu !== 'Cameră dublă cu balcon' ? b.text === dupa[i].text : true),
  )
}

console.log('\n=== 4. setCamp cu cheie scrisă fără diacritice găsește câmpul ===')
{
  const text = readFileSync(path.join(DATE, '04-camere.md'), 'utf8')
  const nou = setCamp(text, { titlu: 'Cameră dublă cu balcon' }, 'PRET DE LA', '777')
  ok('tolerant la diacritice și majuscule', /Preț de la: 777/.test(nou))
  ok('tot o singură linie atinsă', liniiDiferite(text, nou) === 2)
}

console.log('\n=== 5. Listă pe mai multe rânduri: scrisă aliniat, citită întreagă ===')
{
  const text = readFileSync(path.join(DATE, '06-oferte-si-excursii.md'), 'utf8')
  const bucati = ['Cazare 3 nopți, cu mic dejun', 'Acces la piscină, gratuit', 'O excursie cu barca']
  const nou = setCamp(text, { titlu: 'Pachet Paște 2026' }, 'include', bucati.join('\n'))
  const b = analizeaza(nou).blocuri.find((x) => x.titlu === 'Pachet Paște 2026')!
  const citit = b.campuri.get('include')!.split('\n')
  ok('trei elemente, cu virgulele lor', citit.length === 3, JSON.stringify(citit))
  ok('virgula din primul element a rămas', citit[0] === 'Cazare 3 nopți, cu mic dejun', citit[0])
  ok('comentariile intacte', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(nou)))
}

console.log('\n=== 6. Câmp inexistent: se adaugă după ultimul câmp, nu în descriere ===')
{
  const text = readFileSync(path.join(DATE, '04-camere.md'), 'utf8')
  const camera = 'Cameră triplă fără balcon'
  // O cheie care sigur NU e în bloc — camerele au deja `Etichetă: ` gol.
  const nou = setCamp(text, { titlu: camera }, 'Ghid detaliat', 'da')
  const b = analizeaza(nou).blocuri.find((x) => x.titlu === camera)!
  ok('câmpul nou e citit', b.campuri.get('ghid detaliat') === 'da', JSON.stringify(b.campuri.get('ghid detaliat')))
  const vechiB = analizeaza(text).blocuri.find((x) => x.titlu === camera)!
  ok('descrierea nu s-a atins', b.text === vechiB.text, `\n  vechi: ${vechiB.text.slice(0,80)}\n  nou:   ${b.text.slice(0,80)}`)
  ok('celelalte câmpuri neatinse', [...vechiB.campuri].every(([k, v]) => b.campuri.get(k) === v))
  ok('exact o linie în plus, nimic scos', liniiDiferite(text, nou) === 1, `${liniiDiferite(text, nou)}`)

  // Și un câmp care EXISTĂ, dar e gol: e o schimbare de valoare, nu o inserare.
  const nou2 = setCamp(text, { titlu: camera }, 'Etichetă', 'Nou')
  ok('câmp existent gol: o linie atinsă', liniiDiferite(text, nou2) === 2, `${liniiDiferite(text, nou2)}`)
  ok(
    'valoarea a ajuns acolo',
    analizeaza(nou2).blocuri.find((x) => x.titlu === camera)!.campuri.get('eticheta') === 'Nou',
  )
}

console.log('\n=== 7. setDescriere rescrie doar proza ===')
{
  const text = readFileSync(path.join(DATE, '04-camere.md'), 'utf8')
  const nou = setDescriere(text, { titlu: 'Cameră dublă fără balcon' }, 'Un paragraf nou.\n\nȘi al doilea.')
  const b = analizeaza(nou).blocuri.find((x) => x.titlu === 'Cameră dublă fără balcon')!
  ok('descrierea e cea nouă', b.text === 'Un paragraf nou.\n\nȘi al doilea.', JSON.stringify(b.text))
  const vechiB = analizeaza(text).blocuri.find((x) => x.titlu === 'Cameră dublă fără balcon')!
  ok('câmpurile neatinse', [...vechiB.campuri].every(([k, v]) => b.campuri.get(k) === v))
  ok('comentariile intacte', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(nou)))
  // Celelalte camere neatinse
  ok(
    'celelalte camere neatinse',
    analizeaza(text).blocuri.every((x, i) =>
      x.titlu === 'Cameră dublă fără balcon' ? true : x.text === analizeaza(nou).blocuri[i].text,
    ),
  )
}

console.log('\n=== 7b. Descrierea scrisă din panou se rupe pe rânduri, ca fișierul ===')
{
  const text = readFileSync(path.join(DATE, '04-camere.md'), 'utf8')
  const lung =
    'Cameră spațioasă cu balcon propriu, vedere directă spre Lacul Murighiol, pat matrimonial, ' +
    'aer condiționat, minifrigider, televizor LCD și baie proprie cu cabină de duș și uscător de păr.'
  const nou = setDescriere(text, { titlu: 'Cameră dublă cu balcon' }, lung)
  // Doar rândurile BLOCULUI editat — alte camere au și ele descrieri lungi.
  const b = gasesteBloc(nou, { titlu: 'Cameră dublă cu balcon' })
  const randuri = nou.split('\n')
  const camp = campuri(nou, b.start + 1, b.sfarsit)
  const alDescrierii = randuri
    .slice(b.start + 1, b.sfarsit)
    .filter((l, k) => {
      const abs = b.start + 1 + k
      const e = l.trim()
      if (!e || e === '---') return false
      return !camp.some((c) => abs >= c.start && abs < c.sfarsit)
    })
  ok('s-a rupt pe mai multe rânduri', alDescrierii.length >= 2, `${alDescrierii.length} rânduri`)
  ok('niciun rând peste 96 de caractere', alDescrierii.every((l) => l.length <= 96), JSON.stringify(alDescrierii.map((l) => l.length)))
  const citit = analizeaza(nou).blocuri.find((b) => b.titlu === 'Cameră dublă cu balcon')!.text
  ok('motorul citește exact textul dat', citit.replace(/\s+/g, ' ').trim() === lung, JSON.stringify(citit.slice(0, 80)))
  ok('comentariile intacte', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(nou)))
}

console.log('\n=== 8. adaugaBloc / stergeBloc — dus-întors curat ===')
{
  const text = readFileSync(path.join(DATE, '08-recenzii.md'), 'utf8')
  const inainte = analizeaza(text).blocuri.length
  const cu = adaugaBloc(text, {
    titlu: 'O probă de recenzie',
    sablon: 'Autor: Ion Probă\nSursă: Google\nNotă: 5\n\nText de probă.',
  })
  const dupaAdaugare = analizeaza(cu).blocuri
  ok('un bloc în plus', dupaAdaugare.length === inainte + 1)
  const nou = dupaAdaugare[dupaAdaugare.length - 1]
  ok('e ultimul', nou.titlu === 'O probă de recenzie', nou.titlu)
  ok('câmpurile lui se citesc', nou.campuri.get('autor') === 'Ion Probă' && nou.campuri.get('sursa') === 'Google')
  ok('descrierea lui se citește', nou.text === 'Text de probă.', JSON.stringify(nou.text))

  const fara = stergeBloc(cu, { titlu: 'O probă de recenzie' })
  ok('ștergerea reface fișierul exact', fara === text, `${liniiDiferite(fara, text)} linii diferite`)
}

console.log('\n=== 9. mutaBloc — schimbă doar ordinea ===')
{
  const text = readFileSync(path.join(DATE, '08-recenzii.md'), 'utf8')
  const titluri = () => (t: string) => analizeaza(t).blocuri.map((b) => b.titlu)
  const inainte = analizeaza(text).blocuri.map((b) => b.titlu)
  const jos = mutaBloc(text, { index: 1 }, 'jos')
  const dupa = analizeaza(jos).blocuri.map((b) => b.titlu)
  const asteptat = [...inainte]
  ;[asteptat[1], asteptat[2]] = [asteptat[2], asteptat[1]]
  ok('ordinea s-a schimbat corect', JSON.stringify(dupa) === JSON.stringify(asteptat), `\n  ${JSON.stringify(dupa)}\n  ${JSON.stringify(asteptat)}`)
  ok('conținutul blocurilor e neatins', analizeaza(jos).blocuri.every((b) => {
    const orig = analizeaza(text).blocuri.find((x) => x.titlu === b.titlu)!
    return orig.text === b.text && [...orig.campuri].every(([k, v]) => b.campuri.get(k) === v)
  }))
  const sus = mutaBloc(jos, { index: 2 }, 'sus')
  ok('mutarea înapoi reface fișierul', sus === text, `${liniiDiferite(sus, text)} linii diferite`)
}

console.log('\n=== 10. setari.md — comutatoare și reordonare de secțiuni ===')
{
  const cale = path.join(RADACINA, 'setari.md')
  const text = readFileSync(cale, 'utf8')

  const oprit = setCamp(text, { titlu: 'Module' }, 'meniu restaurant', 'nu')
  ok('modulul s-a oprit', /Meniu restaurant: nu/.test(oprit))
  ok('o singură linie atinsă', liniiDiferite(text, oprit) === 2, `${liniiDiferite(text, oprit)}`)
  ok('comentariile din setari.md intacte', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(oprit)))
  // ATENȚIE: „Meniu restaurant" apare ȘI la Module, ȘI la Secțiuni. Verificăm
  // că s-a schimbat doar cel din Module.
  const secțiuni = analizeaza(oprit).blocuri.find((b) => b.titlu.includes('Secțiuni'))!
  ok('secțiunea cu același nume NU s-a atins', secțiuni.campuri.get('meniu restaurant') === 'da', secțiuni.campuri.get('meniu restaurant'))

  const scos = stergeCamp(text, { titlu: 'Secțiuni pe prima pagină' }, 'harta')
  const s2 = analizeaza(scos).blocuri.find((b) => b.titlu.includes('Secțiuni'))!
  ok('rândul secțiunii a dispărut', s2.campuri.get('harta') === undefined)
  ok('restul secțiunilor au rămas', s2.campuri.get('camere') === 'da' && s2.campuri.get('recenzii') === 'da')

  const reordonat = ordoneazaCampuri(text, { titlu: 'Secțiuni pe prima pagină' }, [
    'Camere',
    'Oferte',
    'Recenzii',
    'Bandă de încredere',
  ])
  const s3 = analizeaza(reordonat).blocuri.find((b) => b.titlu.includes('Secțiuni'))!
  const chei = [...s3.campuri.keys()]
  ok('prima e Camere', chei[0] === 'camere', chei.slice(0, 5).join(', '))
  ok('a doua e Oferte', chei[1] === 'oferte', chei.slice(0, 5).join(', '))
  ok('toate secțiunile sunt încă acolo', chei.length === [...analizeaza(text).blocuri.find((b) => b.titlu.includes('Secțiuni'))!.campuri.keys()].length, `${chei.length}`)
  ok('comentariile intacte la reordonare', JSON.stringify(comentarii(text)) === JSON.stringify(comentarii(reordonat)))
}

console.log('\n=== 11. Meniul restaurantului: preparate `###` ===')
{
  const text = readFileSync(path.join(DATE, '07-meniu-restaurant.md'), 'utf8')
  // Un preparat care ARE preț — la micul dejun sunt incluse în cazare.
  const cuPret = analizeaza(text)
    .blocuri.flatMap((b) => b.subblocuri.map((s) => ({ categorie: b.titlu, s })))
    .find((x) => x.s.campuri.get('pret'))!
  ok('am găsit un preparat cu preț', !!cuPret, JSON.stringify(cuPret?.s.titlu))

  const nou = setCamp(text, { titlu: cuPret.s.titlu, nivel: 3, parinte: cuPret.categorie }, 'pret', '42')
  ok('prețul preparatului: o singură linie', liniiDiferite(text, nou) === 2, `${liniiDiferite(text, nou)} (o linie scoasă + una pusă)`)
  const doc = analizeaza(nou)
  const categorie = doc.blocuri.find((b) => b.titlu === cuPret.categorie)!
  const preparat = categorie.subblocuri.find((s) => s.titlu === cuPret.s.titlu)!
  ok('motorul citește prețul nou', preparat.campuri.get('pret') === '42', preparat.campuri.get('pret'))
  ok(
    'celelalte preparate din categorie neatinse',
    categorie.subblocuri.every((s) => {
      if (s.titlu === cuPret.s.titlu) return true
      const v = analizeaza(text).blocuri.find((b) => b.titlu === cuPret.categorie)!.subblocuri.find((x) => x.titlu === s.titlu)!
      return s.campuri.get('pret') === v.campuri.get('pret') && s.text === v.text
    }),
  )
}

console.log('\n=== 12. Un `##` citat într-un comentariu NU e bloc ===')
{
  const text = readFileSync(path.join(RADACINA, 'setari.md'), 'utf8')
  const titluri = blocuri(text).filter((b) => b.nivel === 2).map((b) => b.titlu)
  ok('nu apare „Clip de prezentare" ca bloc', !titluri.includes('Clip de prezentare'), titluri.join(' | '))
  ok('blocurile reale sunt cele patru', titluri.length === 4, titluri.join(' | '))
}

console.log('\n=== 13. Un câmp explicat în comentariu NU e câmp ===')
{
  const text = readFileSync(path.join(DATE, '01-nume-logo-si-descriere.md'), 'utf8')
  const alMeu = citesteBlocuri(text, 2)
  const alMotorului = analizeaza(text).blocuri
  for (let i = 0; i < alMotorului.length; i++) {
    const cheiMotor = [...alMotorului[i].campuri.keys()].sort()
    const cheiPatch = Object.keys(alMeu[i].campuri).sort()
    ok(
      `„${alMotorului[i].titlu}": aceleași chei`,
      JSON.stringify(cheiMotor) === JSON.stringify(cheiPatch),
      `motor=${cheiMotor.join(',')} patch=${cheiPatch.join(',')}`,
    )
  }
}

console.log('\n=== 14. Titlu ambiguu → eroare, nu ghicit ===')
{
  const text = readFileSync(path.join(DATE, '04-camere.md'), 'utf8')
  let aArunca = false
  try {
    gasesteBloc(text, { titlu: 'Cameră' })
  } catch (e) {
    aArunca = true
    ok('eroarea spune cu ce s-a potrivit', String(e).includes('se potrivește'), String(e))
  }
  ok('un titlu ambiguu aruncă', aArunca)

  let aAruncat2 = false
  try {
    gasesteBloc(text, { titlu: 'Nu există așa ceva' })
  } catch (e) {
    aAruncat2 = true
    ok('eroarea listează ce există', String(e).includes('În fișier sunt'), String(e))
  }
  ok('un titlu inexistent aruncă', aAruncat2)
}

console.log('\n=== 15. Toate fișierele: o rescriere identică nu schimbă nimic ===')
// Asta e proba care contează cel mai mult în practică: un formular trimite
// TOATE câmpurile la fiecare salvare, nu doar pe cel editat. Dacă rescrierea
// identică nu e no-op, prima salvare a gazdei ar reformata tot fișierul.
for (const f of fisiere) {
  const text = readFileSync(path.join(DATE, f), 'utf8')
  let nou = text

  for (const b of citesteBlocuri(text, 2)) {
    for (const [cheie, valoare] of Object.entries(b.campuri)) {
      nou = setCamp(nou, { index: b.index }, cheie, valoare)
    }
    nou = setDescriere(nou, { index: b.index }, b.descriere)

    // Și sub-blocurile `###`, dacă are (categoriile din meniu).
    for (const s of citesteBlocuri(text, 3, b.titlu)) {
      for (const [cheie, valoare] of Object.entries(s.campuri)) {
        nou = setCamp(nou, { titlu: s.titlu, nivel: 3, parinte: b.titlu }, cheie, valoare)
      }
      nou = setDescriere(nou, { titlu: s.titlu, nivel: 3, parinte: b.titlu }, s.descriere)
    }
  }

  ok(`${f}: rescrierea identică e no-op`, nou === text, `${liniiDiferite(nou, text)} linii diferite`)
}

console.log('\n=== 16. setari.md: rescrierea identică e no-op ===')
{
  const cale = path.join(RADACINA, 'setari.md')
  const text = readFileSync(cale, 'utf8')
  let nou = text
  for (const b of citesteBlocuri(text, 2)) {
    for (const [cheie, valoare] of Object.entries(b.campuri)) {
      nou = setCamp(nou, { index: b.index }, cheie, valoare)
    }
  }
  ok('setari.md neatins', nou === text, `${liniiDiferite(nou, text)} linii diferite`)

  // Reordonare cu ordinea CURENTĂ: tot no-op.
  const chei = Object.keys(citesteBlocuri(text, 2).find((b) => b.titlu.includes('Secțiuni'))!.campuri)
  const acelasi = ordoneazaCampuri(text, { titlu: 'Secțiuni pe prima pagină' }, chei)
  ok('reordonarea în aceeași ordine e no-op', acelasi === text, `${liniiDiferite(acelasi, text)} linii diferite`)
}

console.log('\n=== 17. Fișierele din en/ trec aceleași probe ===')
{
  const EN = path.join(RADACINA, 'en')
  for (const f of readdirSync(EN).filter((x) => x.endsWith('.md') && x !== 'README.md')) {
    const text = readFileSync(path.join(EN, f), 'utf8')
    const alMeu = blocuri(text).filter((b) => b.nivel === 2).map((b) => b.titlu)
    const alMotorului = analizeaza(text).blocuri.map((b) => b.titlu)
    ok(`en/${f}: aceleași blocuri ca motorul`, JSON.stringify(alMeu) === JSON.stringify(alMotorului), `${alMeu.length} vs ${alMotorului.length}`)

    let nou = text
    for (const b of citesteBlocuri(text, 2)) {
      for (const [cheie, valoare] of Object.entries(b.campuri)) nou = setCamp(nou, { index: b.index }, cheie, valoare)
      nou = setDescriere(nou, { index: b.index }, b.descriere)
      for (const s of citesteBlocuri(text, 3, b.titlu)) {
        for (const [cheie, valoare] of Object.entries(s.campuri)) {
          nou = setCamp(nou, { titlu: s.titlu, nivel: 3, parinte: b.titlu }, cheie, valoare)
        }
        nou = setDescriere(nou, { titlu: s.titlu, nivel: 3, parinte: b.titlu }, s.descriere)
      }
    }
    ok(`en/${f}: rescrierea identică e no-op`, nou === text, `${liniiDiferite(nou, text)} linii diferite`)
  }
}

console.log('\n=== 18. Schema panoului se potrivește cu fișierele reale ===')
{
  // Proba care contează cel mai mult după cele de mai sus: o cheie scrisă
  // greșit în `schema.ts` face ca panoul să scrie un câmp pe care motorul
  // îl ignoră în tăcere — exact felul de bug care se descoperă abia când
  // gazda întreabă „de ce nu se vede prețul pe care l-am pus".
  for (const f of FISIERE_PANOU) {
    const cale = path.join(DATE, f.fisier)
    ok(`${f.id}: fișierul „${f.fisier}" există`, existsSync(cale), cale)
    if (!existsSync(cale)) continue

    const text = readFileSync(cale, 'utf8')
    const doc = analizeaza(text)
    const cheiDinFisier = new Set<string>()
    for (const b of doc.blocuri) {
      for (const k of b.campuri.keys()) cheiDinFisier.add(k)
      for (const sb of b.subblocuri) for (const k of sb.campuri.keys()) cheiDinFisier.add(k)
    }

    // Cheia scrisă în schemă trebuie să fie deja normalizată — altfel nu se
    // potrivește niciodată cu ce citește parserul.
    for (const c of campuriDin(f)) {
      ok(
        `${f.id} / ${c.cheie}: cheie normalizată`,
        c.cheie === normalizeaza(c.cheie),
        `„${c.cheie}" ar trebui „${normalizeaza(c.cheie)}"`,
      )
      ok(
        `${f.id} / ${c.cheie}: „${c.cheieScrisa}" se normalizează la ea`,
        normalizeaza(c.cheieScrisa) === c.cheie,
        `„${c.cheieScrisa}" → „${normalizeaza(c.cheieScrisa)}", nu „${c.cheie}"`,
      )
    }

    // Blocurile fixe declarate trebuie să existe cu adevărat.
    if (f.forma.fel === 'fixe') {
      for (const b of f.forma.blocuri) {
        let gasit = true
        try {
          gasesteBloc(text, { titlu: b.titlu })
        } catch {
          gasit = false
        }
        ok(`${f.id}: blocul „${b.titlu}" există în fișier`, gasit)
      }
    } else if (f.forma.antet) {
      let gasit = true
      try {
        gasesteBloc(text, { titlu: f.forma.antet.titlu })
      } catch {
        gasit = false
      }
      ok(`${f.id}: antetul „${f.forma.antet.titlu}" există`, gasit)
    }
  }

  // Invers: un câmp care EXISTĂ în fișier și are conținut, dar pe care
  // schema nu-l acoperă, e conținut invizibil în panou. Gazda l-ar putea
  // pierde fără să știe.
  //
  // Excepțiile sunt DELIBERATE și scrise aici, cu motivul lor — nu tăcute.
  // Dacă apare un câmp nou neacoperit, proba cade și cineva trebuie să
  // decidă: intră în panou, sau intră în lista asta?
  const NEACOPERITE_INTENTIONAT: Record<string, string[]> = {
    // Motorul de rezervări și plățile online sunt configurare tehnică:
    // se ating o dată, la lansare, de partea tehnică. Un comutator „Plăți
    // online" în panou ar fi un buton care cere bază de date, chei Netopia
    // și un contract — nu ceva de apăsat din greșeală.
    '10-rezervari-si-plati.md': ['tip', 'sistem', 'adresa', 'activ'],
  }

  const acoperite = new Map<string, Set<string>>()
  for (const f of FISIERE_PANOU) {
    const set = acoperite.get(f.fisier) ?? new Set<string>()
    for (const c of campuriDin(f)) set.add(c.cheie)
    acoperite.set(f.fisier, set)
  }
  for (const [fisier, chei] of acoperite) {
    const text = readFileSync(path.join(DATE, fisier), 'utf8')
    const scutite = NEACOPERITE_INTENTIONAT[fisier] ?? []
    const lipsa = new Set<string>()
    for (const b of analizeaza(text).blocuri) {
      for (const [k, v] of b.campuri) if (v.trim() && !chei.has(k) && !scutite.includes(k)) lipsa.add(k)
    }
    ok(
      `${fisier}: schema acoperă toate câmpurile completate`,
      lipsa.size === 0,
      `neacoperite: ${[...lipsa].join(', ')}`,
    )
  }
}

console.log('\n=== 19. Nicio proză înghițită ca „câmp" ===')
{
  // Capcana care a ascuns complet o întrebare frecventă de pe site: un rând
  // de răspuns care începe cu puține cuvinte urmate de `:` („Da, la pachetele
  // turistice: 75%…") e citit ca `Cheie: valoare`. Textul dispare din bloc,
  // iar un bloc fără text nu se randează.
  //
  // Testul: toate cheile REALE din `date/` încep cu majusculă. Una cu
  // minusculă e proză înghițită.
  for (const dir of ['date', 'en']) {
    const folder = path.join(RADACINA, dir)
    for (const f of readdirSync(folder).filter((x) => x.endsWith('.md') && x !== 'README.md')) {
      const text = readFileSync(path.join(folder, f), 'utf8')
      const suspecte: string[] = []
      for (const b of blocuri(text)) {
        const copil = blocuri(text).find((x) => x.nivel > b.nivel && x.start > b.start && x.start < b.sfarsit)
        for (const c of campuri(text, b.start + 1, copil ? copil.start : b.sfarsit)) {
          if (/^[a-zăâîșț]/.test(c.cheieBruta)) suspecte.push(`${f}:${c.start + 1} „${c.cheieBruta}"`)
        }
      }
      ok(`${dir}/${f}: nicio cheie cu literă mică`, suspecte.length === 0, suspecte.join(' · '))
    }
  }

  // Și blocuri rămase complet goale — nu ajung pe site.
  for (const dir of ['date', 'en']) {
    const folder = path.join(RADACINA, dir)
    for (const f of readdirSync(folder).filter((x) => x.endsWith('.md') && x !== 'README.md')) {
      const goale = analizeaza(readFileSync(path.join(folder, f), 'utf8'))
        .blocuri.filter((b) => b.titlu.trim() && !b.text.trim() && !b.campuri.size && !b.subblocuri.length)
        .map((b) => b.titlu)
      ok(`${dir}/${f}: niciun bloc complet gol`, goale.length === 0, goale.join(' · '))
    }
  }
}

console.log(`\n${'─'.repeat(50)}`)
console.log(`  ${treceri} treceri · ${picari} picări`)
console.log(picari ? '  NU e gata.\n' : '  Toate probele trec.\n')
process.exit(picari ? 1 : 0)
