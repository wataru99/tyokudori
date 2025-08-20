import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

export default function AdvertiserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header role="advertiser" userName="広告主ユーザー" userEmail="advertiser@tyokudori.com" />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar role="advertiser" />
        <main className="flex-1 min-h-[calc(100vh-5rem)] px-4 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}