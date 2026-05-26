import AccountInfoPageTemplate from './AccountInfoPageTemplate'

function CouponsPage() {
  return (
    <AccountInfoPageTemplate
      ctaLabel="Shop Now"
      ctaRoute="/products"
      intro="Find your available coupons and apply them during checkout to save more."
      points={[
        'No active coupons available currently.',
        'Coupons are auto-validated during checkout.',
        'Watch notifications for upcoming seasonal offers.',
      ]}
      title="My Coupons"
    />
  )
}

export default CouponsPage
