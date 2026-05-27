import genzHero from '../../assets/generated/genz-hero.png'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function GenZPage() {
  const { genzProducts } = useCatalogProducts()

  return (
    <CollectionPageTemplate
      activeNavLink="genz"
      heroCtaLabel="Shop Now"
      heroImage={genzHero}
      pageSubtitle="Fresh street-inspired looks designed for bold daily styling."
      pageTitle="GenZ"
      products={genzProducts}
    />
  )
}

export default GenZPage
