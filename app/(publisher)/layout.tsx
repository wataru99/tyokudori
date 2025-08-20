import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header role="publisher" userName="アフィリエイトパートナー" userEmail="publisher@tyokudori.com" />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar role="publisher" />
        <main className="flex-1 min-h-[calc(100vh-5rem)] px-4 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}