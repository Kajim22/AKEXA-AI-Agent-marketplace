import type { Metadata } from 'next'
import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'AKEXA — AI Agent Builder & Marketplace',
  description: 'বাংলাদেশের প্রথম AI Agent Builder প্ল্যাটফর্ম।',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="bn">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
