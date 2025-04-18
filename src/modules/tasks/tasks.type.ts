export type TaskStatus = 'NOT_STARTED' | 'ON_PROGRESS' | 'DONE' | 'REJECT'

export interface TaskPayload {
  title: string
  description?: string
  status: TaskStatus
  teamId?: number
}
