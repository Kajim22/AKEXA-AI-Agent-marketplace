'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Bot, Globe, PlusCircle, TrendingUp, ArrowRight } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  published: boolean
  publicSlug: string
  category: string
  price: number
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agents')
      .then(r => r.json())
      .then(data => { setAgents(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const published = agents.filter(a => a.published).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          স্বাগতম, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1">তোমার AI Agent platform overview</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'মোট Agent', value: agents.length, icon: <Bot size={20} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Published', value: published, icon: <Globe size={20} />, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'মোট আয়', value: '৳০', icon: <TrendingUp size={20} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-5">
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">তোমার Agents</h2>
          <Link href="/dashboard/builder" className="flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 transition-colors">
            <PlusCircle size={15} /> নতুন বানাও
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">লোড হচ্ছে...</div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">এখনো কোনো Agent বানাওনি</p>
            <Link href="/dashboard/builder" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors">
              <PlusCircle size={15} /> প্রথম Agent বানাও
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-surface-900 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <Bot size={17} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.category} · {agent.published ? '🟢 Published' : '⚫ Draft'}</p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="text-xs text-brand-500 px-3 py-1.5 rounded-lg border border-brand-500/20 hover:border-brand-500/40 transition-colors flex items-center gap-1"
                >
                  এডিট <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
