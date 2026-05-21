import newCollectionsHero from '../../assets/generated/new-collections-hero.png'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function NewCollectionsPage() {
  const { newCollectionProducts } = useCatalogProducts()

  return (
    <CollectionPageTemplate
      activeNavLink="new-collections"
      heroImage={newCollectionsHero}
      pageSubtitle="The latest handcrafted edits across modern essentials and elevated fits."
      pageTitle="New Collections"
      products={newCollectionProducts}
    />
  )
}

export default NewCollectionsPage
