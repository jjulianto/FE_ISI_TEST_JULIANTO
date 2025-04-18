import { SessionWrapper } from '@/common/components/shared/SessionWrapper'
import { LoadingPlaceholder } from '@/common/components/ui/LoadingPlaceholder'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { Suspense } from 'react'
import { Navbar } from '@/common/components/shared/Navbar'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <SessionWrapper session={session}>
      <section className='flex h-screen w-full flex-col'>
        <Navbar />
        <Suspense fallback={<LoadingPlaceholder />}>{children}</Suspense>
      </section>
    </SessionWrapper>
  )
}
