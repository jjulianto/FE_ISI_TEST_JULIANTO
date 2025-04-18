import { login } from '@/modules/auth/api/server/login'
import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'email',
      name: 'Email',
      credentials: {
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        try {
          const response = await login({
            email: credentials?.email || '',
            password: credentials?.password || ''
          })

          if (!response.token) {
            throw new Error(response.message || 'Login failed')
          }
          return {
            id: response.user.id.toString(),
            email: response.user.email,
            role: response.user.role,
            token: response.token
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          throw new Error(e.response?.data.error || e.message)
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 // 1 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Jika authorize mengembalikan user, masukkan token dari API ke JWT token
      if (user) {
        token.accessToken = user.token
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      return Promise.resolve(token)
    },
    async session({ session, token }) {
      // the token object is what returned from the `jwt` callback, it has the `accessToken` that we assigned before
      // Assign the accessToken to the `session` object, so it will be available on our app through `useSession` hooks
      if (token) {
        session.accessToken = token.accessToken
        session.user.id = token.id!
        session.user.email = token.email!
        session.user.role = token.role!
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/login'
  }
}
