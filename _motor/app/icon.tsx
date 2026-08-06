import { ImageResponse } from 'next/og'

import { siteCurent } from '@/lib/site'

/**
 * Favicon-ul, generat din monograma și culoarea de brand ale site-ului
 * curent. Fără el, browserul cere `/favicon.ico`, primește 404 și îl
 * scrie în consolă — ceea ce Lighthouse punctează la „best practices".
 *
 * Per-site, nu generic: fiecare client (și fiecare demo) își primește
 * marca lui, din aceleași date ca restul paginii. ASCII (două inițiale),
 * deci fontul implicit e suficient.
 */
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  const { date } = siteCurent('ro')
  // Loader-ul dă mereu culorile temei (au valori implicite în lib/continut),
  // deci nu e nevoie de un hex de rezervă scris în cod (regula 4).
  const brand = date.theme.colors.brand
  const onBrand = date.theme.colors.onBrand
  const monogram = date.brand.monogram || 'H'

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
