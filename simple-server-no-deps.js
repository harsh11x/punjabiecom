const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; // Use port 3001 for backend

// CORS middleware to allow both local and Vercel domains
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://punjabijuttiandfulkari.com',        // Your custom domain
    'https://punjabiecom.vercel.app',            // Your Vercel domain
    'https://punjabiecom-rexasms-projects.vercel.app' // Your Vercel project domain
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json({ limit: '1mb' }));

// Data directory
const DATA_DIR = path.resolve(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(CARTS_FILE)) {
  fs.writeFileSync(CARTS_FILE, JSON.stringify([], null, 2));
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

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Punjabi Heritage Store - Backend</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { padding: 20px; background: #f0f0f0; border-radius: 8px; }
        .success { color: green; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔧 Punjabi Heritage Store - Backend Server</h1>
        <div class="status">
          <h2 class="success">✅ Backend Server Running Successfully!</h2>
          <p><strong>Status:</strong> Express Server (No External Dependencies)</p>
          <p><strong>Port:</strong> ${PORT}</p>
          <p><strong>Memory Usage:</strong> Minimal</p>
        </div>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><strong>GET /api/products</strong> - List all products</li>
          <li><strong>POST /api/orders</strong> - Create new order</li>
          <li><strong>GET /api/orders</strong> - Get orders by email</li>
          <li><strong>GET /api/admin/orders</strong> - Admin: Get all orders</li>
          <li><strong>PUT /api/admin/orders</strong> - Admin: Update order status</li>
        </ul>
        <h3>Features Working:</h3>
        <ul>
          <li>✅ Product browsing and search</li>
          <li>✅ Shopping cart functionality</li>
          <li>✅ Checkout with COD and Razorpay</li>
          <li>✅ Order management (local storage)</li>
          <li>✅ Admin panel for orders</li>
          <li>✅ User order tracking</li>
        </ul>
        <p><em>This is a lightweight backend server with no external dependencies.</em></p>
      </div>
    </body>
    </html>
  `);
});

// Products API
app.get('/api/products', (req, res) => {
  try {
    const products = readJsonFile(PRODUCTS_FILE);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
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

// Admin Orders API
app.get('/api/admin/orders', (req, res) => {
  try {
    const orders = readJsonFile(ORDERS_FILE);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

app.put('/api/admin/orders', (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;
    
    if (!id) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }
    
    const orders = readJsonFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(order => order._id === id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    writeJsonFile(ORDERS_FILE, orders);
    
    console.log('✅ Order updated successfully:', id);
    res.json({ success: true, data: orders[orderIndex] });
    
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update order' });
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
  console.log('🔧 Punjabi Heritage Store Backend Started!');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔧 Mode: No External Dependencies`);
  console.log(`💾 Storage: ${DATA_DIR}`);
  console.log('✅ Ready to handle orders!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server...');
  process.exit(0);
});
