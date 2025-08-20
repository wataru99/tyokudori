'use client'

import { io, Socket } from 'socket.io-client'

let adminSocket: Socket | null = null
let publisherSocket: Socket | null = null
let advertiserSocket: Socket | null = null

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'

export function getAdminSocket() {
  if (!adminSocket) {
    adminSocket = io(`${SOCKET_URL}/ws/admin`, {
      autoConnect: false,
    })
  }
  return adminSocket
}

export function getPublisherSocket() {
  if (!publisherSocket) {
    publisherSocket = io(`${SOCKET_URL}/ws/publisher`, {
      autoConnect: false,
    })
  }
  return publisherSocket
}

export function getAdvertiserSocket() {
  if (!advertiserSocket) {
    advertiserSocket = io(`${SOCKET_URL}/ws/advertiser`, {
      autoConnect: false,
    })
  }
  return advertiserSocket
}

export function connectSocket(role: 'admin' | 'publisher' | 'advertiser', userId?: string) {
  let socket: Socket | null = null
  
  switch (role) {
    case 'admin':
      socket = getAdminSocket()
      break
    case 'publisher':
      socket = getPublisherSocket()
      break
    case 'advertiser':
      socket = getAdvertiserSocket()
      break
  }
  
  if (socket && !socket.connected) {
    socket.connect()
    
    if (userId) {
      socket.emit('room:join', `${role}:${userId}`)
    }
  }
  
  return socket
}

export function disconnectAllSockets() {
  if (adminSocket?.connected) adminSocket.disconnect()
  if (publisherSocket?.connected) publisherSocket.disconnect()
  if (advertiserSocket?.connected) advertiserSocket.disconnect()
}