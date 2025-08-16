const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Load environment variables manually if dotenv fails
let envVars = {};
try {
  require('dotenv').config();
} catch (error) {
  console.log('dotenv not available, using manual env loading');
  // Manual environment loading as fallback
  try {
    const envFile = require('fs').readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (e) {
    console.log('No .env file found, using defaults');
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting Punjabi Heritage Sync Server...');
console.log('📊 Port:', PORT);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Middleware
app.use(cors({
  origin: [
    'https://punjabijuttiandfulkari.com',
    'http://localhost:3000',
    'https://localhost:3000',
    process.env.ADMIN_PANEL_URL || '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Sync-Token']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Security middleware
const authenticateRequest = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.AWS_SYNC_SECRET || 'punjabi-heritage-sync-secret-2024';
  
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    console.log('❌ Unauthorized request:', authHeader);
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  next();
};

// MongoDB connection (optional - graceful fallback)
let mongoConnection = null;
const connectMongoDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const mongoose = require('mongoose');
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      mongoConnection = mongoose.connection;
      console.log('✅ MongoDB connected for sync operations');
    } else {
      console.log('⚠️ No MongoDB URI provided, using file-only storage');
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, using file-only sync:', error.message);
    mongoConnection = null;
  }
};

// File storage paths
const SYNC_DATA_DIR = path.join(__dirname, 'sync-data');
const PRODUCTS_FILE = path.join(SYNC_DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(SYNC_DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(SYNC_DATA_DIR, 'settings.json');
const SYNC_LOG_FILE = path.join(SYNC_DATA_DIR, 'sync-log.json');

// Initialize sync directory
const initializeSyncDirectory = async () => {
  try {
    await fs.mkdir(SYNC_DATA_DIR, { recursive: true });
    console.log('📁 Sync data directory created/verified');
    
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
        console.log(`✅ ${path.basename(file.path)} exists`);
      } catch {
        await fs.writeFile(file.path, JSON.stringify(file.default, null, 2));
        console.log(`📄 Created ${path.basename(file.path)}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to initialize sync directory:', error);
    process.exit(1);
  }
};

// Logging function with error handling
const logSync = async (action, data, status = 'success') => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      status,
      data: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : String(data).substring(0, 500),
      id: crypto.randomUUID()
    };
    
    let logs = [];
    try {
      const logData = await fs.readFile(SYNC_LOG_FILE, 'utf8');
      logs = JSON.parse(logData);
    } catch {
      logs = [];
    }
    
    logs.push(logEntry);
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }
    
    await fs.writeFile(SYNC_LOG_FILE, JSON.stringify(logs, null, 2));
    console.log(`📝 Logged: ${action} - ${status}`);
  } catch (error) {
    console.error('Failed to log sync operation:', error);
  }
};

// Safe file read/write functions
const safeReadFile = async (filePath, defaultValue = []) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const safeWriteFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error);
    return false;
  }
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Punjabi Heritage Sync Server',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'POST /api/sync/products',
      'GET /api/sync/products',
      'POST /api/sync/orders',
      'POST /api/sync/settings',
      'GET /api/sync/logs',
      'GET /api/sync/pull/:type'
    ]
  });
});

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoConnection ? 'connected' : 'file-only',
    uptime: process.uptime(),
    port: PORT,
    version: '1.0.0',
    syncDataDir: SYNC_DATA_DIR
  });
});

// Product sync endpoints
app.post('/api/sync/products', authenticateRequest, async (req, res) => {
  try {
    const { action, product, products } = req.body;
    console.log(`🔄 Product sync: ${action}`);
    
    let currentProducts = await safeReadFile(PRODUCTS_FILE, []);
    
    switch (action) {
      case 'add':
        const newProduct = {
          ...product,
          id: product.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        currentProducts.push(newProduct);
        await logSync('product_add', { id: newProduct.id, name: product.name });
        break;
        
      case 'update':
        const updateIndex = currentProducts.findIndex(p => p.id === product.id);
        if (updateIndex !== -1) {
          currentProducts[updateIndex] = {
            ...currentProducts[updateIndex],
            ...product,
            updatedAt: new Date().toISOString()
          };
          await logSync('product_update', { id: product.id, name: product.name });
        } else {
          return res.status(404).json({ error: 'Product not found' });
        }
        break;
        
      case 'delete':
        const beforeCount = currentProducts.length;
        currentProducts = currentProducts.filter(p => p.id !== product.id);
        if (currentProducts.length < beforeCount) {
          await logSync('product_delete', { id: product.id });
        } else {
          return res.status(404).json({ error: 'Product not found' });
        }
        break;
        
      case 'bulk_sync':
        if (Array.isArray(products)) {
          currentProducts = products.map(p => ({
            ...p,
            updatedAt: new Date().toISOString()
          }));
          await logSync('products_bulk_sync', { count: products.length });
        } else {
          return res.status(400).json({ error: 'Products array required for bulk sync' });
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    // Save to file
    const saved = await safeWriteFile(PRODUCTS_FILE, currentProducts);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save products' });
    }
    
    // Try MongoDB sync (optional)
    if (mongoConnection && action !== 'bulk_sync') {
      try {
        const mongoose = require('mongoose');
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
        console.log('✅ MongoDB sync completed');
      } catch (dbError) {
        console.warn('⚠️ MongoDB sync failed:', dbError.message);
      }
    }
    
    res.json({
      success: true,
      message: `Product ${action} completed`,
      totalProducts: currentProducts.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Product sync error:', error);
    await logSync(`product_${req.body.action || 'unknown'}`, error.message, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Get all products
app.get('/api/sync/products', authenticateRequest, async (req, res) => {
  try {
    const products = await safeReadFile(PRODUCTS_FILE, []);
    
    res.json({
      success: true,
      products,
      count: products.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Order sync endpoints
app.post('/api/sync/orders', authenticateRequest, async (req, res) => {
  try {
    const { action, order } = req.body;
    console.log(`🔄 Order sync: ${action}`);
    
    let currentOrders = await safeReadFile(ORDERS_FILE, []);
    
    switch (action) {
      case 'add':
        const newOrder = {
          ...order,
          id: order.id || crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        currentOrders.push(newOrder);
        await logSync('order_add', { id: newOrder.id });
        break;
        
      case 'update':
        const updateIndex = currentOrders.findIndex(o => o.id === order.id);
        if (updateIndex !== -1) {
          currentOrders[updateIndex] = {
            ...currentOrders[updateIndex],
            ...order,
            updatedAt: new Date().toISOString()
          };
          await logSync('order_update', { id: order.id });
        } else {
          return res.status(404).json({ error: 'Order not found' });
        }
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    const saved = await safeWriteFile(ORDERS_FILE, currentOrders);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save orders' });
    }
    
    res.json({
      success: true,
      message: `Order ${action} completed`,
      totalOrders: currentOrders.length
    });
    
  } catch (error) {
    console.error('❌ Order sync error:', error);
    await logSync(`order_${req.body.action || 'unknown'}`, error.message, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Settings sync
app.post('/api/sync/settings', authenticateRequest, async (req, res) => {
  try {
    const { settings } = req.body;
    console.log('🔄 Settings sync');
    
    const settingsData = {
      ...settings,
      lastUpdated: new Date().toISOString()
    };
    
    const saved = await safeWriteFile(SETTINGS_FILE, settingsData);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save settings' });
    }
    
    await logSync('settings_update', 'Settings updated');
    
    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Settings sync error:', error);
    await logSync('settings_update', error.message, 'error');
    res.status(500).json({ error: error.message });
  }
});

// Sync logs endpoint
app.get('/api/sync/logs', authenticateRequest, async (req, res) => {
  try {
    const logs = await safeReadFile(SYNC_LOG_FILE, []);
    const limit = parseInt(req.query.limit) || 100;
    const recentLogs = logs.slice(-limit).reverse();
    
    res.json({
      success: true,
      logs: recentLogs,
      total: logs.length
    });
  } catch (error) {
    console.error('❌ Get logs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for website to pull updates
app.get('/api/sync/pull/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const authToken = req.headers['x-sync-token'];
    const expectedToken = process.env.WEBSITE_SYNC_TOKEN || 'punjabi-heritage-website-sync-token-2024';
    
    if (authToken !== expectedToken) {
      return res.status(401).json({ error: 'Invalid sync token' });
    }
    
    let filePath, data;
    switch (type) {
      case 'products':
        data = await safeReadFile(PRODUCTS_FILE, []);
        break;
      case 'orders':
        data = await safeReadFile(ORDERS_FILE, []);
        break;
      case 'settings':
        data = await safeReadFile(SETTINGS_FILE, {});
        break;
      default:
        return res.status(400).json({ error: 'Invalid sync type' });
    }
    
    res.json({
      success: true,
      data,
      lastUpdated: new Date().toISOString(),
      type
    });
    
  } catch (error) {
    console.error('❌ Pull sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize and start server
const startServer = async () => {
  try {
    console.log('🔧 Initializing server...');
    await initializeSyncDirectory();
    await connectMongoDB();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🎉 ================================');
      console.log('🚀 Punjabi Heritage Sync Server READY!');
      console.log('🌐 Server running on: http://0.0.0.0:' + PORT);
      console.log('📁 Sync data directory: ' + SYNC_DATA_DIR);
      console.log('🔐 Authentication: Bearer token required');
      console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
      console.log('🎉 ================================');
      console.log('');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🛑 Received SIGINT, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;
