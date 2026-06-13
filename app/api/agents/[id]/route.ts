import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
