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

export async function GET(req: Request) {
  try {
    const user = getUserFromHeader(req)
    const where = user.role === 'TEAM' ? { teamId: user.id } : {}

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        lead: { select: { id: true, email: true } },
        team: { select: { id: true, email: true } },
        logs: { orderBy: { timestamp: 'desc' } }
      }
    })

    return Response.json(tasks)
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromHeader(req)
    if (user.role !== 'LEAD') {
      return Response.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { title, description, status, teamId } = await req.json()
    if (!title) {
      return Response.json({ message: 'Title is required' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        leadId: user.id,
        teamId: teamId ?? null
      }
    })

    const statusLabels: Record<string, string> = {
      NOT_STARTED: 'Not Started',
      ON_PROGRESS: 'On Progress',
      DONE: 'Done',
      REJECT: 'Reject'
    }

    await prisma.taskLog.create({
      data: {
        taskId: task.id,
        userId: user.id,
        action: 'CREATE',
        details: `Task created with status "${statusLabels[status] || status}"`
      }
    })

    return Response.json(task, { status: 201 })
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 400 })
  }
}
