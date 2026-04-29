import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const tokenExpiresAt = useAuthStore((state) => state.tokenExpiresAt)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  return (
    <main className="min-h-screen bg-[#eceae7] px-6 py-8 text-[#2f2d2b] md:px-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#d8d4cf] bg-white p-6 shadow-sm md:p-8">
        <p className="text-[12px] uppercase tracking-[0.32em] text-[#6c6760]">EMBER DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Welcome, {user?.name ?? 'Shopper'}</h1>

        <div className="mt-8 grid gap-4 rounded-xl border border-[#ebe7e2] bg-[#f7f5f2] p-5 text-sm md:text-base">
          <p>
            <span className="font-semibold">Email:</span> {user?.email ?? 'Not available'}
          </p>
          <p>
            <span className="font-semibold">User ID:</span> {user?.id ?? 'Not available'}
          </p>
          <p className="break-all">
            <span className="font-semibold">Auth Token:</span> {token ?? 'Not available'}
          </p>
          <p>
            <span className="font-semibold">Token Expires At:</span>{' '}
            {tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : 'Not available'}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="h-11 rounded-md bg-[#262626] px-4 text-white transition hover:bg-black"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
