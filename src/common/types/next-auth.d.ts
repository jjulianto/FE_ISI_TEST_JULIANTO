import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  /**
   * JWT yang dikembalikan oleh callback `jwt`.
   * Kita akan menyimpan token sebagai `accessToken`,
   * serta user `id` dan `role`.
   */
  interface JWT {
    accessToken?: string
    id?: string
    role?: string
  }
}

declare module 'next-auth' {
  /**
   * Session yang dikembalikan pada client.
   * Hanya menyimpan `accessToken` dan data user sederhana.
   */
  interface Session {
    accessToken?: string
    user: {
      id: string
      email?: string
      role?: string
    }
  }

  /**
   * User yang dikembalikan dari callback `authorize`.
   * Harus mengandung `id`, `email`, `role`, dan `token`.
   */
  interface User {
    id: string
    email?: string
    role?: string
    token: string
  }
}
