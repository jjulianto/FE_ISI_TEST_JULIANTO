'use client'

import { useState } from 'react'
import { Button } from '@/common/components/ui/Button'
import clsx from 'clsx'
import { useTasksList } from '@/modules/tasks/hooks/use-tasks-list'
import { swrImmutableConfig } from '@/lib/http'
import Modal from '@/common/components/ui/Modal'
import { LoadingPlaceholder } from '@/common/components/ui/LoadingPlaceholder'
import { Snackbar } from '@/common/components/shared/Snackbar'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'

type Task = {
  id: number
  title: string
  status: 'NOT_STARTED' | 'ON_PROGRESS' | 'DONE' | 'REJECT'
  description: string
  createdAt: string
  team?: {
    id: number
    email: string
  }
}

const statusStyles: Record<
  Task['status'],
  { label: string; bg: string; text: string; border: string }
> = {
  NOT_STARTED: {
    label: 'Not Started',
    bg: 'bg-neutral-50',
    text: 'text-neutral-100',
    border: 'border-l-4 border-neutral-50'
  },
  ON_PROGRESS: {
    label: 'On Progress',
    bg: 'bg-blue-50',
    text: 'text-neutral-100',
    border: 'border-l-4 border-blue-50'
  },
  DONE: {
    label: 'Done',
    bg: 'bg-green-60',
    text: 'text-neutral-100',
    border: 'border-l-4 border-green-60'
  },
  REJECT: {
    label: 'Reject',
    bg: 'bg-error-50',
    text: 'text-neutral-100',
    border: 'border-l-4 border-error-50'
  }
}

export default function Tasks() {
  const { data: session } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState<Partial<Task>>({})
  const [snackbar, setSnackbar] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  function handleEdit(task: Task) {
    setCurrent(task)
    setIsOpen(true)
  }

  const {
    data: tasks,
    error,
    isLoading,
    isValidating,
    mutate: mutationList
  } = useTasksList({
    ...swrImmutableConfig
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingPlaceholder />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64 text-red-600'>
        Error loading tasks: {error.message || 'Unknown error'}
      </div>
    )
  }

  return (
    <>
      <section className='pt-20'>
        {session?.user?.role === 'LEAD' && (
          <div className='mb-6 max-w-max'>
            <Button
              onClick={() => {
                setCurrent({})
                setIsOpen(true)
              }}
              loading={isValidating}
            >
              <Image src='/icon/arrow-plus.svg' width={16} height={16} alt='' />
              <p className='w-full whitespace-nowrap'>Create Task</p>
            </Button>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 bg-neutral-100 rounded-lg shadow-slight'>
            <h2 className='text-lg font-semibold text-secondary-80'>
              No tasks available
            </h2>
            {session?.user?.role === 'LEAD' && (
              <p className='text-secondary-50'>
                Click the button above to create a new task.
              </p>
            )}
          </div>
        ) : (
          <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8'>
            {tasks.map((task: Task) => {
              const { label, bg, text, border } = statusStyles[task.status]
              return (
                <li
                  key={task.id}
                  className={clsx(
                    'flex flex-col bg-neutral-100 rounded-lg shadow-slight hover:shadow-main transition-shadow',
                    border
                  )}
                >
                  <div className='p-5 flex-1 flex flex-col'>
                    <div className='flex justify-between items-start mb-2'>
                      <h2 className='text-lg font-semibold text-secondary-80'>
                        {task.title}
                      </h2>
                      <span
                        className={clsx(
                          'px-2 py-1 rounded text-xs font-medium',
                          bg,
                          text
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    <p className='text-secondary-50 flex-1'>
                      {task.description}
                    </p>
                    <div className='mt-4 text-xs text-secondary-50 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div className='flex flex-col'>
                        <span>Assigned to:</span>
                        <span className='mt-1 truncate w-full'>
                          {task.team?.email || '-'}
                        </span>
                      </div>
                      <div className='flex flex-col sm:items-end'>
                        <span>Created:</span>
                        <span className='mt-1 whitespace-nowrap'>
                          {format(new Date(task.createdAt), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='px-5 py-3 border-t border-neutral-95'>
                    <Button
                      variant='outline'
                      size='small'
                      className='w-full text-center'
                      onClick={() => handleEdit(task)}
                      disabled={isValidating}
                      loading={isValidating}
                    >
                      Edit Task
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={current}
        mutation={mutationList}
        onMessage={(message, type) => {
          setSnackbar({ message, type })
        }}
      />

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
