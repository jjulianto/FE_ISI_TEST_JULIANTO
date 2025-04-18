import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Container from '@/common/components/ui/Container'
import { LogoutButton } from '@/common/components/ui/LogoutButton'

export async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <nav className='fixed top-0 z-10 w-full bg-neutral-100 border-b border-b-neutral-99'>
      <Container>
        <div className='h-[81px] flex items-center justify-between gap-6'>
          <h1 className='text-heading-4 font-bold text-primary'>Todo App</h1>
          <div className='flex items-center gap-4'>
            <div className='hidden sm:flex flex-col items-end'>
              <p className='text-body-3 text-primary'>{session?.user?.email}</p>
              <p className='font-heading text-heading-5 font-bold text-primary'>
                {session?.user?.role}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </Container>
    </nav>
  )
}
