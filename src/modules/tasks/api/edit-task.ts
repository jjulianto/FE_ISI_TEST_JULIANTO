import { webRequest } from '@/lib/http'
import { TaskPayload } from '@/modules/tasks/tasks.type'

export async function editTask(id: number, payload: TaskPayload) {
  return webRequest.patch(`/api/tasks/${id}`, payload)
}
