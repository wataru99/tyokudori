'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLoading } from '@/contexts/loading-context'
import { useCallback } from 'react'

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { setLoading } = useLoading()

  const navigate = useCallback((path: string) => {
    if (pathname === path) return
    
    // 即座にローディングを表示
    setLoading(true, 'ページを移動しています...')
    
    // 少し遅延を入れてからナビゲーション（UXのため）
    setTimeout(() => {
      router.push(path)
      
      // ページ遷移後にローディングを解除
      // Next.jsのページ遷移が完了するまでの時間を考慮
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }, 100)
  }, [pathname, router, setLoading])

  return { navigate }
}