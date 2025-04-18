import { webRequest } from '@/lib/http'

export async function getTasksLogs(id: number) {
  const response = await webRequest.get(`/api/tasks/${id}/logs`)
  return response.data
}
