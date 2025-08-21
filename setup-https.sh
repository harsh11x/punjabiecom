#!/bin/bash

echo "🔒 Setting up HTTPS for Punjabi Store Server..."

# Create SSL directory
mkdir -p ssl
cd ssl

# Check if OpenSSL is installed
if ! command -v openssl &> /dev/null; then
    echo "❌ OpenSSL not found. Installing..."
    sudo apt update
    sudo apt install -y openssl
fi

# Get server IP
SERVER_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

echo "🌐 Server IP: $SERVER_IP"

# Generate self-signed certificate
echo "🔐 Generating self-signed SSL certificate..."
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
    -subj "/C=IN/ST=Punjab/L=City/O=PunjabiStore/CN=$SERVER_IP" \
    -addext "subjectAltName=IP:$SERVER_IP,DNS:$SERVER_IP,DNS:localhost"

# Set permissions
chmod 600 key.pem
chmod 644 cert.pem

echo "✅ SSL certificates created successfully!"
echo "📁 Certificate: ssl/cert.pem"
echo "🔑 Private Key: ssl/key.pem"
echo ""
echo "🚀 Now restart your server:"
echo "   pm2 restart punjabiecom"
echo ""
echo "🌐 Your server will now support both HTTP and HTTPS:"
echo "   HTTP:  http://$SERVER_IP:3001"
echo "   HTTPS: https://$SERVER_IP:3443"
echo ""
echo "💡 Update your Vercel environment to use:"
echo "   BACKEND_URL=https://$SERVER_IP:3443"
