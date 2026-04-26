import { Link } from 'react-router-dom'
import streetWearImage from '../../assets/18f2e284f057c74506dbaac944391d40550e1bfc.png'

const inputClassName =
  'h-11 w-full border border-[#c9c5bf] bg-[#f1efeb] px-4 text-[15px] text-[#3d3d3d] outline-none transition focus:border-[#6f6a64]'

function Signin() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden bg-[#3a3d42]">
      <section className="grid h-full w-full border-2 border-[#1ea3ff] bg-[#eceae7] md:grid-cols-[1.02fr_1fr]">
        <div className="flex h-full flex-col overflow-y-auto px-6 py-6 md:px-12 md:py-8">
          <div className="mb-8 text-[#2f2d2b]">
            <p className="text-[26px] font-light leading-none tracking-[0.18em] md:text-[30px]">EMBER</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.48em] text-[#6c6760]">Wear & Clothing</p>
          </div>

          <h1 className="text-center font-serif text-[44px] leading-none text-[#313131] md:text-[56px]">
            Welcome Back
          </h1>
          <p className="mt-3 text-center text-[16px] text-[#7f7b75] md:text-[18px]">
            Your wardrobe missed you. Ready for a fresh look?
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="text-[19px] font-semibold text-[#4a4742]">
              Email
              <input className={inputClassName} type="email" placeholder="Enter your email" />
            </label>

            <label className="text-[19px] font-semibold text-[#4a4742]">
              Password
              <input
                className={inputClassName}
                type="password"
                placeholder="Enter your password which you can remember"
              />
            </label>

            <div className="flex items-center justify-between gap-3 text-[15px] text-[#5d5952]">
              <label className="flex items-center gap-3">
                <input className="size-4 border-[#cbc7c0]" type="checkbox" />
                Remember me
              </label>
              <Link className="font-semibold text-[#3c3935] hover:underline" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              className="mt-1 h-12 bg-[#262626] text-[18px] font-semibold text-white transition hover:bg-black"
              type="submit"
            >
              Enter the Ember
            </button>

            <button
              className="flex h-12 items-center justify-center gap-3 border border-[#c8c4be] bg-[#f7f5f1] text-[18px] text-[#3b3b3b] transition hover:bg-[#f0ece6]"
              type="button"
            >
              <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24">
                <path
                  d="M21.35 11.1h-9.18v2.98h5.26c-.23 1.49-1.73 4.37-5.26 4.37-3.17 0-5.74-2.62-5.74-5.85s2.57-5.85 5.74-5.85c1.8 0 3 .77 3.69 1.44l2.52-2.44C16.77 4.22 14.66 3.3 12.17 3.3c-5.02 0-9.1 4.07-9.1 9.3s4.08 9.3 9.1 9.3c5.25 0 8.72-3.7 8.72-8.9 0-.6-.06-1.05-.14-1.5Z"
                  fill="#4285F4"
                />
                <path
                  d="M3.07 7.95 5.96 10c.78-1.58 2.38-2.67 4.21-2.67 1.8 0 3 .77 3.69 1.44l2.52-2.44C16.77 4.22 14.66 3.3 12.17 3.3c-3.5 0-6.54 2.04-8.1 4.99Z"
                  fill="#EA4335"
                />
                <path
                  d="M12.17 21.9c2.42 0 4.45-.8 5.93-2.18l-2.74-2.3c-.73.52-1.68.89-3.2.89-3.5 0-4.95-2.83-5.16-4.3l-2.87 2.22c1.54 3 4.6 5.67 8.04 5.67Z"
                  fill="#34A853"
                />
                <path
                  d="M21.35 11.1h-9.18v2.98h5.26c-.12.8-.6 1.96-1.74 2.74l2.74 2.3c1.64-1.51 2.92-3.88 2.92-7.02 0-.6-.06-1.05-.14-1.5Z"
                  fill="#FBBC05"
                />
              </svg>
              Sign In with Google
            </button>
          </form>

          <p className="mt-auto pt-10 text-center text-[15px] text-[#7a746e]">
            Don&apos;t have an account ?{' '}
            <Link className="font-semibold text-[#2f2d2a]" to="/signup">
              Sign Up
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

export default Signin
