'use client'

import { Input } from '@/common/components/shared/form/Input'
import { PasswordInput } from '@/common/components/shared/form/PasswordInput'
import { Snackbar } from '@/common/components/shared/Snackbar'
import { Button } from '@/common/components/ui/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import useMutation from 'use-mutation'
import * as z from 'zod'

const schema = z.object({
  email: z.string().trim().min(1).max(225),
  password: z.string().trim().min(1).max(225)
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const [mutateSignIn] = useMutation(
    (input) =>
      signIn('email', {
        ...input,
        redirect: false,
        callbackUrl: callbackUrl || '/dashboard'
      }),
    {
      onSuccess({ data }) {
        if (data?.error === null) {
          router.replace(data.url || callbackUrl || '/dashboard')
          return
        }
        setSnackbar({
          message: data?.error || 'An error has occurred',
          type: 'error'
        })
      },
      onFailure({ error }) {
        setSnackbar({
          message: error?.message || 'An error has occurred',
          type: 'error'
        })
      },
      onMutate() {
        setIsSubmitting(true)
      },
      onSettled() {
        setIsSubmitting(false)
      }
    }
  )

  const submitLogin = useCallback(
    function submit(form: FormData) {
      mutateSignIn(form)
    },
    [mutateSignIn]
  )

  return (
    <>
      <form
        className='flex w-full flex-col gap-[62px]'
        onSubmit={handleSubmit(submitLogin)}
      >
        <div className='flex flex-col gap-[18px]'>
          <Input
            inputProps={{
              type: 'email',
              ...register('email', {
                required: true
              }),
              placeholder: 'Enter your email'
            }}
          />
          <PasswordInput
            inputProps={{
              ...register('password', {
                required: true
              })
            }}
          />
        </div>
        <div className='flex flex-col gap-2.5'>
          <Button loading={isSubmitting} disabled={!isValid}>
            Login
          </Button>
        </div>
      </form>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </>
  )
}
