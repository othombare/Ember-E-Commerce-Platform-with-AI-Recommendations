import SupportPageTemplate from './SupportPageTemplate'

function SizeGuidePage() {
  return (
    <SupportPageTemplate
      intro="Use this guide to pick your most comfortable fit before checkout."
      points={[
        'T-Shirts: S (38), M (40), L (42), XL (44), 2XL (46).',
        'Joggers: S (30), M (32), L (34), XL (36), 2XL (38).',
        'Shirts: Slim fit styles run tighter; size up if between two sizes.',
        'For fit help, reach out on Contact Us with your height, weight, and preferred fit.',
      ]}
      title="Size Guide"
    />
  )
}

export default SizeGuidePage