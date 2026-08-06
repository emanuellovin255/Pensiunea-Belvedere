import { AntetSectiune } from './AntetSectiune'
import { Icon } from '@/components/Icon'

/**
 * Meniul restaurantului pe prima pagină, redus la un link către PDF.
 *
 * Decizie de la client: meniul complet (categorii, gramaje, ingrediente,
 * alergeni, valori nutriționale) ocupa ~10 000 px de derulare pe telefon,
 * între recenzii și hartă. Cine caută cazare nu citește 60 de preparate
 * acolo; cine vrea meniul îl vrea întreg, într-un fișier, de preferat
 * salvat pe telefon.
 *
 * Server Component, un `<a>` și atât. PDF-ul se deschide în tab nou și nu
 * se descarcă niciun byte până nu îl cere cineva.
 *
 * SEO-ul nu are de pierdut: `schemaMeniu` (JSON-LD, T07) continuă să
 * declare meniul complet în `<head>`, cu preparate și prețuri, chiar dacă
 * vizual pagina arată doar linkul.
 */
export function MeniuLinkPdf({
  href,
  titlu = 'Meniul restaurantului',
  text = 'Bucătărie pescărească, gătită pe loc: storceag de somn, friptură de pește, scrumbie afumată, platou pescăresc de 2 kg. Meniul complet, cu gramaje și prețuri, e în PDF.',
  eticheta = 'Restaurant',
}: {
  href: string
  titlu?: string
  text?: string
  eticheta?: string
}) {
  if (!href) return null

  return (
    <section className="meniu-pdf" id="meniu">
      <div className="wrap" style={{ maxWidth: '820px' }}>
        <AntetSectiune eyebrow={eticheta} title={titlu} lede={text} />
        <p className="stack">
          <a className="btn btn-primary" href={href} target="_blank" rel="noopener noreferrer">
            <Icon name="glass" marime="sm" />
            Vezi meniul (PDF)
          </a>
        </p>
      </div>
    </section>
  )
}
