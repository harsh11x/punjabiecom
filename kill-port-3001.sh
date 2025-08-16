#!/bin/bash

echo "🔧 KILLING EVERYTHING ON PORT 3001"
echo "=================================="

echo "1. 🔍 What's using port 3001:"
sudo lsof -i :3001

echo ""
echo "2. 🛑 Killing all processes on port 3001..."
sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null && echo "✅ Killed processes" || echo "No processes found"

echo ""
echo "3. 🛑 Stopping PM2..."
pm2 kill 2>/dev/null && echo "✅ PM2 stopped" || echo "PM2 not running"

echo ""
echo "4. 🛑 Stopping systemd service..."
sudo systemctl stop punjabi-heritage 2>/dev/null && echo "✅ Systemd service stopped" || echo "No systemd service"

echo ""
echo "5. 🛑 Removing Docker containers..."
docker stop punjabi-heritage 2>/dev/null && echo "✅ Docker container stopped" || echo "No container to stop"
docker rm punjabi-heritage 2>/dev/null && echo "✅ Docker container removed" || echo "No container to remove"

echo ""
echo "6. 🛑 Killing any remaining node processes..."
sudo pkill -f "node server.js" 2>/dev/null && echo "✅ Node processes killed" || echo "No node processes"
sudo pkill -f "server.js" 2>/dev/null && echo "✅ Server processes killed" || echo "No server processes"

echo ""
echo "7. ⏳ Waiting 5 seconds..."
sleep 5

echo ""
echo "8. 🧪 Final check - is port 3001 free?"
if sudo lsof -i :3001 > /dev/null 2>&1; then
    echo "❌ Port 3001 is STILL in use:"
    sudo lsof -i :3001
    echo ""
    echo "🔧 MANUAL ACTION REQUIRED:"
    echo "Copy the PID from above and run: sudo kill -9 <PID>"
else
    echo "✅ Port 3001 is NOW FREE!"
    echo ""
    echo "🚀 NOW RUN: ./deploy-docker-simple.sh"
fi
