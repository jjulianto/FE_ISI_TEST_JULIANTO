import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error'
  }
})

export const config = { matcher: ['/dashboard/:path*'] }
