const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Sync data directory
const SYNC_DIR = path.join(__dirname, 'sync-data')
if (!fs.existsSync(SYNC_DIR)) {
  fs.mkdirSync(SYNC_DIR, { recursive: true })
}

// Initialize files
const initFile = (filename, defaultData = '[]') => {
  const filepath = path.join(SYNC_DIR, filename)
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, defaultData)
  }
}

initFile('products.json', '[]')
initFile('orders.json', '[]')
initFile('settings.json', '{}')

console.log('🚀 Simple Sync Server Starting...')
console.log(`📁 Sync directory: ${SYNC_DIR}`)

// Health check
app.get('/api/health', (req, res) => {
  console.log('📊 Health check requested')
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Simple sync server is running'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Punjabi Heritage Simple Sync Server',
    endpoints: ['/api/health', '/api/sync/products'],
    status: 'running'
  })
})

// Sync products endpoint
app.post('/api/sync/products', (req, res) => {
  console.log('🔄 Sync request received:', req.body)
  
  try {
    const { action, products, product } = req.body
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' })
    }
    
    switch (action) {
      case 'test':
        res.json({ 
          success: true, 
          message: 'Sync endpoint is working!',
          action: 'test',
          timestamp: new Date().toISOString()
        })
        break
        
      case 'sync':
        if (products && Array.isArray(products)) {
          const filepath = path.join(SYNC_DIR, 'products.json')
          fs.writeFileSync(filepath, JSON.stringify(products, null, 2))
          console.log(`✅ Synced ${products.length} products`)
          res.json({ 
            success: true, 
            message: `Synced ${products.length} products`,
            count: products.length
          })
        } else {
          res.status(400).json({ error: 'Products array is required for sync action' })
        }
        break
        
      case 'add':
        if (product) {
          const filepath = path.join(SYNC_DIR, 'products.json')
          let existingProducts = []
          try {
            existingProducts = JSON.parse(fs.readFileSync(filepath, 'utf8'))
          } catch (e) {
            existingProducts = []
          }
          
          existingProducts.push(product)
          fs.writeFileSync(filepath, JSON.stringify(existingProducts, null, 2))
          console.log(`✅ Added product: ${product.name}`)
          res.json({ 
            success: true, 
            message: 'Product added successfully',
            product: product
          })
        } else {
          res.status(400).json({ error: 'Product data is required for add action' })
        }
        break
        
      case 'get':
        const filepath = path.join(SYNC_DIR, 'products.json')
        try {
          const products = JSON.parse(fs.readFileSync(filepath, 'utf8'))
          res.json({ 
            success: true, 
            products: products,
            count: products.length
          })
        } catch (e) {
          res.json({ 
            success: true, 
            products: [],
            count: 0
          })
        }
        break
        
      default:
        res.status(400).json({ error: `Unknown action: ${action}` })
    }
    
  } catch (error) {
    console.error('❌ Sync error:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 ================================')
  console.log('🚀 Simple Sync Server READY!')
  console.log(`🌐 Server running on: http://0.0.0.0:${PORT}`)
  console.log(`📁 Sync data directory: ${SYNC_DIR}`)
  console.log('📊 Health check: http://localhost:3000/api/health')
  console.log('🔄 Sync endpoint: http://localhost:3000/api/sync/products')
  console.log('🎉 ================================')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully')
  process.exit(0)
})
