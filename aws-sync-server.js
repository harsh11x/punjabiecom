const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.AWS_SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'https://punjabijuttiandfulkari.com',
    'http://localhost:3000',
    process.env.ADMIN_PANEL_URL
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security middleware
const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.AWS_SYNC_SECRET || 'punjabi-heritage-sync-secret-2024';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  next();
};

// MongoDB connection (optional - for database sync)
let mongoConnection = null;
const connectMongoDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      mongoConnection = mongoose.connection;
      console.log('✅ MongoDB connected for sync operations');
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, using file-only sync:', error.message);
  }
};

// File storage paths
const SYNC_DATA_DIR = path.join(__dirname, 'aws-sync-data');
const PRODUCTS_FILE = path.join(SYNC_DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(SYNC_DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(SYNC_DATA_DIR, 'settings.json');
const SYNC_LOG_FILE = path.join(SYNC_DATA_DIR, 'sync-log.json');

// Initialize sync directory
const initializeSyncDirectory = async () => {
  try {
    await fs.mkdir(SYNC_DATA_DIR, { recursive: true });
    
    // Initialize files if they don't exist
    const files = [
      { path: PRODUCTS_FILE, default: [] },
      { path: ORDERS_FILE, default: [] },
      { path: SETTINGS_FILE, default: {} },
      { path: SYNC_LOG_FILE, default: [] }
    ];
    
    for (const file of files) {
      try {
        await fs.access(file.path);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.default, null, 2));
        console.log(`📁 Created ${path.basename(file.path)}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize sync directory:', error);
  }
};

// Logging function
const logSync = async (action, data, status = 'success') => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      status,
      data: typeof data === 'object' ? JSON.stringify(data) : data,
      id: crypto.randomUUID()
    };
    
    const logs = JSON.parse(await fs.readFile(SYNC_LOG_FILE, 'utf8'));
    logs.push(logEntry);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    await fs.writeFile(SYNC_LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to log sync operation:', error);
  }
};

// Product sync endpoints
app.post('/api/sync/products', authenticateRequest, async (req, res) => {
  try {
    const { action, product, products } = req.body;
    
    let currentProducts = [];
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      currentProducts = JSON.parse(data);
    } catch {
      currentProducts = [];
    }
    
    switch (action) {
      case 'add':
        currentProducts.push({
          ...product,
          id: product.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        await logSync('product_add', product);
        break;
        
      case 'update':
        const updateIndex = currentProducts.findIndex(p => p.id === product.id);
        if (updateIndex !== -1) {
          currentProducts[updateIndex] = {
            ...currentProducts[updateIndex],
            ...product,
            updatedAt: new Date().toISOString()
          };
          await logSync('product_update', product);
        }
        break;
        
      case 'delete':
        currentProducts = currentProducts.filter(p => p.id !== product.id);
        await logSync('product_delete', { id: product.id });
        break;
        
      case 'bulk_sync':
        currentProducts = products.map(p => ({
          ...p,
          updatedAt: new Date().toISOString()
        }));
        await logSync('products_bulk_sync', { count: products.length });
        break;
    }
    
    // Save to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(currentProducts, null, 2));
    
    // Sync to MongoDB if available
    if (mongoConnection && action !== 'bulk_sync') {
      try {
        const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
        
        switch (action) {
          case 'add':
            await new Product(product).save();
            break;
          case 'update':
            await Product.findOneAndUpdate({ id: product.id }, product);
            break;
          case 'delete':
            await Product.findOneAndDelete({ id: product.id });
            break;
        }
      } catch (dbError) {
        console.warn('MongoDB sync failed:', dbError.message);
      }
    }
    
    res.json({
      success: true,
      message: `Product ${action} completed`,
      totalProducts: currentProducts.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    await logSync(`product_${req.body.action}`, req.body, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get('/api/sync/products', authenticateRequest, async (req, res) => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    
    res.json({
      success: true,
      products,
      count: products.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order sync endpoints
app.post('/api/sync/orders', authenticateRequest, async (req, res) => {
  try {
    const { action, order } = req.body;
    
    let currentOrders = [];
    try {
      const data = await fs.readFile(ORDERS_FILE, 'utf8');
      currentOrders = JSON.parse(data);
    } catch {
      currentOrders = [];
    }
    
    switch (action) {
      case 'add':
        currentOrders.push({
          ...order,
          id: order.id || crypto.randomUUID(),
          createdAt: new Date().toISOString()
        });
        break;
        
      case 'update':
        const updateIndex = currentOrders.findIndex(o => o.id === order.id);
        if (updateIndex !== -1) {
          currentOrders[updateIndex] = {
            ...currentOrders[updateIndex],
            ...order,
            updatedAt: new Date().toISOString()
          };
        }
        break;
    }
    
    await fs.writeFile(ORDERS_FILE, JSON.stringify(currentOrders, null, 2));
    await logSync(`order_${action}`, order);
    
    res.json({
      success: true,
      message: `Order ${action} completed`,
      totalOrders: currentOrders.length
    });
    
  } catch (error) {
    await logSync(`order_${req.body.action}`, req.body, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Settings sync
app.post('/api/sync/settings', authenticateRequest, async (req, res) => {
  try {
    const { settings } = req.body;
    
    await fs.writeFile(SETTINGS_FILE, JSON.stringify({
      ...settings,
      lastUpdated: new Date().toISOString()
    }, null, 2));
    
    await logSync('settings_update', settings);
    
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
    
  } catch (error) {
    await logSync('settings_update', req.body, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoConnection ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// Sync logs endpoint
app.get('/api/sync/logs', authenticateRequest, async (req, res) => {
  try {
    const data = await fs.readFile(SYNC_LOG_FILE, 'utf8');
    const logs = JSON.parse(data);
    
    const limit = parseInt(req.query.limit) || 100;
    const recentLogs = logs.slice(-limit).reverse();
    
    res.json({
      success: true,
      logs: recentLogs,
      total: logs.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for website to pull updates
app.get('/api/sync/pull/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const authToken = req.headers['x-sync-token'];
    
    if (authToken !== process.env.WEBSITE_SYNC_TOKEN) {
      return res.status(401).json({ error: 'Invalid sync token' });
    }
    
    let filePath;
    switch (type) {
      case 'products':
        filePath = PRODUCTS_FILE;
        break;
      case 'orders':
        filePath = ORDERS_FILE;
        break;
      case 'settings':
        filePath = SETTINGS_FILE;
        break;
      default:
        return res.status(400).json({ error: 'Invalid sync type' });
    }
    
    const data = await fs.readFile(filePath, 'utf8');
    const parsedData = JSON.parse(data);
    
    res.json({
      success: true,
      data: parsedData,
      lastUpdated: new Date().toISOString(),
      type
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize and start server
const startServer = async () => {
  await initializeSyncDirectory();
  await connectMongoDB();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AWS Sync Server running on port ${PORT}`);
    console.log(`📁 Sync data directory: ${SYNC_DATA_DIR}`);
    console.log(`🔐 Authentication required for all sync endpoints`);
    console.log(`🌐 CORS enabled for admin panel and website`);
  });
};

startServer().catch(console.error);

module.exports = app;
