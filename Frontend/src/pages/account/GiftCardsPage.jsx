import AccountInfoPageTemplate from './AccountInfoPageTemplate'

function GiftCardsPage() {
  return (
    <AccountInfoPageTemplate
      ctaLabel="Explore Products"
      ctaRoute="/products"
      intro="Use gift cards during checkout and track your current balance in one place."
      points={[
        'Current balance: Rs 0.',
        'Gift cards can be applied on checkout review.',
        'Promotional gift cards may have expiry dates.',
      ]}
      title="Gift Cards"
    />
  )
}

export default GiftCardsPage
