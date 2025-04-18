/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/common/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromHeader(req)
    const { id } = await params
    const taskId = parseInt(id, 10)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { leadId: true, teamId: true }
    })
    if (!task) {
      return Response.json({ message: 'Task not found' }, { status: 404 })
    }
    if (
      (user.role === 'LEAD' && task.leadId !== user.id) ||
      (user.role === 'TEAM' && task.teamId !== user.id)
    ) {
      return Response.json({ message: 'Forbidden' }, { status: 403 })
    }

    const logs = await prisma.taskLog.findMany({
      where: { taskId },
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { id: true, email: true } }
      }
    })
    return Response.json(logs)
  } catch (e: any) {
    const code = e.message === 'Unauthorized' ? 401 : 400
    return Response.json({ message: e.message }, { status: code })
  }
}
