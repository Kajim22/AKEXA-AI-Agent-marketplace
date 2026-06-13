'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Bot, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AgentInfo {
  name: string
  description: string
  category: string
}

export default function PublicAgentPage() {
  const { slug } = useParams()
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [agentLoading, setAgentLoading] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/marketplace')
      .then(r => r.json())
      .then((agents: any[]) => {
        const agent = agents.find(a => a.publicSlug === slug)
        if (agent) setAgentInfo({ name: agent.name, description: agent.description, category: agent.category })
        else setError('এই Agent পাওয়া যায়নি')
        setAgentLoading(false)
      })
      .catch(() => { setError('লোড করতে সমস্যা হয়েছে'); setAgentLoading(false) })
  }, [slug])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentSlug: slug, message: input, messages }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'দুঃখিত, একটা সমস্যা হয়েছে।' }])
    }
    setLoading(false)
  }

  if (agentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13151f]">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13151f]">
        <div className="text-center">
          <Bot size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#13151f]">
      <div className="border-b border-white/5 glass px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <Bot size={20} className="text-brand-500" />
        </div>
        <div>
          <h1 className="font-semibold">{agentInfo?.name}</h1>
          <p className="text-xs text-gray-400">{agentInfo?.description || agentInfo?.category}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">সালাম! আমি {agentInfo?.name}। কীভাবে সাহায্য করতে পারি?</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium ${msg.role === 'user' ? 'bg-brand-500' : 'bg-surface-800 border border-white/10'}`}>
              {msg.role === 'user' ? 'তুমি' : <Bot size={14} />}
            </div>
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-surface-800 border border-white/5 text-gray-100 rounded-tl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center">
              <Bot size={14} />
            </div>
            <div className="bg-surface-800 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/5 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="flex-1 bg-surface-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            placeholder="তোমার প্রশ্ন লেখো..."
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">Powered by Agentify 🤖</p>
      </div>
    </div>
  )
    }
