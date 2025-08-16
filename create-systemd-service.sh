#!/bin/bash

echo "🔧 Creating Systemd Service for Punjabi Heritage Server"
echo "======================================================"

# Get current directory and user
CURRENT_DIR=$(pwd)
CURRENT_USER=$(whoami)

echo "Current directory: $CURRENT_DIR"
echo "Current user: $CURRENT_USER"

# Create systemd service file
sudo tee /etc/systemd/system/punjabi-heritage.service > /dev/null <<EOF
[Unit]
Description=Punjabi Heritage Sync Server
After=network.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$CURRENT_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

# Logging
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=punjabi-heritage

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Systemd service file created"

# Reload systemd
echo "🔄 Reloading systemd..."
sudo systemctl daemon-reload

# Enable service to start on boot
echo "🚀 Enabling service..."
sudo systemctl enable punjabi-heritage

# Start the service
echo "▶️ Starting service..."
sudo systemctl start punjabi-heritage

# Check status
echo "📊 Service status:"
sudo systemctl status punjabi-heritage --no-pager

echo ""
echo "📋 Service Management Commands:"
echo "Start:   sudo systemctl start punjabi-heritage"
echo "Stop:    sudo systemctl stop punjabi-heritage"
echo "Restart: sudo systemctl restart punjabi-heritage"
echo "Status:  sudo systemctl status punjabi-heritage"
echo "Logs:    sudo journalctl -u punjabi-heritage -f"
echo "Disable: sudo systemctl disable punjabi-heritage"

echo ""
echo "🧪 Testing server..."
sleep 3
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Server is running with systemd!"
else
    echo "❌ Server not responding, check logs:"
    echo "sudo journalctl -u punjabi-heritage --no-pager -n 20"
fi
