import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { agentSlug, message, messages: history } = await req.json()

    const agent = await prisma.agent.findFirst({
      where: { publicSlug: agentSlug, published: true },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent পাওয়া যায়নি' }, { status: 404 })
    }

    const msgs = [
      ...(history || []),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: agent.model || 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: agent.systemPrompt,
        messages: msgs,
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI থেকে সাড়া পাওয়া যায়নি' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || ''

    return NextResponse.json({ reply, model: agent.model })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
