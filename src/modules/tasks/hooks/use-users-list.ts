import { getUsers } from '@/modules/tasks/api/get-users'
import useSWR, { SWRConfiguration } from 'swr'

export function useUsersList(
  enabled: boolean,
  config?: Partial<SWRConfiguration>
) {
  const key = enabled ? '/api/users' : null
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    getUsers,
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
