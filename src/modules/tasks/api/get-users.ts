import { webRequest } from '@/lib/http'

export async function getUsers() {
  const response = await webRequest.get('/api/users')
  return response.data
}
