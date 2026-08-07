import Image from 'next/image'
import Link from 'next/link'

import { AntetSectiune } from './AntetSectiune'
import { Icon } from '@/components/Icon'
import type { MeniuCategorie, MeniuSectiune } from '@/content/meniu'
import { slug } from '@/lib/continut/md'
import { etichete } from '@/lib/i18n/etichete'
import type { Limba } from '@/lib/i18n/limbi'

/**
 * Meniul restaurantului: categorii, preparate, gramaje, ingrediente,
 * prețuri, alergeni și valori nutriționale.
 *
 * Server Component. Modul opțional, pornit din setari.md. Prețurile sunt
 * aliniate în coloană prin `tabular-nums`.
 *
 * IERARHIA E DELIBERATĂ. Ce vinde stă la vedere — numele, gramajul,
 * ingredientele, prețul. Ce e obligație de etichetare stă mai jos, mai
 * mic: alergenii ca linie discretă, valorile nutriționale pliate într-un
 * `<details>`. Randate la același nivel, cele ~40 de cifre nutriționale
 * ale unui preparat ar îneca descrierea care îl face de dorit — dar
 * rămân în HTML, deci indexabile și accesibile fără JavaScript.
 *
 * DOUĂ ÎNTREBUINȚĂRI, O SINGURĂ COMPONENTĂ
 * ----------------------------------------
 * Pe prima pagină se randează scurtată (`limita`), cu un buton către
 * pagina de meniu: 100 de preparate între recenzii și hartă ar însemna
 * ~10 000 px de derulare pe telefon. Pe `/meniu` se randează întreagă,
 * cu o listă de ancore către categorii (`navCategorii`).
 *
 * Ancorele sunt `<a href="#...">` reale, nu JavaScript: funcționează cu
 * scripturile oprite și rămân linkuri pe care Google le poate urmări.
 *
 * Nu se randează fără categorii.
 */
export function MeniuRestaurant({
  categorii,
  limba = 'ro',
  sectiune,
  limita,
  linkComplet,
  navCategorii = false,
  pdf,
}: {
  categorii: MeniuCategorie[]
  limba?: Limba
  /** Antetul din datele clientului. Fără el, se cade pe eticheta „Meniu". */
  sectiune?: MeniuSectiune
  /** Câte preparate se arată per categorie. Nelimitat dacă lipsește. */
  limita?: number
  /** Butonul „Vezi meniul complet", pe prima pagină. */
  linkComplet?: string
  /** Lista de ancore către categorii, în capul paginii de meniu. */
  navCategorii?: boolean
  /** Linkul secundar către PDF, jos de tot. */
  pdf?: string
}) {
  if (!categorii.length) return null
  const t = etichete(limba)

  // Pe prima pagină arătăm doar categoriile care au ce arăta în limita
  // dată — o categorie golită de tăiere n-are de ce să apară ca titlu gol.
  const afisate = limita
    ? categorii
        .map((c) => ({ ...c, preparate: c.preparate.slice(0, limita) }))
        .filter((c) => c.preparate.length)
    : categorii

  return (
    <section className="meniu" id="meniu">
      <div className="wrap" style={{ maxWidth: '820px' }}>
        <AntetSectiune
          eyebrow={sectiune?.eyebrow}
          title={sectiune?.title ?? t.meniuTitlu}
          lede={sectiune?.lede}
        />

        {navCategorii && afisate.length > 1 && (
          <nav className="menu-nav" aria-label={t.meniuCategorii}>
            {afisate.map((cat) => (
              <a key={cat.nume} href={`#${slug(cat.nume)}`}>
                {cat.nume}
              </a>
            ))}
          </nav>
        )}

        {afisate.map((cat) => (
          <div className="menu-cat" key={cat.nume}>
            <h3 id={slug(cat.nume)}>{cat.nume}</h3>
            {cat.servit && <p className="menu-alergeni">{cat.servit}</p>}
            {cat.preparate.map((p, j) => (
              <div className="menu-row" key={j}>
                {p.poza && (
                  /* Miniatură, nu imagine de card: sursa e poza din meniul
                     tipărit, 210–320 px. `loading="lazy"` fiindcă pe pagina
                     de meniu sunt 27 dintre ele, toate sub prima vizibilă. */
                  <Image
                    className="menu-poza"
                    src={p.poza}
                    alt={p.nume}
                    width={200}
                    height={200}
                    sizes="120px"
                    loading="lazy"
                  />
                )}
                <div className="menu-info">
                  <span className="menu-nume">
                    {p.nume}
                    {p.gramaj && <em className="menu-gramaj"> · {p.gramaj}</em>}
                  </span>
                  {p.descriere && <p className="menu-descriere">{p.descriere}</p>}
                  {p.nota && <p className="menu-nota">{p.nota}</p>}
                  {p.alergeni && (
                    <p className="menu-alergeni">
                      {t.meniuAlergeni}: {p.alergeni}
                    </p>
                  )}
                  {p.nutritie && (
                    <details className="menu-nutritie">
                      <summary>{t.meniuNutritie}</summary>
                      <p>{p.nutritie}</p>
                    </details>
                  )}
                </div>
                {p.pret && <b className="tabular">{p.pret}</b>}
              </div>
            ))}
          </div>
        ))}

        {(linkComplet || pdf) && (
          <p className="stack menu-actiuni">
            {linkComplet && (
              <Link className="btn btn-primary" href={linkComplet}>
                <Icon name="glass" marime="sm" />
                {t.meniuComplet}
              </Link>
            )}
            {pdf && (
              <a className="btn btn-ghost" href={pdf} target="_blank" rel="noopener noreferrer">
                {t.meniuPdf}
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  )
}
