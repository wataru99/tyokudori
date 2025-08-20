'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectAllSockets } from '@/lib/socket'
import { useToast } from '@/components/ui/use-toast'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}

interface SocketProviderProps {
  children: ReactNode
  role: 'admin' | 'publisher' | 'advertiser'
  userId?: string
}

export function SocketProvider({ children, role, userId }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const socket = connectSocket(role, userId)
    
    if (socket) {
      setSocket(socket)

      socket.on('connect', () => {
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
      })

      // Handle real-time notifications
      socket.on('conversion:new', (data) => {
        toast({
          title: '新しい成果が発生しました',
          description: `成果ID: ${data.conversionId}`,
        })
      })

      socket.on('conversion:approved', (data) => {
        toast({
          title: '成果が承認されました',
          description: `成果ID: ${data.conversionId}`,
          variant: 'default',
        })
      })

      socket.on('conversion:rejected', (data) => {
        toast({
          title: '成果が否認されました',
          description: `成果ID: ${data.conversionId}`,
          variant: 'destructive',
        })
      })

      socket.on('ticket:new', (data) => {
        toast({
          title: '新しい問い合わせ',
          description: data.subject,
        })
      })
    }

    return () => {
      disconnectAllSockets()
    }
  }, [role, userId, toast])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}