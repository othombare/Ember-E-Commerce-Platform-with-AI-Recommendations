import SupportPageTemplate from './SupportPageTemplate'

function ContactUsPage() {
  return (
    <SupportPageTemplate
      intro="Our support team is available every day to help with your shopping journey."
      points={[
        'Email: support@emberfashion.example',
        'Phone: +91 98765 43210 (9:00 AM - 8:00 PM IST)',
        'Live Chat: Available from the Notifications panel for signed-in users.',
        'Address: Ember Retail, MG Road, Bengaluru, Karnataka 560001.',
      ]}
      title="Contact Us"
    />
  )
}

export default ContactUsPage