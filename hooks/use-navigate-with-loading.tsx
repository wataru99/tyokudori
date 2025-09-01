'use client'

import { useRouter } from 'next/navigation'
import { useNavigation } from '@/providers/navigation-provider'
import { useCallback } from 'react'

export function useNavigateWithLoading() {
  const router = useRouter()
  const { setIsNavigating } = useNavigation()

  const navigate = useCallback((href: string) => {
    setIsNavigating(true)
    router.push(href)
  }, [router, setIsNavigating])

  const replace = useCallback((href: string) => {
    setIsNavigating(true)
    router.replace(href)
  }, [router, setIsNavigating])

  const back = useCallback(() => {
    setIsNavigating(true)
    router.back()
  }, [router, setIsNavigating])

  const forward = useCallback(() => {
    setIsNavigating(true)
    router.forward()
  }, [router, setIsNavigating])

  return {
    navigate,
    replace,
    back,
    forward
  }
}