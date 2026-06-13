'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bot, Search, ExternalLink, ShoppingBag } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'সব' },
  { id: 'customer-support', label: '💬 Support' },
  { id: 'sales', label: '💰 Sales' },
  { id: 'education', label: '📚 Education' },
  { id: 'ecommerce', label: '🛍️ E-commerce' },
  { id: 'social-media', label: '📱 Social Media' },
  { id: 'real-estate', label: '🏠 Real Estate' },
]

interface Agent {
  id: string
  name: string
  description: string
  category: string
  price: number
  publicSlug: string
  user: { name: string }
}

export default function MarketplacePage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('q', search)

    fetch(`/api/marketplace?${params}`)
      .then(r => r.json())
      .then(data => { setAgents(Array.isArray(data) ? data : []); setLoading(false) })
  }, [search, category])

  return (
    <div className="min-h-screen bg-[#13151f]">
      <nav className="border-b border-white/5 glass px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Bot size={15} />
          </div>
          <span className="font-semibold">AKEXA</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-brand-500 hover:underline">Dashboard →</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-brand-500 mb-3">
            <ShoppingBag size={18} />
            <span className="text-sm font-medium">AI Agent Marketplace</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">AI Agent খোঁজো</h1>
          <p className="text-gray-400">তোমার ব্যবসার জন্য সঠিক AI Agent খোঁজো</p>
        </div>

        <div className="relative max-w-md mx-auto mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-800 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500"
            placeholder="Agent খোঁজো..."
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${category === cat.id ? 'bg-brand-500 text-white' : 'bg-surface-800 text-gray-400 border border-white/10'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">লোড হচ্ছে...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-16">
            <Bot size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">কোনো Agent পাওয়া যায়নি</p>
            <Link href="/dashboard/builder" className="text-brand-500 hover:underline text-sm mt-2 inline-block">
              প্রথম Agent বানাও →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {agents.map(agent => (
              <div key={agent.id} className="glass rounded-2xl p-5 hover:border-white/15 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Bot size={18} className="text-brand-500" />
                  </div>
                  <span className="text-xs text-gray-500">{agent.user?.name}</span>
                </div>
                <h3 className="font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{agent.description || 'AI Agent'}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${agent.price === 0 ? 'text-green-400' : 'text-white'}`}>
                    {agent.price === 0 ? 'ফ্রি' : `৳${agent.price}/মাস`}
                  </span>
                  <a
                    href={`/agent/${agent.publicSlug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-sm bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ব্যবহার করো <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
              }
