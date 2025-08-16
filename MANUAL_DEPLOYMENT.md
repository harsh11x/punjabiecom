# Manual PM2 Deployment Guide

Simple guide to deploy your sync server manually using PM2.

## Files to Upload to Your AWS Server

1. `server.js` - Main server file
2. `server-package.json` - Rename to `package.json` on server
3. `ecosystem.config.js` - PM2 configuration
4. `.env.production` - Environment variables (rename to `.env` on server)

## Step-by-Step Deployment

### 1. Prepare Your AWS EC2 Instance

```bash
# SSH to your server
ssh -i your-key.pem ubuntu@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create project directory
mkdir punjabi-sync-server
cd punjabi-sync-server
```

### 2. Upload Files

From your local machine, upload the files:

```bash
# Upload server files
scp -i your-key.pem server.js ubuntu@your-server-ip:~/punjabi-sync-server/
scp -i your-key.pem server-package.json ubuntu@your-server-ip:~/punjabi-sync-server/package.json
scp -i your-key.pem ecosystem.config.js ubuntu@your-server-ip:~/punjabi-sync-server/
scp -i your-key.pem .env.production ubuntu@your-server-ip:~/punjabi-sync-server/.env
```

### 3. Install Dependencies and Start

```bash
# SSH back to your server
ssh -i your-key.pem ubuntu@your-server-ip
cd punjabi-sync-server

# Install dependencies
npm install

# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions shown by the command above
```

### 4. Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs punjabi-sync-server

# Test health endpoint
curl http://localhost:3001/api/health
```

## Environment Variables

Make sure your `.env` file on the server contains:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=your_mongodb_connection_string
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
```

## PM2 Commands

```bash
# Start server
pm2 start punjabi-sync-server

# Stop server
pm2 stop punjabi-sync-server

# Restart server
pm2 restart punjabi-sync-server

# View logs
pm2 logs punjabi-sync-server

# Monitor in real-time
pm2 monit

# Delete process
pm2 delete punjabi-sync-server
```

## Security Group Settings

Make sure your AWS Security Group allows:
- Port 22 (SSH) from your IP
- Port 3001 (HTTP) from anywhere (0.0.0.0/0)

## Testing

After deployment, test these endpoints:

```bash
# Health check
curl http://your-server-ip:3001/api/health

# Test with authentication
curl -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
     http://your-server-ip:3001/api/sync/products
```

## Update Your Local Environment

Update your `.env.local` file:

```env
AWS_SYNC_SERVER_URL=http://your-server-ip:3001
NEXT_PUBLIC_AWS_SYNC_SERVER_URL=http://your-server-ip:3001
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
```

## Update Vercel Environment Variables

Add these to your Vercel project settings:
- `AWS_SYNC_SERVER_URL` = `http://your-server-ip:3001`
- `AWS_SYNC_SECRET` = `punjabi-heritage-sync-secret-2024`
- `WEBSITE_SYNC_TOKEN` = `punjabi-heritage-website-sync-token-2024`

That's it! Your sync server should now be running and ready to sync data between your admin panel and website. 🚀
