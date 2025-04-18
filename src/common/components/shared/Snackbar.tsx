'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect } from 'react'

type ToastType = 'success' | 'loading' | 'error' | 'info'

interface SnackbarProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Snackbar({
  message,
  type = 'info',
  duration = 3000,
  onClose
}: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgClasses: Record<ToastType, string> = {
    success: 'bg-green-60',
    loading: 'bg-sunset-60',
    error: 'bg-error-50',
    info: 'bg-blue-50'
  }

  return (
    <div
      className={clsx(
        'fixed top-16 left-1/2 transform -translate-x-1/2 z-50',
        'p-4 rounded shadow-main text-neutral-100',
        'flex items-center justify-between w-full max-w-md',
        bgClasses[type]
      )}
    >
      <span className='text-sm'>{message}</span>
      <button onClick={onClose}>
        <Image
          src='/icon/close.svg'
          width={24}
          height={24}
          alt=''
          className='w-4 h-4'
        />
      </button>
    </div>
  )
}
