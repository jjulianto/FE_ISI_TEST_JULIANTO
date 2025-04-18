import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

export function LoadingPlaceholder(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        'flex h-12 w-full items-center justify-center',
        props.className
      )}
    >
      <LoadingSpinner className='!text-primary' />
    </div>
  )
}
