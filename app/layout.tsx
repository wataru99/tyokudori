import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SocketConfig } from './socket-config'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'tyokudori - アフィリエイト管理システム',
  description: 'tyokudori - アフィリエイト運営会社向けASP管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <Providers>
          <SocketConfig />
          {children}
        </Providers>
      </body>
    </html>
  )
}