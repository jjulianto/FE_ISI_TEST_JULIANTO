/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/common/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

function getUserFromHeader(req: Request) {
  const auth = req.headers.get('Authorization') || ''
  const [scheme, token] = auth.split(' ')
  if (scheme !== 'Bearer' || !token) {
    throw new Error('Unauthorized')
  }

  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number
      role: 'LEAD' | 'TEAM'
    }
  } catch (err: any) {
    throw new Error(
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'
    )
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromHeader(req)
    const { id } = await params
    const taskId = parseInt(id, 10)
    const body = await req.json()

    const existing = await prisma.task.findUnique({ where: { id: taskId } })
    if (!existing)
      return Response.json({ message: 'Not found' }, { status: 404 })
    if (user.role === 'TEAM' && existing.teamId !== user.id) {
      return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    let data: any
    if (user.role === 'LEAD') {
      const { title, description, status, teamId } = body
      data = { title, description, status, teamId }
    } else {
      const { status, description } = body
      data = { status, description }
    }

    const statusLabels: Record<string, string> = {
      NOT_STARTED: 'Not Started',
      ON_PROGRESS: 'On Progress',
      DONE: 'Done',
      REJECT: 'Reject'
    }
    const fieldLabels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      teamId: 'Assigned to'
    }

    const diffs: string[] = []
    for (const key of Object.keys(data) as Array<
      Extract<keyof typeof data, string>
    >) {
      const beforeRaw = (existing as any)[key]
      const afterRaw = (data as any)[key]
      let beforeValue: string = String(beforeRaw ?? '')
      let afterValue: string = String(afterRaw ?? '')

      if (key === 'status') {
        beforeValue = statusLabels[beforeRaw] || beforeValue
        afterValue = statusLabels[afterRaw] || afterValue
      }
      if (key === 'teamId') {
        const [bUser, aUser] = await Promise.all([
          beforeRaw != null
            ? prisma.user.findUnique({ where: { id: beforeRaw } })
            : null,
          afterRaw != null
            ? prisma.user.findUnique({ where: { id: afterRaw } })
            : null
        ])
        beforeValue = bUser?.email ?? 'Unassigned'
        afterValue = aUser?.email ?? 'Unassigned'
      }

      if (beforeValue !== afterValue) {
        diffs.push(
          `${
            fieldLabels[key] ?? key
          } changed from "${beforeValue}" to "${afterValue}"`
        )
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data
    })

    await prisma.taskLog.create({
      data: {
        taskId,
        userId: user.id,
        action: 'UPDATE',
        details: diffs.join('; ')
      }
    })

    return Response.json(updated)
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 400 })
  }
}
