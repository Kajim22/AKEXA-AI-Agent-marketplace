'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, ChevronRight } from 'lucide-react'

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', desc: 'দ্রুত ও স্মার্ট' },
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', desc: 'সবচেয়ে শক্তিশালী' },
]

const CATEGORIES = [
  { id: 'general', label: '🤖 General' },
  { id: 'customer-support', label: '💬 Customer Support' },
  { id: 'sales', label: '💰 Sales' },
  { id: 'education', label: '📚 Education' },
  { id: 'healthcare', label: '🏥 Healthcare' },
  { id: 'ecommerce', label: '🛍️ E-commerce' },
  { id: 'real-estate', label: '🏠 Real Estate' },
  { id: 'social-media', label: '📱 Social Media' },
]

const TEMPLATES = [
  { name: 'Customer Support', prompt: 'তুমি একজন বিনয়ী ও সহায়ক কাস্টমার সাপোর্ট এজেন্ট। তুমি বাংলায় কথা বলো। গ্রাহকের সমস্যা মনোযোগ দিয়ে শোনো এবং সঠিক সমাধান দাও।' },
  { name: 'Sales Agent', prompt: 'তুমি একজন দক্ষ বিক্রয় প্রতিনিধি। তুমি বাংলায় কথা বলো। তোমার লক্ষ্য হলো গ্রাহকের প্রয়োজন বুঝে সঠিক পণ্য সুপারিশ করা।' },
  { name: 'Social Media Manager', prompt: 'তুমি একজন সৃজনশীল সোশ্যাল মিডিয়া ম্যানেজার। আকর্ষণীয় post, caption এবং hashtag তৈরি করো।' },
  { name: 'Real Estate Bot', prompt: 'তুমি একজন রিয়েল এস্টেট বিশেষজ্ঞ। বাড়ি কেনা-বেচা ও ভাড়া সংক্রান্ত সব প্রশ্নের উত্তর দাও।' },
]

export default function BuilderPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    model: 'claude-sonnet-4-6',
    temperature: 0.7,
    category: 'general',
    price: 0,
  })

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const agent = await res.json()
      router.push(`/dashboard/agents/${agent.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">নতুন AI Agent বানাও</h1>
        <p className="text-gray-400 mt-1">ধাপে ধাপে তোমার Agent কনফিগার করো</p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400'}`}>
              {s}
            </div>
            {s < 3 && <div className={`w-16 h-0.5 ${step > s ? 'bg-brand-500' : 'bg-white/10'}`} />}
          </div>
        ))}
        <div className="ml-2 text-sm text-gray-400">
          {step === 1 && 'তথ্য দাও'}{step === 2 && 'Prompt লেখো'}{step === 3 && 'Model ঠিক করো'}
        </div>
      </div>

      {step === 1 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Agent এর নাম *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              placeholder="যেমন: রেস্টুরেন্ট সাপোর্ট বট"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">বর্ণনা</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 resize-none"
              rows={3}
              placeholder="এই agent কী কাজ করে?"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${form.category === cat.id ? 'bg-brand-500/20 border border-brand-500/40 text-brand-500' : 'bg-surface-900 border border-white/10 text-gray-400'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">মূল্য (BDT/মাস) — ০ মানে ফ্রি</label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
              min={0}
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!form.name}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            পরের ধাপ <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400">System Prompt *</label>
            </div>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Sparkles size={12} /> Template থেকে শুরু করো</p>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => setForm(f => ({ ...f, systemPrompt: t.prompt, name: f.name || t.name }))}
                    className="text-left px-3 py-2 rounded-lg bg-surface-900 border border-white/10 hover:border-brand-500/30 text-xs text-gray-300"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={form.systemPrompt}
              onChange={e => setForm(f => ({ ...f, systemPrompt: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500 resize-none font-mono"
              rows={8}
              placeholder="তুমি একজন সহায়ক AI assistant..."
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-white py-2.5 rounded-lg font-medium">পেছনে</button>
            <button
              onClick={() => setStep(3)}
              disabled={!form.systemPrompt}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              পরের ধাপ <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">AI Model</label>
            <div className="space-y-2">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setForm(f => ({ ...f, model: m.id }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${form.model === m.id ? 'bg-brand-500/10 border-brand-500/40' : 'bg-surface-900 border-white/10'}`}
                >
                  <div>
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-gray-400">Temperature</label>
              <span className="text-sm text-brand-500 font-mono">{form.temperature}</span>
            </div>
            <input
              type="range" min={0} max={1} step={0.1}
              value={form.temperature}
              onChange={e => setForm(f => ({ ...f, temperature: Number(e.target.value) }))}
              className="w-full accent-brand-500"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white py-2.5 rounded-lg font-medium">পেছনে</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> তৈরি হচ্ছে...</> : '✅ Agent তৈরি করো'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
