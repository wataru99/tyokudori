'use client'

import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Megaphone, 
  TrendingUp, 
  Settings, 
  FileText,
  Users,
  BarChart3,
  Mail,
  MessageSquare
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface SidebarProps {
  role: 'admin' | 'advertiser' | 'publisher'
}

export function Sidebar({ role }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'admin':
        return [
          { title: 'ダッシュボード', href: '/admin', icon: LayoutDashboard },
          { title: 'ユーザー管理', href: '/admin/users', icon: Users },
          { title: '案件管理', href: '/admin/campaigns', icon: Megaphone },
          { title: 'レポート', href: '/admin/reports', icon: BarChart3 },
          { title: 'お問い合わせ管理', href: '/admin/inquiries', icon: MessageSquare },
          { title: '設定', href: '/admin/settings', icon: Settings },
        ]
      case 'advertiser':
        return [
          { title: 'ダッシュボード', href: '/advertiser', icon: LayoutDashboard },
          { title: '案件管理', href: '/advertiser/campaigns', icon: Megaphone },
          { title: '成果管理', href: '/advertiser/conversions', icon: TrendingUp },
          { title: 'レポート', href: '/advertiser/reports', icon: BarChart3 },
          { title: 'お問い合わせ', href: '/advertiser/contact', icon: Mail },
          { title: '設定', href: '/advertiser/settings', icon: Settings },
        ]
      case 'publisher':
        return [
          { title: 'ダッシュボード', href: '/publisher', icon: LayoutDashboard },
          { title: '案件一覧', href: '/publisher/offers', icon: Megaphone },
          { title: 'マイリンク', href: '/publisher/links', icon: FileText },
          { title: '成果レポート', href: '/publisher/conversions', icon: TrendingUp },
          { title: 'お問い合わせ', href: '/publisher/contact', icon: Mail },
          { title: '設定', href: '/publisher/settings', icon: Settings },
        ]
      default:
        return []
    }
  }

  const handleNavigate = (href: string) => {
    if (pathname === href) return
    router.push(href)
  }

  const navItems = getNavItems()

  return (
    <aside className="w-56 bg-card border-r border-border min-h-screen flex-shrink-0">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.title}</span>
              </button>
            )
          })}
        </nav>
      </aside>
  )
}