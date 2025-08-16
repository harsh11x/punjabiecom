#!/bin/bash

echo "🔧 PM2 Troubleshooting and Fix Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 System Information:${NC}"
echo "Node.js version: $(node --version 2>/dev/null || echo 'Not found')"
echo "NPM version: $(npm --version 2>/dev/null || echo 'Not found')"
echo "PM2 version: $(pm2 --version 2>/dev/null || echo 'Not found')"
echo "Current user: $(whoami)"
echo "System: $(uname -a)"
echo ""

echo -e "${YELLOW}🔍 Checking PM2 Status:${NC}"
pm2 status 2>/dev/null || echo -e "${RED}❌ PM2 not responding${NC}"
echo ""

echo -e "${YELLOW}📊 System Resources:${NC}"
echo "Memory usage:"
free -h 2>/dev/null || echo "Memory info not available"
echo ""
echo "Disk usage:"
df -h . 2>/dev/null || echo "Disk info not available"
echo ""

echo -e "${YELLOW}🔧 PM2 Diagnostics:${NC}"

# Check PM2 daemon
echo "Checking PM2 daemon..."
pm2 ping 2>/dev/null && echo -e "${GREEN}✅ PM2 daemon responding${NC}" || echo -e "${RED}❌ PM2 daemon not responding${NC}"

# Check PM2 logs directory
echo "Checking PM2 logs directory..."
ls -la ~/.pm2/logs/ 2>/dev/null | head -10 || echo -e "${RED}❌ PM2 logs directory not accessible${NC}"

# Check for PM2 processes
echo "Checking PM2 processes..."
ps aux | grep -i pm2 | grep -v grep || echo -e "${RED}❌ No PM2 processes found${NC}"

echo ""
echo -e "${YELLOW}🛠️ Attempting PM2 Fixes:${NC}"

# Fix 1: Kill all PM2 processes and restart
echo "1. Killing all PM2 processes..."
pm2 kill 2>/dev/null || echo "PM2 kill failed or not needed"

# Fix 2: Remove PM2 lock files
echo "2. Removing PM2 lock files..."
rm -rf ~/.pm2/pm2.pid 2>/dev/null || echo "No PM2 pid file to remove"
rm -rf ~/.pm2/rpc.sock 2>/dev/null || echo "No PM2 socket file to remove"
rm -rf ~/.pm2/pub.sock 2>/dev/null || echo "No PM2 pub socket to remove"

# Fix 3: Clear PM2 logs
echo "3. Clearing PM2 logs..."
rm -rf ~/.pm2/logs/* 2>/dev/null || echo "No PM2 logs to clear"

# Fix 4: Reinstall PM2 if needed
echo "4. Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found, installing..."
    sudo npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 is installed${NC}"
fi

# Fix 5: Start PM2 daemon
echo "5. Starting PM2 daemon..."
pm2 ping 2>/dev/null && echo -e "${GREEN}✅ PM2 daemon started${NC}" || echo -e "${RED}❌ Failed to start PM2 daemon${NC}"

echo ""
echo -e "${YELLOW}🚀 Starting Your Server:${NC}"

# Check if server files exist
if [ -f "server.js" ]; then
    echo "Found server.js, starting with PM2..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    # Start server
    pm2 start server.js --name punjabiecom --env production
    pm2 save
    
    echo -e "${GREEN}✅ Server started successfully${NC}"
    pm2 status
else
    echo -e "${RED}❌ server.js not found in current directory${NC}"
    echo "Please run this script from your project directory"
fi

echo ""
echo -e "${YELLOW}📋 PM2 Management Commands:${NC}"
echo "pm2 status           - Check status"
echo "pm2 logs punjabiecom - View logs"
echo "pm2 restart punjabiecom - Restart server"
echo "pm2 stop punjabiecom - Stop server"
echo "pm2 delete punjabiecom - Delete process"
echo "pm2 monit           - Real-time monitoring"
echo ""

echo -e "${YELLOW}🔍 Common PM2 Issues and Solutions:${NC}"
echo ""
echo -e "${YELLOW}Issue 1: PM2 daemon crashes${NC}"
echo "Solution: pm2 kill && pm2 start server.js --name punjabiecom"
echo ""
echo -e "${YELLOW}Issue 2: Out of memory${NC}"
echo "Solution: pm2 start server.js --name punjabiecom --max-memory-restart 1G"
echo ""
echo -e "${YELLOW}Issue 3: Permission issues${NC}"
echo "Solution: sudo chown -R \$USER:\$USER ~/.pm2"
echo ""
echo -e "${YELLOW}Issue 4: Port conflicts${NC}"
echo "Solution: Check with 'sudo lsof -i :3001' and kill conflicting processes"
echo ""

echo -e "${GREEN}🎉 PM2 troubleshooting complete!${NC}"
