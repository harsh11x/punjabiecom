const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for products
let products = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: 3000,
    products: products.length
  });
});

// Sync products endpoint
app.post('/api/sync/products', (req, res) => {
  try {
    console.log('🔄 Sync request received:', req.body);
    
    const { action, product, productId } = req.body;
    
    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }
    
    switch (action) {
      case 'add':
        if (!product) {
          return res.status(400).json({ error: 'Product data is required for add action' });
        }
        products.push({
          ...product,
          syncedAt: new Date().toISOString()
        });
        console.log(`✅ Added product: ${product.name}`);
        res.json({ success: true, action: 'add', productId: product.id });
        break;
        
      case 'update':
        if (!product || !productId) {
          return res.status(400).json({ error: 'Product data and ID are required for update action' });
        }
        const updateIndex = products.findIndex(p => p.id === productId);
        if (updateIndex !== -1) {
          products[updateIndex] = {
            ...product,
            syncedAt: new Date().toISOString()
          };
          console.log(`✅ Updated product: ${product.name}`);
          res.json({ success: true, action: 'update', productId });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
        break;
        
      case 'delete':
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required for delete action' });
        }
        const deleteIndex = products.findIndex(p => p.id === productId);
        if (deleteIndex !== -1) {
          const deletedProduct = products.splice(deleteIndex, 1)[0];
          console.log(`✅ Deleted product: ${deletedProduct.name}`);
          res.json({ success: true, action: 'delete', productId });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
        break;
        
      case 'test':
        console.log('✅ Test sync successful');
        res.json({ success: true, action: 'test', message: 'Sync endpoint working' });
        break;
        
      default:
        res.status(400).json({ error: 'Invalid action. Use: add, update, delete, or test' });
    }
  } catch (error) {
    console.error('❌ Sync error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Pull products endpoint (for website to fetch)
app.get('/api/sync/pull/products', (req, res) => {
  try {
    console.log('📥 Pull request received');
    res.json({
      success: true,
      products: products,
      count: products.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Pull error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AWS Sync Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔄 Sync endpoint: http://localhost:${PORT}/api/sync/products`);
  console.log(`📥 Pull endpoint: http://localhost:${PORT}/api/sync/pull/products`);
});
