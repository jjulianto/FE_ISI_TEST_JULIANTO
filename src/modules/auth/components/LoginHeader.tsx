import { ReactNode } from 'react'

export function LoginHeader({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='flex h-full flex-col items-center justify-center gap-8 pb-8'>
        <div className='flex w-full max-w-[486px] flex-col gap-[62px]'>
          <div className='flex flex-col gap-8'>
            <div className='flex flex-col gap-1.5'>
              <h1 className='font-heading text-[32px] font-bold text-secondary-50'>
                Login to your account
              </h1>
              <p className='max-w-[375px] font-heading text-body-3 text-neutral-30'>
                Please enter your email and password to login to your account.
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
