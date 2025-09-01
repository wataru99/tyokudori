'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { LoadingOverlay } from '@/components/ui/loading-overlay'

interface LoadingContextType {
  setLoading: (loading: boolean, message?: string) => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('読み込み中...')

  const setLoading = (loading: boolean, msg?: string) => {
    setIsLoading(loading)
    if (msg) setMessage(msg)
  }

  return (
    <LoadingContext.Provider value={{ setLoading, isLoading }}>
      <LoadingOverlay isVisible={isLoading} message={message} />
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}