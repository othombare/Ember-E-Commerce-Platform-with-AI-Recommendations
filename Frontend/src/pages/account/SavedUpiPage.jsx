import AccountInfoPageTemplate from './AccountInfoPageTemplate'

function SavedUpiPage() {
  return (
    <AccountInfoPageTemplate
      ctaLabel="Checkout"
      ctaRoute="/checkout/review"
      intro="Save your preferred UPI handles for faster payments during checkout."
      points={[
        'No UPI IDs saved yet.',
        'You can add a UPI handle on checkout while paying online.',
        'Saved handles are linked to your Ember account profile.',
      ]}
      title="Saved UPI"
    />
  )
}

export default SavedUpiPage
