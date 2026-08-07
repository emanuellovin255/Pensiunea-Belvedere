import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { siteCurent } from '@/lib/site'

/**
 * Favicon-ul, generat per site. Fără el, browserul cere `/favicon.ico`,
 * primește 404 și îl scrie în consolă — ceea ce Lighthouse punctează la
 * „best practices".
 *
 * Două variante, în ordinea asta:
 *
 *  1. LOGO-UL CLIENTULUI, dacă `date/01-identitate.md` are unul. E marca
 *     pe care o recunoaște omul în bara de tab-uri, deci are prioritate.
 *     Fără fundal colorat: logo-ul are deja forma și culoarea lui, iar
 *     `theme.colors.brand` din date nu e neapărat culoarea pe care o
 *     randează site-ul — o pastilă dintr-o a treia culoare ar fi arătat
 *     ca a altui site.
 *  2. MONOGRAMA pe culoarea de brand — plasa de siguranță pentru clienții
 *     fără logo (și pentru demo). ASCII, deci fontul implicit ajunge.
 *
 * Fișierul se citește de pe disc și se inline-ază ca `data:` URI: ruta e
 * prerandată static la build (vezi `○ /icon` în raportul de build), când
 * `public/media/` e deja scris de `sync-media` (prebuild). `ImageResponse`
 * n-ar putea oricum să ceară o adresă relativă — la build nu există un
 * server de la care s-o ceară.
 */
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

/** Tipurile pe care `ImageResponse` le poate desena într-un `<img>`. */
const TIP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

/**
 * Logo-ul ca `data:` URI, sau `null` dacă nu există ori are un format pe
 * care `ImageResponse` nu-l poate desena (`.webp`, `.avif`). Nu aruncă
 * niciodată: un favicon lipsă e o notă, nu un build căzut.
 */
function logoInline(logo: string | undefined): string | null {
  if (!logo) return null
  const nume = logo.replace(/^\/media\//, '')
  const ext = (nume.match(/\.[^.]+$/)?.[0] ?? '').toLowerCase()
  const tip = TIP[ext]
  if (!tip) return null

  const cwd = process.cwd()
  for (const cale of [path.join(cwd, 'public', 'media', nume), path.join(cwd, 'poze', nume)]) {
    if (!existsSync(cale)) continue
    try {
      return `data:${tip};base64,${readFileSync(cale).toString('base64')}`
    } catch {
      return null
    }
  }
  return null
}

export default function Icon() {
  const { date } = siteCurent('ro')
  // Loader-ul dă mereu culorile temei (au valori implicite în lib/continut),
  // deci nu e nevoie de un hex de rezervă scris în cod (regula 4).
  const brand = date.theme.colors.brand
  const onBrand = date.theme.colors.onBrand
  const monogram = date.brand.monogram || 'H'

  const src = logoInline(date.brand.logo)

  if (src) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={62} height={62} style={{ objectFit: 'contain' }} />
        </div>
      ),
      size,
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: brand,
          color: onBrand,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -1,
          borderRadius: 12,
        }}
      >
        {monogram}
      </div>
    ),
    size,
  )
}
