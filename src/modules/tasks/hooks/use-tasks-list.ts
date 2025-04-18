import { getTasks } from '@/modules/tasks/api/get-tasks'
import useSWR, { SWRConfiguration } from 'swr'

export function useTasksList(config?: Partial<SWRConfiguration>) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'tasks-list',
    getTasks,
    config
  )

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate
  }
}
