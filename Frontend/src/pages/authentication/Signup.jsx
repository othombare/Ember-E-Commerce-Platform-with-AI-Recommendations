import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import streetWearImage from '../../assets/18f2e284f057c74506dbaac944391d40550e1bfc.png'
import useAuthStore, { isTokenValid } from '../../store/authStore'

const inputClassName =
  'h-11 w-full border border-[#c9c5bf] bg-[#f1efeb] px-4 text-[15px] text-[#3d3d3d] outline-none transition focus:border-[#6f6a64]'

function Signup() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const login = useAuthStore((state) => state.login)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [apiStatus, setApiStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isTokenValid(token)) {
    return <Navigate replace to="/dashboard" />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim()) {
      setApiStatus('Please enter name, email, and password.')
      return
    }

    if (password !== confirmPassword) {
      setApiStatus('Password and confirm password do not match.')
      return
    }

    setIsSubmitting(true)
    setApiStatus('Creating your account...')

    try {
      const response = await api.post('/api/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
      })

      const apiUser = response.data?.user
      const apiToken = response.data?.token

      if (!apiUser || !apiToken) {
        throw new Error('Invalid signup response from server.')
      }

      login({
        user: apiUser,
        token: apiToken,
      })
      setApiStatus(response.data?.message ?? 'Account created successfully.')
      navigate('/dashboard')
    } catch (error) {
      setApiStatus(`Signup failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#3a3d42]">
      <section className="grid h-full w-full border-2 border-[#1ea3ff] bg-[#eceae7] md:grid-cols-[1.02fr_1fr]">
        <div className="flex h-full flex-col overflow-y-auto px-6 py-6 md:px-12 md:py-8">
          <div className="mb-8 text-[#2f2d2b]">
            <p className="text-[26px] font-light leading-none tracking-[0.18em] md:text-[30px]">EMBER</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.48em] text-[#6c6760]">Wear & Clothing</p>
          </div>

          <h1 className="text-center font-serif text-[44px] leading-none text-[#313131] md:text-[56px]">
            STEP INTO STYLE
          </h1>
          <p className="mt-3 text-center text-[16px] text-[#7f7b75] md:text-[18px]">
            Welcome to Ember - Create your account to start shopping.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <label className="text-[19px] font-semibold text-[#4a4742]">
              Name
              <input
                className={inputClassName}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                type="text"
                value={name}
              />
            </label>

            <label className="text-[19px] font-semibold text-[#4a4742]">
              Email
              <input
                className={inputClassName}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={email}
              />
            </label>

            <label className="text-[19px] font-semibold text-[#4a4742]">
              Password
              <input
                className={inputClassName}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={password}
              />
            </label>

            <label className="text-[19px] font-semibold text-[#4a4742]">
              Confirm Password
              <input
                className={inputClassName}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
              />
            </label>

            <button
              className="mt-1 h-12 bg-[#262626] text-[18px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating Account...' : 'Submit & Start Shopping'}
            </button>

            {apiStatus ? (
              <p aria-live="polite" className="text-[14px] text-[#5a5550]">
                {apiStatus}
              </p>
            ) : null}
          </form>

          <p className="mt-auto pt-10 text-center text-[15px] text-[#7a746e]">
            Already have an account ?{' '}
            <Link className="font-semibold text-[#2f2d2a] hover:underline" to="/signin">
              Sign In
            </Link>
          </p>
        </div>

        <div className="relative hidden h-full overflow-hidden bg-[#c8d1df] md:block">
          <img
            alt="Streetwear collection"
            className="absolute inset-0 h-full w-full object-contain object-center"
            src={streetWearImage}
          />
        </div>
      </section>
    </main>
  )
}

export default Signup
