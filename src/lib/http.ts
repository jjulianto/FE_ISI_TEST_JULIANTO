import axios from 'axios'
import axiosRetry from 'axios-retry'
import { Session } from 'next-auth'
import { getSession, signOut } from 'next-auth/react'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const WebRequest = () => {
  const instance = axios.create({
    baseURL
  })

  axiosRetry(instance, {
    retries: 3, // number of retries
    retryCondition: (error) =>
      error.response?.status === 500 && error.config?.method === 'get' // retry on 500 status for GET requests
  })

  let currentSession: Session | null = null

  instance.interceptors.request.use(
    async (request) => {
      if (
        currentSession == null ||
        Date.now() > Date.parse(currentSession.expires)
      ) {
        const session = await getSession()
        currentSession = session
      }

      if (currentSession) {
        request.headers.Authorization = `Bearer ${currentSession.accessToken}`
      } else {
        delete request.headers.Authorization
      }

      return request
    },
    (error) => {
      console.error(`API Error: `, error)
      throw error
    }
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        signOut()
      }
      if (error.response && error.response.data) {
        error.message = error.response.data.message
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const webRequest = WebRequest()

export const swrImmutableConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
}
