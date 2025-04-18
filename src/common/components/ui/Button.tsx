import { LoadingSpinner } from '@/common/components/ui/LoadingSpinner'
import { VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, PropsWithChildren, forwardRef } from 'react'

type ButtonProps = PropsWithChildren<
  ComponentPropsWithoutRef<'button'> &
    VariantProps<typeof buttonStyles> & {
      loading?: boolean
    }
>

const buttonStyles = cva(
  'group/button flex w-full items-center justify-center rounded font-heading disabled:pointer-events-none',
  {
    variants: {
      variant: {
        filled:
          'bg-primary text-neutral-100 outline-none hover:bg-gradient-20 focus:bg-gradient-20 disabled:bg-neutral-60',
        outline:
          'border border-primary bg-transparent text-primary outline-none hover:bg-primary-10  focus:bg-primary-10 disabled:border-neutral-60  disabled:text-neutral-60',
        text: 'text-primary outline-none disabled:text-neutral-60 hover:text-primary-60 focus:primary-60'
      },
      size: {
        default: 'h-[46px] gap-2.5 px-3 py-4 font-semibold',
        small: 'h-[42px] gap-2 p-3 text-body-3 font-medium'
      }
    },
    defaultVariants: {
      variant: 'filled',
      size: 'default'
    }
  }
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, size, variant, loading = false, ...props }, ref) => {
    return (
      <button
        {...props}
        disabled={loading || props.disabled}
        className={buttonStyles({ size, variant, className: props.className })}
        ref={ref}
      >
        {loading ? (
          <LoadingSpinner
            className={clsx(
              'absolute',
              variant === 'outline' ? 'text-neutral-60' : ''
            )}
          />
        ) : null}
        <div
          className={clsx(
            loading ? 'opacity-0' : 'opacity-100',
            'flex w-full items-center justify-center gap-2.5'
          )}
        >
          {children}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'
