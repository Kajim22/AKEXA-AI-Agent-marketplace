import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agents = await prisma.agent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(agents)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, systemPrompt, model, temperature, category, price } = body

  if (!name || !systemPrompt) {
    return NextResponse.json({ error: 'নাম ও system prompt দাও' }, { status: 400 })
  }

  const agent = await prisma.agent.create({
    data: {
      name,
      description: description || '',
      systemPrompt,
      model: model || 'claude-sonnet-4-6',
      temperature: temperature ?? 0.7,
      category: category || 'general',
      price: price ?? 0,
      publicSlug: uuidv4().split('-')[0] + '-' + name.toLowerCase().replace(/\s+/g, '-').slice(0, 20),
      userId: session.user.id,
    },
  })

  return NextResponse.json(agent, { status: 201 })
}
