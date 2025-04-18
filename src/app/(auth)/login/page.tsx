import { authOptions } from '@/lib/auth'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { LoginHeader } from '@/modules/auth/components/LoginHeader'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function LoginPage({
  searchParams
}: {
  searchParams: { [key: string]: string }
}) {
  const params = await searchParams

  const session = await getServerSession(authOptions)

  if (session?.user) {
    redirect(params.callbackUrl || '/dashboard')
  }

  return (
    <LoginHeader>
      <LoginForm />
    </LoginHeader>
  )
}
