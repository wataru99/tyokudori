'use client'

import { useEffect } from 'react'
import { io } from 'socket.io-client'

// Socket.IOの自動接続を無効化
if (typeof window !== 'undefined') {
  // グローバルなSocket.IOマネージャーの自動接続を無効化
  const manager = (io as any).managers
  if (manager) {
    Object.keys(manager).forEach(key => {
      const m = manager[key]
      if (m && m.autoConnect) {
        m.autoConnect = false
      }
    })
  }
}

export function SocketConfig() {
  useEffect(() => {
    // クリーンアップ: ページを離れる時にすべての接続を切断
    return () => {
      const manager = (io as any).managers
      if (manager) {
        Object.keys(manager).forEach(key => {
          const m = manager[key]
          if (m && m.engine && m.engine.close) {
            m.engine.close()
          }
        })
      }
    }
  }, [])

  return null
}