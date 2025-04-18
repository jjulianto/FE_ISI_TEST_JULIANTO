'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Input, InputProps } from './Input'

export function PasswordInput({ inputProps, size }: InputProps) {
  const outerRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input
      ref={outerRef}
      size={size}
      inputProps={{
        placeholder: 'Enter your password',
        ...inputProps,
        type: showPassword ? 'text' : 'password'
      }}
    >
      <button
        className='h-4 w-4 text-neutral-70'
        onClick={() => setShowPassword((currShow) => !currShow)}
        type='button'
      >
        {showPassword ? (
          <Image
            src='/icon/eye-open.svg'
            width={16}
            height={16}
            className='h-4 w-4'
            alt=''
          />
        ) : (
          <Image
            src='/icon/eye-hide.svg'
            width={16}
            height={16}
            className='h-4 w-4'
            alt=''
          />
        )}
      </button>
    </Input>
  )
}
