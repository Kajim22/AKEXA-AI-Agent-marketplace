'use client'
import Link from 'next/link'
import { Bot, Zap, Globe, ShoppingBag, ArrowRight, Check, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#13151f] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Agentify</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Marketplace
            </Link>
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link href="/auth/register" className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-5 py-2 rounded-lg transition-colors font-medium">
              শুরু করো
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8 text-sm text-brand-500">
            <Zap size={14} />
            বাংলাদেশের প্রথম AI Agent Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            AI Agent বানাও।<br />
            <span className="text-brand-500">বিক্রি করো।</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            শক্তিশালী AI Agent তৈরি করো, পাবলিশ করো এবং ক্লায়েন্টদের কাছে বিক্রি করো।
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth/register" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 glow">
              ফ্রিতে শুরু করো <ArrowRight size={18} />
            </Link>
            <Link href="/marketplace" className="border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all">
              Marketplace দেখো
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">সব কিছু এক জায়গায়</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Bot size={24} />, title: 'Agent Builder', desc: 'Visual interface দিয়ে AI Agent বানাও।', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { icon: <Globe size={24} />, title: 'Publish & Share', desc: 'এক ক্লিকে পাবলিশ করো। Unique link পাও।', color: 'text-green-400', bg: 'bg-green-400/10' },
              { icon: <ShoppingBag size={24} />, title: 'Marketplace', desc: 'তোমার Agent মার্কেটপ্লেসে লিস্ট করো।', color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <div className={`${f.bg} ${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">সহজ মূল্য পরিকল্পনা</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '০', period: 'সবসময় ফ্রি', features: ['৩টি Agent', '৫০০ message/মাস', 'Public link'], cta: 'শুরু করো', highlight: false },
              { name: 'Pro', price: '৯৯৯', period: '/মাস', features: ['Unlimited Agent', '১০,০০০ message/মাস', 'Marketplace listing', 'Social automation'], cta: 'Pro নাও', highlight: true },
              { name: 'Business', price: '২,৯৯৯', period: '/মাস', features: ['সব Pro সুবিধা', 'White-label', 'Custom domain', 'API access'], cta: 'যোগাযোগ করো', highlight: false },
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-6 ${plan.highlight ? 'bg-brand-500 glow' : 'glass'}`}>
                {plan.highlight && <div className="flex items-center gap-1 text-xs font-medium mb-3 bg-white/20 rounded-full px-3 py-1 w-fit"><Star size={10} /> সবচেয়ে জনপ্রিয়</div>}
                <div className="mb-6">
                  <p className={`text-sm mb-1 ${plan.highlight ? 'text-blue-100' : 'text-gray-400'}`}>{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">৳{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-blue-100' : 'text-gray-400'}`}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <Check size={15} className={plan.highlight ? 'text-white' : 'text-brand-500'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className={`block text-center py-3 rounded-xl font-medium transition-all ${plan.highlight ? 'bg-white text-brand-600 hover:bg-blue-50' : 'border border-white/10 hover:border-white/20'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-gray-500">
        <p>© 2024 Agentify — Made in Bangladesh 🇧🇩</p>
      </footer>
    </div>
  )
                                                }
