import { webRequest } from '@/lib/http'

export async function getTasks() {
  const response = await webRequest.get('/api/tasks')
  return response.data
}
