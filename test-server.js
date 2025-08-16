// Simple test server to verify basic functionality
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting simple test server...');
console.log('📊 Port:', PORT);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Simple test server is working!',
    timestamp: new Date().toISOString(),
    port: PORT,
    nodeVersion: process.version
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    uptime: process.uptime(),
    message: 'Test server is running successfully'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ================================');
  console.log('✅ Simple Test Server READY!');
  console.log('🌐 Server running on: http://0.0.0.0:' + PORT);
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
