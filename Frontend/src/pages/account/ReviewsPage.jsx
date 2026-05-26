import AccountInfoPageTemplate from './AccountInfoPageTemplate'

function ReviewsPage() {
  return (
    <AccountInfoPageTemplate
      ctaLabel="My Orders"
      ctaRoute="/my-profile?section=orders"
      intro="Rate your purchased products and track the feedback you have shared."
      points={[
        'No reviews submitted yet.',
        'Only delivered items can be rated.',
        'Helpful reviews improve recommendations for other shoppers.',
      ]}
      title="My Reviews & Ratings"
    />
  )
}

export default ReviewsPage
