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
    if (user.role !== 'LEAD') {
      return Response.json({ message: 'Forbidden' }, { status: 403 })
    }
    const users = await prisma.user.findMany({
      where: { role: 'TEAM' },
      select: { id: true, email: true }
    })
    return Response.json(users)
  } catch (e: any) {
    const status = e.message === 'Unauthorized' ? 401 : 400
    return Response.json({ message: e.message }, { status })
  }
}
