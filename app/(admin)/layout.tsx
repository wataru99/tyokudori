import { Header } from '@/components/ui/header'
import { Sidebar } from '@/components/ui/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header role="admin" userName="システム管理者" userEmail="admin@tyokudori.com" />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar role="admin" />
        <main className="flex-1 min-h-[calc(100vh-5rem)] px-4 py-4">
          {children}
        </main>
      </div>
    </div>
  )
}