#!/bin/bash

echo "🔧 Fixing Port 3001 Conflict"
echo "============================"

echo "1. 🔍 Checking what's using port 3001..."
sudo lsof -i :3001 || echo "No processes found using port 3001"

echo ""
echo "2. 🔍 Checking for Node.js processes..."
ps aux | grep node | grep -v grep || echo "No Node.js processes found"

echo ""
echo "3. 🔍 Checking for PM2 processes..."
pm2 status 2>/dev/null || echo "PM2 not running or not installed"

echo ""
echo "4. 🛑 Killing processes on port 3001..."
sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null && echo "✅ Killed processes on port 3001" || echo "No processes to kill"

echo ""
echo "5. 🛑 Stopping any PM2 processes..."
pm2 kill 2>/dev/null && echo "✅ Stopped PM2 processes" || echo "No PM2 processes to stop"

echo ""
echo "6. 🛑 Stopping any systemd services..."
sudo systemctl stop punjabi-heritage 2>/dev/null && echo "✅ Stopped systemd service" || echo "No systemd service running"

echo ""
echo "7. 🛑 Stopping any existing Docker containers..."
docker stop punjabi-heritage 2>/dev/null && echo "✅ Stopped Docker container" || echo "No Docker container to stop"
docker rm punjabi-heritage 2>/dev/null && echo "✅ Removed Docker container" || echo "No Docker container to remove"

echo ""
echo "8. ⏳ Waiting for port to be free..."
sleep 3

echo ""
echo "9. 🧪 Testing if port 3001 is now free..."
if sudo lsof -i :3001 > /dev/null 2>&1; then
    echo "❌ Port 3001 is still in use:"
    sudo lsof -i :3001
    echo ""
    echo "🔧 Manual fix needed:"
    echo "Find the PID from above and run: sudo kill -9 <PID>"
else
    echo "✅ Port 3001 is now free!"
    echo ""
    echo "🚀 Ready to deploy Docker container!"
    echo "Run: ./deploy-docker-simple.sh"
fi

echo ""
echo "📋 Alternative ports if 3001 still doesn't work:"
echo "You can modify the Docker command to use a different port:"
echo "docker run -p 3002:3001 ... (use port 3002 instead)"
echo "docker run -p 3003:3001 ... (use port 3003 instead)"
