import { prisma } from '@/common/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        {
          message: 'Email and password are required.'
        },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return Response.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return Response.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return Response.json(
      {
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, role: user.role }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error during login:', error)
    return Response.json({ message: 'Failed to login' }, { status: 500 })
  }
}
