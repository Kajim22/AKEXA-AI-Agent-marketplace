import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const agent = await prisma.agent.findFirst({
    where: { id: params.id, userId: session.user.id },
  })

  if (!agent) return NextResponse.json({ error: 'Agent পাওয়া যায়নি' }, { status: 404 })
  return NextResponse.json(agent)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const agent = await prisma.agent.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!agent) return NextResponse.json({ error: 'Agent পাওয়া যায়নি' }, { status: 404 })

  const updated = await prisma.agent.update({
    where: { id: params.id },
    data: {
      name: body.name ?? agent.name,
      description: body.description ?? agent.description,
      systemPrompt: body.systemPrompt ?? agent.systemPrompt,
      model: body.model ?? agent.model,
      temperature: body.temperature ?? agent.temperature,
      published: body.published ?? agent.published,
      price: body.price ?? agent.price,
      category: body.category ?? agent.category,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const agent = await prisma.agent.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!agent) return NextResponse.json({ error: 'Agent পাওয়া যায়নি' }, { status: 404 })

  await prisma.agent.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
