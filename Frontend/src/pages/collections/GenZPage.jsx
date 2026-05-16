import genzHero from '../../assets/generated/genz-hero.png'
import { genzProducts } from '../../data/curatedProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function GenZPage() {
  return (
    <CollectionPageTemplate
      activeNavLink="genz"
      heroImage={genzHero}
      pageSubtitle="Fresh street-inspired looks designed for bold daily styling."
      pageTitle="GenZ"
      products={genzProducts}
    />
  )
}

export default GenZPage