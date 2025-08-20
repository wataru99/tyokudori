import { Server, Socket } from 'socket.io'

export function setupSocketHandlers(io: Server) {
  // Admin namespace
  const adminNamespace = io.of('/ws/admin')
  adminNamespace.on('connection', (socket: Socket) => {
    console.log('Admin connected:', socket.id)
    
    socket.on('room:join', (room: string) => {
      socket.join(room)
      console.log(`Admin ${socket.id} joined room: ${room}`)
    })
    
    socket.on('disconnect', () => {
      console.log('Admin disconnected:', socket.id)
    })
  })

  // Publisher namespace
  const publisherNamespace = io.of('/ws/publisher')
  publisherNamespace.on('connection', (socket: Socket) => {
    console.log('Publisher connected:', socket.id)
    
    socket.on('room:join', (room: string) => {
      socket.join(room)
      console.log(`Publisher ${socket.id} joined room: ${room}`)
    })
    
    socket.on('disconnect', () => {
      console.log('Publisher disconnected:', socket.id)
    })
  })

  // Advertiser namespace
  const advertiserNamespace = io.of('/ws/advertiser')
  advertiserNamespace.on('connection', (socket: Socket) => {
    console.log('Advertiser connected:', socket.id)
    
    socket.on('room:join', (room: string) => {
      socket.join(room)
      console.log(`Advertiser ${socket.id} joined room: ${room}`)
    })
    
    socket.on('disconnect', () => {
      console.log('Advertiser disconnected:', socket.id)
    })
  })
}

// Helper functions to emit events
export function emitConversionNew(io: Server, data: any) {
  io.of('/ws/admin').emit('conversion:new', data)
  io.of('/ws/publisher').to(`publisher:${data.publisherId}`).emit('conversion:new', data)
  io.of('/ws/advertiser').to(`advertiser:${data.advertiserId}`).emit('conversion:new', data)
}

export function emitConversionApproved(io: Server, data: any) {
  io.of('/ws/admin').emit('conversion:approved', data)
  io.of('/ws/publisher').to(`publisher:${data.publisherId}`).emit('conversion:approved', data)
  io.of('/ws/advertiser').to(`advertiser:${data.advertiserId}`).emit('conversion:approved', data)
}

export function emitConversionRejected(io: Server, data: any) {
  io.of('/ws/admin').emit('conversion:rejected', data)
  io.of('/ws/publisher').to(`publisher:${data.publisherId}`).emit('conversion:rejected', data)
  io.of('/ws/advertiser').to(`advertiser:${data.advertiserId}`).emit('conversion:rejected', data)
}