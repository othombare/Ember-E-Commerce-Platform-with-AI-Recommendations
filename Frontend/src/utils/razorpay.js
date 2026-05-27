const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let razorpayScriptPromise = null

export function loadRazorpayCheckoutScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  if (window.Razorpay) {
    return Promise.resolve(true)
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise
  }

  razorpayScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => resolve(false), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return razorpayScriptPromise
}
