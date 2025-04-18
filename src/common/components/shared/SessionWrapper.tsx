'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

export function SessionWrapper({
  children,
  session
}: PropsWithChildren<{ session: Session | null | undefined }>) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
