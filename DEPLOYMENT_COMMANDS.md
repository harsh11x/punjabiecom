# Deployment Commands for Server: 3.111.208.77

## Step 1: Upload Files to Server

```bash
# Replace 'your-key.pem' with your actual SSH key filename
scp -i ~/.ssh/your-key.pem server.js ubuntu@3.111.208.77:~/
scp -i ~/.ssh/your-key.pem server-package.json ubuntu@3.111.208.77:~/package.json
scp -i ~/.ssh/your-key.pem ecosystem.config.js ubuntu@3.111.208.77:~/
scp -i ~/.ssh/your-key.pem .env.production ubuntu@3.111.208.77:~/.env
```

## Step 2: SSH to Server and Setup

```bash
# SSH to your server
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77

# Once connected, run these commands:

# Update system
sudo apt update

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install project dependencies
npm install

# Create logs directory
mkdir -p logs

# Start server with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions shown by the command above
```

## Step 3: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs punjabi-sync-server

# Test health endpoint
curl http://localhost:3001/api/health
```

## Step 4: Test from Outside

From your local machine:
```bash
curl http://3.111.208.77:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-08-16T09:59:47.446Z",
  "mongodb": "connected",
  "uptime": 123.45,
  "port": 3001
}
```

## Step 5: Update Vercel Environment Variables

Add these to your Vercel project settings:
- `AWS_SYNC_SERVER_URL` = `http://3.111.208.77:3001`
- `AWS_SYNC_SECRET` = `punjabi-heritage-sync-secret-2024`
- `WEBSITE_SYNC_TOKEN` = `punjabi-heritage-website-sync-token-2024`

## Troubleshooting

If the server doesn't respond:

1. **Check Security Group**: Make sure port 3001 is open
2. **Check PM2 status**: `pm2 status`
3. **Check logs**: `pm2 logs punjabi-sync-server`
4. **Restart server**: `pm2 restart punjabi-sync-server`

## Quick Test Commands

```bash
# Test health
curl http://3.111.208.77:3001/api/health

# Test with authentication
curl -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
     http://3.111.208.77:3001/api/sync/products
```

Your server IP **3.111.208.77** is now configured in all environment files! 🚀
