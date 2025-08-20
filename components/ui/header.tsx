'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bell, Settings, LogOut, User, Shield, Briefcase, Users } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  role: 'admin' | 'advertiser' | 'publisher'
  userName?: string
  userEmail?: string
}

export function Header({ role, userName = 'ユーザー', userEmail = 'user@example.com' }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigate = (path: string) => {
    if (pathname === path) return
    router.push(path)
  }

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem('userAuth')
    sessionStorage.removeItem('userAuth')
    
    // Redirect to appropriate login page based on role
    const loginPath = role === 'admin' ? '/admin-login' : 
                      role === 'advertiser' ? '/advertiser-login' : 
                      '/publisher-login'
    
    router.push(loginPath)
  }

  const getRoleConfig = () => {
    switch (role) {
      case 'admin':
        return {
          label: '管理者',
          icon: Shield,
          color: 'bg-primary text-primary-foreground',
          dashboardPath: '/admin'
        }
      case 'advertiser':
        return {
          label: '広告主',
          icon: Briefcase,
          color: 'bg-primary text-primary-foreground',
          dashboardPath: '/advertiser'
        }
      case 'publisher':
        return {
          label: 'アフィリエイター',
          icon: Users,
          color: 'bg-primary text-primary-foreground',
          dashboardPath: '/publisher'
        }
      default:
        return {
          label: 'ユーザー',
          icon: User,
          color: 'bg-gray-500 text-white border-gray-600',
          dashboardPath: '/'
        }
    }
  }

  const roleConfig = getRoleConfig()
  const RoleIcon = roleConfig.icon

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* ロゴとブランド名 */}
          <div className="flex items-center space-x-6">
            <div 
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => handleNavigate(roleConfig.dashboardPath)}
            >
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-semibold tracking-tight">tyokudori</h1>
                  <Badge variant="secondary" className="flex items-center space-x-2 px-3 py-1 text-xs font-medium">
                    <RoleIcon className="h-4 w-4" />
                    <span>{roleConfig.label}</span>
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {roleConfig.label}専用管理システム
                </div>
              </div>
            </div>
          </div>

          {/* 右側のアクション */}
          <div className="flex items-center space-x-3">
            {/* 通知ベル */}
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-accent/50 rounded-full transition-all duration-200">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-destructive-foreground rounded-full"></span>
              </span>
            </Button>

            {/* ユーザーメニュー */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 h-10 px-3 hover:bg-accent/50 rounded-lg transition-all duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm font-semibold bg-secondary text-secondary-foreground">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-foreground">{userName}</div>
                    <div className="text-xs text-muted-foreground">{roleConfig.label}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-lg border-border animate-fade-in">
                <div className="px-4 py-3 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                      <Badge className={`${roleConfig.color} text-xs mt-1`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <DropdownMenuItem 
                    className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => handleNavigate('/profile')}
                  >
                    <User className="mr-3 h-4 w-4" />
                    プロフィール
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer px-4 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors"
                    onClick={() => handleNavigate('/settings')}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    設定
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-1" />
                <div className="py-1">
                  <DropdownMenuItem 
                    className="cursor-pointer px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    ログアウト
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}