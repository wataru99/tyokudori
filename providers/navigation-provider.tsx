'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { PageLoading } from '@/components/ui/loading'

interface NavigationContextType {
  isNavigating: boolean
  setIsNavigating: (value: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // パスが変更されたら、ナビゲーション完了とみなす
    if (isNavigating) {
      // 少し遅延させてからローディングを終了
      const timer = setTimeout(() => {
        setIsNavigating(false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating])

  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-150">
          <div className="text-center">
            <div className="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-3 text-sm font-medium text-gray-700">ページを読み込んでいます...</p>
          </div>
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}