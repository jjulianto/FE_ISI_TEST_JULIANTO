import useSWR, { SWRConfiguration } from 'swr'
import { getTasksLogs } from '@/modules/tasks/api/get-task-logs'

export function useTaskLogs(
  taskId?: number,
  config?: Partial<SWRConfiguration>
) {
  const key = taskId ? `/api/tasks/${taskId}/logs` : null
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => getTasksLogs(taskId!),
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
