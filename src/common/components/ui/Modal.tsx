/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/common/components/shared/form/Input'
import { Button } from '@/common/components/ui/Button'
import useMutation from 'use-mutation'
import { createTask } from '@/modules/tasks/api/create-task'
import { editTask } from '@/modules/tasks/api/edit-task'
import { useUsersList } from '@/modules/tasks/hooks/use-users-list'
import { swrImmutableConfig } from '@/lib/http'
import { useSession } from 'next-auth/react'
import { useTaskLogs } from '@/modules/tasks/hooks/use-tasks-log'
import { format } from 'date-fns'
import { TaskStatus } from '@/modules/tasks/tasks.type'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'ON_PROGRESS', 'DONE', 'REJECT']),
  teamId: z.number().optional()
})

type FormData = z.infer<typeof schema>

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    id?: number
    title?: string
    description?: string
    status?: TaskStatus
    teamId?: number
  }
  mutation: () => void
  onMessage: (msg: string, type: 'success' | 'error') => void
}

export default function Modal({
  isOpen,
  onClose,
  initialData = {},
  mutation,
  onMessage
}: TaskModalProps) {
  const { data: session } = useSession()

  const isLead = session?.user?.role === 'LEAD'
  const { data: users } = useUsersList(isLead, { ...swrImmutableConfig })

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isDirty },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      status: 'NOT_STARTED',
      teamId: undefined,
      ...initialData
    },
    mode: 'onChange'
  })

  const isEdit = Boolean(initialData.id)

  const {
    data: logs,
    isLoading: isLogsLoading,
    mutate: mutateLogs
  } = useTaskLogs(isEdit ? initialData.id : undefined, {
    revalidateOnMount: true
  })

  const [mutate, { status }] = useMutation(
    (data: FormData) =>
      isEdit ? editTask(initialData.id!, data) : createTask(data),
    {
      onSuccess() {
        onMessage('Task has been successfully saved', 'success')
        mutation()
        onClose()
      },
      onFailure({ error }) {
        onMessage(error?.message || 'An error has occurred', 'error')
      }
    }
  )

  const onSubmit = useCallback((data: FormData) => mutate(data), [mutate])

  useEffect(() => {
    if (isOpen && isEdit) {
      mutateLogs()
    }
  }, [isOpen, isEdit, mutateLogs])

  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        status: initialData.status ?? 'NOT_STARTED',
        teamId: isEdit ? initialData.teamId ?? undefined : undefined
      })
    }
  }, [isOpen, isEdit, initialData, reset])

  if (!isOpen) return null

  return (
    <>
      <div
        className='fixed inset-0 bg-secondary-50/50 z-40'
        onClick={onClose}
      />
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='relative bg-white rounded-lg w-full max-w-lg p-6 shadow-main bg-neutral-100'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-semibold'>
              {isEdit ? 'Edit' : 'Create'} Task
            </h3>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              &#10005;
            </button>
          </div>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            {session?.user?.role === 'LEAD' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Title <span className='font-bold text-error'>*</span>
                </label>
                <Input
                  inputProps={{
                    type: 'text',
                    ...register('title'),
                    placeholder: 'Input Title'
                  }}
                />
              </div>
            )}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                className='form-textarea w-full rounded border-secondary-10 text-body-3 focus:border-primary focus:ring-0'
                rows={4}
                placeholder='Input Description'
                maxLength={255}
              ></textarea>
            </div>
            {session?.user?.role === 'LEAD' && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Assigned to
                </label>
                <Controller
                  name='teamId'
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        field.onChange(v === '' ? undefined : parseInt(v, 10))
                      }}
                      className='form-select w-full rounded border-secondary-10 text-body-3 focus:border-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value='' disabled>
                        Select User
                      </option>
                      {users?.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status <span className='font-bold text-error'>*</span>
              </label>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className='form-select w-full rounded border-secondary-10 text-body-3 focus:border-primary focus:ring-0'
                  >
                    <option value='NOT_STARTED'>Not Started</option>
                    <option value='ON_PROGRESS'>On Progress</option>
                    <option value='DONE'>Done</option>
                    <option value='REJECT'>Reject</option>
                  </select>
                )}
              />
            </div>
            <div className='flex justify-end space-x-2 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={status === 'running'}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                loading={status === 'running'}
                disabled={!isValid || (isEdit && !isDirty)}
              >
                Save Changes
              </Button>
            </div>
          </form>

          {isEdit && (
            <div className='mt-6'>
              <h4 className='text-lg font-semibold mb-4'>Activity Logs</h4>
              {isLogsLoading ? (
                <p className='text-sm text-gray-500'>Loading logs...</p>
              ) : logs.length === 0 ? (
                <p className='text-sm text-gray-500'>No activity yet.</p>
              ) : (
                <div className='relative border-l-2 border-gray-200 pl-4 max-h-64 overflow-y-auto space-y-6'>
                  {logs.map((log: any) => (
                    <div key={log.id} className='relative'>
                      <span className='absolute -left-1.5 top-1 w-3 h-3 bg-primary rounded-full ring-2 ring-white' />
                      <div className='bg-white p-4 rounded-lg shadow-sm'>
                        <p className='text-gray-800 text-sm'>
                          <span className='font-semibold'>
                            {log.user?.email || 'System'}
                          </span>{' '}
                          {log.action}
                        </p>
                        {log.details && (
                          <p className='text-gray-600 text-sm mt-2 whitespace-pre-line'>
                            {log.details}
                          </p>
                        )}
                        <p className='text-gray-500 text-xs mt-1'>
                          {format(
                            new Date(log.timestamp),
                            'dd MMM yyyy h:mm aa'
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
