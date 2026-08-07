import type { SiteData } from '@/content/types'
import { esteExtern, linkRezervare } from '@/lib/whatsapp'

/**
 * Butonul „Verifică disponibilitatea", în varianta care chiar face ceva.
 *
 * Locația n-are motor de rezervări, deci butonul nu duce la un calendar,
 * ci deschide WhatsApp cu mesajul scris (`lib/whatsapp.ts`). Când stă
 * lângă o cameră sau o ofertă, primește `subiect` — mesajul spune de la
 * început despre ce e vorba.
 *
 * Server Component: un `<a>`, fără stare. Eticheta vine tot din
 * `booking.labels.submit` (T05), ca traducerea să rămână în date.
 */
export function BtnRezervare({
  date,
  subiect,
  clasa = 'btn btn-primary',
  eticheta,
}: {
  date: SiteData
  subiect?: string
  clasa?: string
  eticheta?: string
}) {
  const href = linkRezervare(date, subiect)
  const extern = esteExtern(href)

  return (
    <a
      className={clasa}
      href={href}
      {...(extern ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {eticheta ?? date.booking.labels.submit}
    </a>
  )
}
