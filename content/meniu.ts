/**
 * Meniul restaurantului. Nu face parte din `SiteData` (types.ts din
 * hotel-forge nu-l avea), fiindcă e un modul opțional care apare la
 * puține locații. Se încarcă separat, din date/07-meniu-restaurant.md,
 * și se randează doar dacă `Meniu restaurant: da` în setari.md.
 */

export interface MeniuPreparat {
  nume: string
  /** Formatat, ca la oferte: „38 lei". */
  pret?: string
  alergeni?: string
  /** Gramajul porției, lângă nume: „300 g pește / 300 g legume". */
  gramaj?: string
  /**
   * Ingredientele, din corpul blocului `###`. E textul care vinde
   * preparatul și, la un restaurant de nișă, singurul care răspunde la
   * „ce e într-un storceag?" fără un telefon.
   */
  descriere?: string
  /** O condiție de comandă: „precomandă, minimum 4 persoane". */
  nota?: string
  /**
   * Fotografia preparatului, ca `/media/<fisier>`.
   *
   * Sursa sunt chiar pozele din meniul tipărit — decupaje pe fundal alb,
   * 210–320 px în PDF. De asta se randează ca miniatură, nu ca imagine
   * de card: mărite peste dimensiunea lor reală ar arăta moale.
   */
  poza?: string
  /**
   * Valorile nutriționale, ca text liber. Sunt o obligație de etichetare,
   * nu un argument de vânzare — de asta se randează pliate.
   */
  nutritie?: string
}

export interface MeniuCategorie {
  nume: string
  /** „Servit între 12:00 și 22:00", de exemplu. */
  servit?: string
  preparate: MeniuPreparat[]
}

/**
 * Antetul secțiunii de meniu — eyebrow, titlu, text introductiv.
 *
 * Vine din blocul `## Secțiune` al fișierului, exact ca la oferte
 * (`06-oferte.md`). Stă în datele CLIENTULUI, nu în motor: fraza care
 * descrie bucătăria unei pensiuni n-are ce căuta într-o componentă pe
 * care o moștenesc toți clienții.
 */
export interface MeniuSectiune {
  eyebrow?: string
  title?: string
  lede?: string
  /**
   * Categoriile care apar pe PRIMA PAGINĂ, ca „specialitățile casei".
   *
   * Alegerea e a clientului, nu a motorului: la o pensiune din Deltă
   * vinde peștele, la una de munte vinde altceva, iar „primele două
   * categorii din fișier" ar nimeri micul dejun. Gol → primele două.
   */
  evidentiate?: string[]
}

/** Ce întoarce loader-ul: antetul opțional plus categoriile. */
export interface Meniu {
  sectiune: MeniuSectiune
  categorii: MeniuCategorie[]
}
