'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Bot, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে')
      setLoading(false)
      return
    }

    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#13151f]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
            <Bot size={24} />
          </div>
          <h1 className="text-2xl font-bold">অ্যাকাউন্ট খোলো</h1>
          <p className="text-gray-400 text-sm mt-1">ফ্রিতে শুরু করো</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">তোমার নাম</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="রাফি হাসান"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">ইমেইল</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="rafi@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">পাসওয়ার্ড</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> তৈরি হচ্ছে...</> : 'অ্যাকাউন্ট তৈরি করো'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          আগেই আছো?{' '}
          <Link href="/auth/login" className="text-brand-500 hover:underline">
            লগইন করো
          </Link>
        </p>
      </div>
    </div>
  )
}
