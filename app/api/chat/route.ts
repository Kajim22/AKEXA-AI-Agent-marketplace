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
      ...(history || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: agent.systemPrompt }],
          },
          contents: msgs,
          generationConfig: {
            temperature: agent.temperature,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'AI থেকে সাড়া পাওয়া যায়নি' }, { status: 500 })
    }

    const data = await response.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ reply })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
