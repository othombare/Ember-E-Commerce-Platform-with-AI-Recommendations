import axios from 'axios'
import useAuthStore, { isTokenValid } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT ?? 10000)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

function createApiError(error) {
  const responseData = error.response?.data
  const responseMessage =
    responseData && typeof responseData === 'object' && 'message' in responseData
      ? responseData.message
      : null

  return {
    message:
      (typeof responseMessage === 'string' && responseMessage) ||
      error.message ||
      'Something went wrong while contacting the API.',
    status: error.response?.status ?? null,
    code: error.code ?? null,
    data: responseData ?? null,
    isNetworkError: !error.response,
  }
}

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()

    if (isTokenValid(token)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(createApiError(error)),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = createApiError(error)

    if (apiError.status === 401) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(apiError)
  },
)

export default api
