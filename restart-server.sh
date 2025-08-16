#!/bin/bash

echo "🔄 Restarting Punjabi Heritage Sync Server"
echo "=========================================="

# Kill all PM2 processes
echo "1. Stopping all PM2 processes..."
pm2 kill

# Wait a moment
sleep 2

# Remove any lock files
echo "2. Cleaning up PM2 files..."
rm -rf ~/.pm2/pm2.pid 2>/dev/null
rm -rf ~/.pm2/rpc.sock 2>/dev/null
rm -rf ~/.pm2/pub.sock 2>/dev/null

# Start fresh
echo "3. Starting server fresh..."
pm2 start server.js --name punjabiecom --env production

# Save configuration
echo "4. Saving PM2 configuration..."
pm2 save

# Show status
echo "5. Server status:"
pm2 status

echo ""
echo "✅ Server restart complete!"
echo ""
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs with: pm2 logs punjabiecom"
echo "🧪 Test health: curl http://localhost:3001/api/health"
