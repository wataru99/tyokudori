'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { useState } from 'react'
import { NavigationProvider } from '@/providers/navigation-provider'
import { ToastProvider } from '@/hooks/use-toast'
import { LoadingProvider } from '@/contexts/loading-context'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <ToastProvider>
          <NavigationProvider>
            {children}
            <Toaster />
          </NavigationProvider>
        </ToastProvider>
      </LoadingProvider>
    </QueryClientProvider>
  )
}