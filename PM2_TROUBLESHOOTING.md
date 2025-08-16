# PM2 Troubleshooting Guide

## Check PM2 Status and Logs

Run these commands on your AWS server to diagnose the issue:

```bash
# Check PM2 status
pm2 status

# View detailed logs
pm2 logs punjabi-sync-server

# View only error logs
pm2 logs punjabi-sync-server --err

# View last 50 lines of logs
pm2 logs punjabi-sync-server --lines 50

# Get detailed process info
pm2 info punjabi-sync-server
```

## Common Issues and Solutions

### 1. Module Not Found Errors

If you see "Cannot find module" errors:

```bash
# Make sure you're in the right directory
cd ~/
ls -la

# Install dependencies
npm install

# If package.json is missing, create it
cat > package.json << 'EOF'
{
  "name": "punjabi-heritage-sync-server",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1"
  }
}
EOF

npm install
```

### 2. Port Already in Use

If port 3001 is already in use:

```bash
# Check what's using port 3001
sudo lsof -i :3001

# Kill the process using the port
sudo kill -9 PID_NUMBER

# Or change port in ecosystem.config.js
nano ecosystem.config.js
# Change PORT to 3002 or another available port
```

### 3. Permission Issues

```bash
# Fix file permissions
chmod +x server.js
chmod 644 package.json ecosystem.config.js .env

# If you get permission errors with PM2
sudo chown -R $USER:$USER ~/.pm2
```

### 4. Environment Variables Missing

```bash
# Check if .env file exists and has content
cat .env

# If missing, create it
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
EOF
```

### 5. Node.js Version Issues

```bash
# Check Node.js version
node --version

# Should be v18 or higher. If not, reinstall:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step-by-Step Restart Process

```bash
# 1. Stop all PM2 processes
pm2 stop all

# 2. Delete the problematic process
pm2 delete punjabi-sync-server

# 3. Make sure all files are in place
ls -la server.js package.json ecosystem.config.js .env

# 4. Install dependencies fresh
rm -rf node_modules package-lock.json
npm install

# 5. Test server manually first
node server.js
# Press Ctrl+C to stop after confirming it works

# 6. Start with PM2
pm2 start ecosystem.config.js

# 7. Save configuration
pm2 save
```

## Alternative: Start Without Ecosystem File

If ecosystem.config.js is causing issues:

```bash
# Start directly with PM2
pm2 start server.js --name punjabi-sync-server --env production

# Or with specific environment variables
pm2 start server.js --name punjabi-sync-server --env production -- --port 3001
```

## Check Server Connectivity

```bash
# Test if server starts manually
node server.js

# In another terminal, test the endpoint
curl http://localhost:3001/api/health

# Test from outside (replace with your server IP)
curl http://3.111.208.77:3001/api/health
```

## Security Group Check

Make sure your AWS Security Group allows:
- Inbound rule: Custom TCP, Port 3001, Source: 0.0.0.0/0

## Complete Reset (Last Resort)

```bash
# Stop and delete all PM2 processes
pm2 stop all
pm2 delete all

# Remove PM2
npm uninstall -g pm2
sudo npm install -g pm2

# Re-upload files and start fresh
# (Upload server.js, package.json, ecosystem.config.js, .env again)

npm install
pm2 start ecosystem.config.js
pm2 save
```
