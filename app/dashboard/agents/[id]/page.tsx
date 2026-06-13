'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Globe, Copy, Trash2, Loader2, CheckCircle, ExternalLink } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  model: string
  temperature: number
  published: boolean
  publicSlug: string
  price: number
  category: string
}

export default function AgentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<Partial<Agent>>({})

  useEffect(() => {
    fetch(`/api/agents/${id}`)
      .then(r => r.json())
      .then(data => { setAgent(data); setForm(data); setLoading(false) })
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
  }

  const togglePublish = async () => {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !agent?.published }),
    })
    const updated = await res.json()
    setAgent(updated)
    setForm(updated)
  }

  const handleDelete = async () => {
    if (!confirm('এই Agent মুছে ফেলবে?')) return
    await fetch(`/api/agents/${id}`, { method: 'DELETE' })
    router.push('/dashboard')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/agent/${agent?.publicSlug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div className="p-8 text-gray-400">লোড হচ্ছে...</div>
  if (!agent) return <div className="p-8 text-red-400">Agent পাওয়া যায়নি</div>

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/agent/${agent.publicSlug}`

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          <p className="text-gray-400 mt-1 text-sm">{agent.category} · {agent.published ? '🟢 Published' : '⚫ Draft'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDelete} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <Trash2 size={18} />
          </button>
          <button
            onClick={togglePublish}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${agent.published ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}
          >
            <Globe size={15} />
            {agent.published ? 'Unpublish' : 'Publish করো'}
          </button>
        </div>
      </div>

      {agent.published && (
        <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3">
          <Globe size={16} className="text-green-400 flex-shrink-0" />
          <p className="text-sm text-gray-300 flex-1 truncate font-mono">{publicUrl}</p>
          <button onClick={copyLink} className="text-xs text-brand-500 flex items-center gap-1">
            {copied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
          <a href={publicUrl} target="_blank" className="text-gray-400 hover:text-white">
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      <div className="glass rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">নাম</label>
          <input
            value={form.name || ''}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">বর্ণনা</label>
          <textarea
            value={form.description || ''}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">System Prompt</label>
          <textarea
            value={form.systemPrompt || ''}
            onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
            className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none font-mono"
            rows={6}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">মূল্য (BDT)</label>
            <input
              type="number"
              value={form.price ?? 0}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              min={0}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-gray-400">Temperature</label>
              <span className="text-sm text-brand-500 font-mono">{form.temperature}</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.1}
              value={form.temperature ?? 0.7}
              onChange={e => setForm(f => ({ ...f, temperature: Number(e.target.value) }))}
              className="w-full accent-brand-500 mt-3"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          {saving ? <><Loader2 size={16} className="animate-spin" /> সেভ হচ্ছে...</> : '💾 পরিবর্তন সেভ করো'}
        </button>
      </div>
    </div>
  )
}
