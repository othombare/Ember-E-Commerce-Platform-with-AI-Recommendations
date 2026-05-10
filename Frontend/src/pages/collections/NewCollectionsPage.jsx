import newCollectionsHero from '../../assets/generated/new-collections-hero.svg'
import { newCollectionProducts } from '../../data/curatedProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function NewCollectionsPage() {
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