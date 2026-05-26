import AccountInfoPageTemplate from './AccountInfoPageTemplate'

function SavedCardsPage() {
  return (
    <AccountInfoPageTemplate
      ctaLabel="Checkout"
      ctaRoute="/checkout/review"
      intro="Manage your saved cards and wallet preferences used for secure checkout."
      points={[
        'No cards are saved right now.',
        'Cards can be added securely while placing an online order.',
        'You can remove saved cards anytime from this section.',
      ]}
      title="Saved Cards"
    />
  )
}

export default SavedCardsPage
