#!/bin/bash

echo "🚀 Running Server Directly (No PM2)"
echo "=================================="

# Kill any existing processes on port 3001
echo "1. Killing any processes on port 3001..."
sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null || echo "No processes to kill"

# Install dependencies
echo "2. Installing dependencies..."
npm install

# Start server directly with nohup (background process)
echo "3. Starting server in background..."
nohup node server.js > server.log 2>&1 &

# Get the process ID
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Save PID to file for later management
echo $SERVER_PID > server.pid

# Wait a moment for server to start
sleep 3

# Test if server is running
echo "4. Testing server..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Server is running successfully!"
    echo "🌐 Health check: http://localhost:3001/api/health"
    echo "📊 Server PID: $SERVER_PID"
    echo "📋 View logs: tail -f server.log"
    echo "🛑 Stop server: kill $SERVER_PID"
else
    echo "❌ Server failed to start"
    echo "📋 Check logs: cat server.log"
fi

echo ""
echo "📋 Server Management Commands:"
echo "View logs: tail -f server.log"
echo "Stop server: kill \$(cat server.pid)"
echo "Restart: ./run-server-direct.sh"
echo "Check status: curl http://localhost:3001/api/health"
