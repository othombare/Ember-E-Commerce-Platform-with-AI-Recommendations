import aiRecommendationsHero from '../../assets/generated/ai-recommendations-hero.png'
import { aiRecommendationProducts } from '../../data/curatedProducts'
import CollectionPageTemplate from './CollectionPageTemplate'

function AIRecommendationsPage() {
  return (
    <CollectionPageTemplate
      activeNavLink="ai-recommendations"
      heroImage={aiRecommendationsHero}
      pageSubtitle="Personalized picks tuned to your style preferences and popular trends."
      pageTitle="AI Recommendations"
      products={aiRecommendationProducts}
    />
  )
}

export default AIRecommendationsPage