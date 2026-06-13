'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Key, Eye, EyeOff, CheckCircle, Save } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('anthropic_api_key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-1">তোমার অ্যাকাউন্ট ও API কনফিগার করো</p>
      </div>

      <div className="glass rounded-2xl p-6 mb-5">
        <h2 className="font-semibold mb-4">প্রোফাইল</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">নাম</label>
            <input
              defaultValue={session?.user?.name || ''}
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">ইমেইল</label>
            <input
              defaultValue={session?.user?.email || ''}
              disabled
              className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Key size={16} className="text-brand-500" />
          <h2 className="font-semibold">Anthropic API Key</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          তোমার agent চালাতে Anthropic API Key লাগবে।{' '}
          <a href="https://console.anthropic.com" target="_blank" className="text-brand-500 hover:underline">
            এখান থেকে পাও →
          </a>
        </p>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="w-full bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-brand-500 pr-12"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button
          onClick={handleSave}
          className="mt-3 flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {saved ? <><CheckCircle size={15} /> সেভ হয়েছে!</> : <><Save size={15} /> API Key সেভ করো</>}
        </button>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Social Media Connect</h2>
        <p className="text-sm text-gray-400 mb-4">তোমার social account connect করো automation এর জন্য</p>
        <div className="space-y-3">
          {[
            { name: 'WhatsApp Business', color: 'text-green-400' },
            { name: 'Facebook Page', color: 'text-blue-400' },
            { name: 'Instagram', color: 'text-pink-400' },
            { name: 'LinkedIn', color: 'text-blue-300' },
            { name: 'YouTube', color: 'text-red-400' },
          ].map(platform => (
            <div key={platform.name} className="flex items-center justify-between p-3 bg-surface-900 rounded-xl">
              <span className={`text-sm font-medium ${platform.color}`}>{platform.name}</span>
              <span className="text-xs text-gray-500 bg-surface-800 px-2 py-1 rounded-full">শীঘ্রই আসছে</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
