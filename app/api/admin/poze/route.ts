/* ============================================================
   Biblioteca de poze: listare, încărcare, ștergere.

   Parte din panoul de administrare, o modificare locală față de
   motorul-sursă. Vezi `MOTOR-MODIFICAT.md`.

   MICȘORAREA SE FACE ÎN BROWSER, nu aici. `components/admin/UrcaPoza.tsx`
   trece poza prin `<canvas>` și o dă în `.webp` înainte s-o trimită. Așa
   o poză de 12 MB făcută cu telefonul ajunge în repo la câteva sute de KB,
   fără `sharp` într-o funcție serverless și fără un upload de 12 MB pe o
   conexiune de la Murighiol.

   Limita de mai jos e plasa de siguranță pentru cazul în care ceva a
   ocolit micșorarea.
   ============================================================ */

import { eroare, eroareLaSalvare, numeSigur, ok } from '@/lib/admin/api'
import { citeste, listeaza, scrie, sterge } from '@/lib/admin/depozit'
import { FISIERE_PANOU } from '@/lib/admin/schema'
import { cereSesiune } from '@/lib/admin/sesiune'

/** 6 MB — de zece ori peste ce ar trebui să iasă din micșorare. */
const MAX_OCTETI = 6 * 1024 * 1024

const EXT_IMAGINE = ['.webp', '.jpg', '.jpeg', '.png', '.avif', '.svg', '.gif']
const EXT_VIDEO = ['.mp4', '.webm', '.mov']

function fel(nume: string): 'imagine' | 'video' | 'altul' {
  const n = nume.toLowerCase()
  if (EXT_IMAGINE.some((e) => n.endsWith(e))) return 'imagine'
  if (EXT_VIDEO.some((e) => n.endsWith(e))) return 'video'
  return 'altul'
}

export async function GET(): Promise<Response> {
  const refuz = await cereSesiune()
  if (refuz) return refuz

  const toate = await listeaza('poze')
  const poze = toate
    // `.md` e ghidul folderului, `_manifest.json` e generat.
    .filter((p) => fel(p.nume) !== 'altul')
    .map((p) => ({ nume: p.nume, sha: p.sha, marime: p.marime, fel: fel(p.nume) }))
    .sort((a, b) => a.nume.localeCompare(b.nume, 'ro'))

  return ok({ poze })
}

/* ------------------------------------------------------------------ */

export async function POST(cerere: Request): Promise<Response> {
  const refuz = await cereSesiune()
  if (refuz) return refuz

  let corp: { nume?: string; date?: string }
  try {
    corp = (await cerere.json()) as { nume?: string; date?: string }
  } catch {
    return eroare('Cerere greșită.')
  }

  const nume = numeSigur(corp.nume ?? '')
  if (!nume) {
    return eroare(
      'Numele fișierului poate avea doar litere fără diacritice, cifre, cratime și puncte.',
    )
  }
  if (fel(nume) === 'altul') {
    return eroare('Se pot încărca doar poze (.webp, .jpg, .png) și clipuri (.mp4, .webm, .mov).')
  }

  // `date` vine ca `data:` URL din `<canvas>`; luăm doar partea base64.
  const base64 = (corp.date ?? '').replace(/^data:[^;]+;base64,/, '')
  if (!base64) return eroare('Fișierul a ajuns gol.')

  let octeti: Uint8Array
  try {
    const bin = atob(base64)
    octeti = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) octeti[i] = bin.charCodeAt(i)
  } catch {
    return eroare('Fișierul n-a putut fi citit.')
  }

  if (octeti.length > MAX_OCTETI) {
    const mb = (octeti.length / 1024 / 1024).toFixed(1)
    return eroare(`Fișierul are ${mb} MB, prea mult. Limita e 6 MB.`)
  }

  try {
    // Suprascrierea e intenționată: „aceeași poză, versiune nouă" e cel
    // mai simplu mod de a înlocui o imagine peste tot unde e folosită.
    const existent = await citeste(`poze/${nume}`)
    const r = await scrie({
      cale: `poze/${nume}`,
      continut: octeti,
      sha: existent?.sha,
      mesaj: existent ? `Panou: poză înlocuită — ${nume}` : `Panou: poză nouă — ${nume}`,
    })
    return ok({ ok: true, nume, sha: r.sha, inlocuita: Boolean(existent) })
  } catch (e) {
    return eroareLaSalvare(e)
  }
}

/* ------------------------------------------------------------------ */

/**
 * Ștergerea verifică ÎNTÂI dacă poza e chemată din vreun fișier de
 * conținut, în ambele limbi. O poză ștearsă care era folosită lasă un gol
 * pe site, iar gazda ar afla din reclamația unui oaspete.
 */
export async function DELETE(cerere: Request): Promise<Response> {
  const refuz = await cereSesiune()
  if (refuz) return refuz

  const u = new URL(cerere.url)
  const nume = numeSigur(u.searchParams.get('nume') ?? '')
  if (!nume) return eroare('Nu știu ce poză să șterg.')

  const folosita: string[] = []
  const numeFisiere = [...new Set(FISIERE_PANOU.map((f) => f.fisier))]
  for (const limba of ['date', 'en']) {
    for (const fisier of numeFisiere) {
      const f = await citeste(`${limba}/${fisier}`)
      if (f?.continut.includes(nume)) folosita.push(`${limba}/${fisier}`)
    }
  }

  if (folosita.length && u.searchParams.get('oricum') !== 'da') {
    return eroare(
      `Poza „${nume}" e folosită în ${folosita.join(', ')}. Scoate-o de acolo mai întâi, ` +
        'sau confirmă ștergerea și locurile alea rămân fără poză.',
      409,
      { folosita },
    )
  }

  try {
    const existent = await citeste(`poze/${nume}`)
    if (!existent) return eroare(`Poza „${nume}" nu există.`, 404)
    await sterge({ cale: `poze/${nume}`, sha: existent.sha, mesaj: `Panou: poză ștearsă — ${nume}` })
    return ok({ ok: true })
  } catch (e) {
    return eroareLaSalvare(e)
  }
}
