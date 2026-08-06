import { Icon } from '@/components/Icon'
import type { IconName } from '@/content/types'

/**
 * Chip-urile de facilități dintr-un card de cameră.
 *
 * Numele scurte din `date` („wifi", „climate") devin chip cu icon +
 * etichetă lizibilă. Un nume necunoscut se afișează ca text simplu, fără
 * icon — nu dispare și nu crapă.
 *
 * `maxim` limitează câte se arată pe card; restul se numără („+3"),
 * ca să nu se umfle cardul. Pe pagina camerei se afișează toate.
 */
const ETICHETE: Record<string, { icon: IconName; text: string }> = {
  wifi: { icon: 'wifi', text: 'Wi-Fi' },
  tv: { icon: 'tv', text: 'TV' },
  climate: { icon: 'climate', text: 'Climatizare' },
  safe: { icon: 'safe', text: 'Seif' },
  fridge: { icon: 'fridge', text: 'Frigider' },
  coffee: { icon: 'coffee', text: 'Cafea' },
  shower: { icon: 'shower', text: 'Duș' },
  terrace: { icon: 'terrace', text: 'Terasă' },
  bed: { icon: 'bed', text: 'Pat dublu' },
  accessible: { icon: 'accessible', text: 'Acces facil' },
  parking: { icon: 'parking', text: 'Parcare' },
  ev: { icon: 'ev', text: 'Încărcare electrică' },
  pool: { icon: 'pool', text: 'Piscină' },
  sauna: { icon: 'sauna', text: 'Saună' },
  spa: { icon: 'spa', text: 'Spa' },
  dining: { icon: 'dining', text: 'Restaurant' },
  bar: { icon: 'bar', text: 'Bar' },
  ciubar: { icon: 'ciubar', text: 'Ciubăr' },
  grill: { icon: 'grill', text: 'Grătar' },
  'pet-friendly': { icon: 'pet-friendly', text: 'Pet friendly' },
  'mic-dejun': { icon: 'mic-dejun', text: 'Mic dejun' },
}

export function AmenitatiChips({ amenitati, maxim }: { amenitati: string[]; maxim?: number }) {
  if (!amenitati.length) return null

  const vizibile = maxim ? amenitati.slice(0, maxim) : amenitati
  const rest = maxim ? amenitati.length - vizibile.length : 0

  return (
    <ul className="chips">
      {vizibile.map((a) => {
        const e = ETICHETE[a.toLowerCase()]
        return (
          <li className="chip" key={a}>
            {e && <Icon name={e.icon} marime="sm" />}
            {e ? e.text : a}
          </li>
        )
      })}
      {rest > 0 && <li className="chip">+{rest}</li>}
    </ul>
  )
}
