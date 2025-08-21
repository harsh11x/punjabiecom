const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Data directory
const DATA_DIR = path.resolve(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize orders file
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// Helper functions
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Express server is working!', timestamp: new Date().toISOString() });
});

// Orders API
app.post('/api/orders', (req, res) => {
  try {
    console.log('🔥 Creating new order...');
    const orderData = req.body;
    console.log('Order data received:', JSON.stringify(orderData, null, 2));
    
    // Validate required fields
    if (!orderData.customerEmail || !orderData.items || !orderData.shippingAddress) {
      console.error('❌ Missing required fields:', {
        customerEmail: !!orderData.customerEmail,
        items: !!orderData.items,
        shippingAddress: !!orderData.shippingAddress
      });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerEmail, items, shippingAddress'
      });
    }
    
    console.log('✅ Required fields validation passed');
    
    // Create order
    const newOrder = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: `PH${Date.now()}${Math.random().toString(36).substring(2, 4).toUpperCase()}`,
      customerEmail: orderData.customerEmail,
      items: orderData.items,
      subtotal: orderData.subtotal || 0,
      shippingCost: orderData.shippingCost || 0,
      tax: orderData.tax || 0,
      total: orderData.total || orderData.subtotal || 0,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      paymentMethod: orderData.paymentMethod || 'razorpay',
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save order
    const orders = readJsonFile(ORDERS_FILE);
    orders.push(newOrder);
    
    if (writeJsonFile(ORDERS_FILE, orders)) {
      console.log('✅ Order saved successfully:', newOrder._id);
      res.json({ success: true, data: newOrder });
    } else {
      throw new Error('Failed to write to file');
    }
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create order' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const { email } = req.query;
    const orders = readJsonFile(ORDERS_FILE);
    
    if (email) {
      const filteredOrders = orders.filter(order => 
        order.customerEmail.toLowerCase() === email.toLowerCase()
      );
      res.json({ success: true, data: filteredOrders });
    } else {
      res.json({ success: true, data: orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// Health check
app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    status: 'healthy',
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB'
    },
    uptime: Math.round(process.uptime()) + ' seconds',
    dataDir: DATA_DIR,
    ordersFile: ORDERS_FILE
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🧪 Test Express Server Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔧 Mode: Test Mode`);
  console.log(`💾 Storage: ${DATA_DIR}`);
  console.log('✅ Ready for testing!');
  console.log('');
  console.log('Test URLs:');
  console.log(`• Health: http://localhost:${PORT}/health`);
  console.log(`• Test: http://localhost:${PORT}/test`);
  console.log(`• Orders: http://localhost:${PORT}/api/orders`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server...');
  process.exit(0);
});
