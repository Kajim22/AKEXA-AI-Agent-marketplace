'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Bot, LayoutDashboard, PlusCircle, ShoppingBag, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/dashboard/agents', icon: <Bot size={18} />, label: 'আমার Agents' },
  { href: '/dashboard/builder', icon: <PlusCircle size={18} />, label: 'নতুন Agent' },
  { href: '/marketplace', icon: <ShoppingBag size={18} />, label: 'Marketplace' },
  { href: '/dashboard/settings', icon: <Settings size={18} />, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13151f]">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#13151f]">
      <aside className="w-60 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Bot size={15} />
          </div>
          <span className="font-semibold tracking-tight">Agentify</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-brand-500/10 text-brand-500 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-semibold text-brand-500">
              {session?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors"
          >
            <LogOut size={16} />
            লগআউট
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
