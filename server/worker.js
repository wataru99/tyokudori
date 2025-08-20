// Background worker for async tasks
console.log('Worker started')

// Keep the process alive
setInterval(() => {
  console.log('Worker heartbeat:', new Date().toISOString())
}, 60000) // Every minute