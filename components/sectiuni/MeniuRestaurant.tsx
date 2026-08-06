import { AntetSectiune } from './AntetSectiune'
import type { MeniuCategorie } from '@/content/meniu'

/**
 * Meniul restaurantului: categorii, preparate, prețuri, alergeni.
 *
 * Server Component. Modul opțional, pornit din setari.md. `Menu` din
 * JSON-LD vine la T07. Prețurile sunt aliniate în coloană prin
 * `tabular-nums`. Alergenii se afișează discret sub preparat — sunt o
 * obligație, dar nu vânzarea.
 *
 * Nu se randează fără categorii.
 */
export function MeniuRestaurant({
  categorii,
  titlu = 'Meniu',
}: {
  categorii: MeniuCategorie[]
  titlu?: string
}) {
  if (!categorii.length) return null

  return (
    <section className="meniu" id="meniu">
      <div className="wrap" style={{ maxWidth: '820px' }}>
        <AntetSectiune title={titlu} />
        {categorii.map((cat, i) => (
          <div className="menu-cat" key={i}>
            <h3>{cat.nume}</h3>
            {cat.servit && <p className="menu-alergeni">{cat.servit}</p>}
            {cat.preparate.map((p, j) => (
              <div className="menu-row" key={j}>
                <div>
                  <span>{p.nume}</span>
                  {p.alergeni && <p className="menu-alergeni">Alergeni: {p.alergeni}</p>}
                </div>
                {p.pret && <b className="tabular">{p.pret}</b>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
