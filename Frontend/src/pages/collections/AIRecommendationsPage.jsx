import aiRecommendationsHero from '../../assets/generated/ai-recommendations-hero.png'
import useCatalogProducts from '../../hooks/useCatalogProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function AIRecommendationsPage() {
  const { aiRecommendationProducts } = useCatalogProducts()

  return (
    <CollectionPageTemplate
      activeNavLink="ai-recommendations"
      heroCtaLabel="Explore Now"
      heroImage={aiRecommendationsHero}
      pageSubtitle="Personalized picks tuned to your style preferences and popular trends."
      pageTitle="AI Recommendations"
      products={aiRecommendationProducts}
    />
  )
}

export default AIRecommendationsPage
