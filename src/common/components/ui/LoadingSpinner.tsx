import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

export function LoadingSpinner(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        'inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-neutral-100/0 text-neutral-100',
        props.className
      )}
      role='status'
      aria-label='loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )
}
