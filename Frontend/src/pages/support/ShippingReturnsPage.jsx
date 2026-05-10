import SupportPageTemplate from './SupportPageTemplate'

function ShippingReturnsPage() {
  return (
    <SupportPageTemplate
      intro="Everything about delivery timelines, shipping charges, and return windows."
      points={[
        'Standard shipping usually takes 3-6 business days across major cities.',
        'Express delivery is available for selected products and serviceable locations.',
        'Returns are accepted within 7 days for unworn items with tags intact.',
        'Refunds are initiated within 2 business days after quality inspection passes.',
      ]}
      title="Shipping & Returns"
    />
  )
}

export default ShippingReturnsPage