'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/common/components/ui/Button'

export function LogoutButton() {
  return (
    <Button
      onClick={() => {
        signOut({
          callbackUrl: '/login',
          redirect: true
        })
      }}
      className='px-4 py-2 max-w-max'
    >
      Logout
    </Button>
  )
}
