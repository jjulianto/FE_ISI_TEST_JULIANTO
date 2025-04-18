import clsx from 'clsx'
import { ComponentPropsWithRef, PropsWithChildren, forwardRef } from 'react'

type InputSize = 'default' | 'small'

export type InputProps = PropsWithChildren<{
  size?: InputSize
  inputProps: ComponentPropsWithRef<'input'>
}>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, size = 'default', inputProps }, outerRef) => {
    return (
      <div
        className={clsx(
          'flex flex-grow rounded border border-neutral-70 !ring-0 focus-within:border-primary',
          size === 'small' ? 'h-[42px] px-3 py-2' : 'h-[51px] p-3.5',
          inputProps.disabled ? 'bg-neutral-95' : null
        )}
      >
        <div
          className='flex w-full items-center justify-between'
          ref={outerRef}
        >
          <input
            {...inputProps}
            className={clsx(
              'w-full bg-transparent font-heading text-body-3 text-secondary-100 outline-none placeholder:text-neutral-70 disabled:text-secondary-10',
              inputProps.className
            )}
            min={0}
          ></input>
          {children}
        </div>
      </div>
    )
  }
)

Input.displayName = 'Input'
