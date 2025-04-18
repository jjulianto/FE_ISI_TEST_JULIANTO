import type { Metadata } from 'next'
import './globals.css'
import clsx from 'clsx'
import { bodyFont, headingFont } from '@/common/styles/fonts'

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo app using Next.js 15 and TypeScript'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={clsx('antialiased', headingFont.variable, bodyFont.variable)}
      >
        {children}
      </body>
    </html>
  )
}
