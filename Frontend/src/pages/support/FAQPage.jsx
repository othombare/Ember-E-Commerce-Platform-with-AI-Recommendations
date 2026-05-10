import SupportPageTemplate from './SupportPageTemplate'

function FAQPage() {
  return (
    <SupportPageTemplate
      intro="Find quick answers about orders, payments, and account settings."
      points={[
        'How do I track my order? You can track from Notifications or your order history after checkout.',
        'Can I cancel an order? Yes, cancellation is available before dispatch.',
        'Which payment options are available? UPI, cards, net banking, and COD for selected pin codes.',
        'How do I update my profile information? Open My Profile and edit details from the account section.',
      ]}
      title="Frequently Asked Questions"
    />
  )
}

export default FAQPage