import { webRequest } from '@/lib/http'
import { TaskPayload } from '@/modules/tasks/tasks.type'

export async function createTask(payload: TaskPayload) {
  return await webRequest.post(`/api/tasks`, payload)
}
