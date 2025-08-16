# AWS Sync Server Deployment Guide

This guide will help you set up a centralized AWS server that synchronizes data between your admin panel and website.

## Architecture Overview

```
Admin Panel → AWS EC2 Server → Website (Vercel)
     ↓              ↓              ↓
  Add/Edit/Delete → Store & Process → Auto-Update
```

## Prerequisites

1. **AWS EC2 Instance** (t2.micro or larger)
2. **SSH Key Pair** for EC2 access
3. **Security Group** allowing inbound traffic on port 3001
4. **Domain/IP** for your EC2 instance

## Step 1: Prepare Your AWS EC2 Instance

### Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch new instance:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (free tier) or t2.small
   - **Key Pair**: Create or use existing
   - **Security Group**: Create new with these rules:
     - SSH (22) from your IP
     - Custom TCP (3001) from anywhere (0.0.0.0/0)
     - HTTP (80) from anywhere (optional)
     - HTTPS (443) from anywhere (optional)

### Get Instance Details
```bash
# Note down your instance details:
AWS_SERVER_IP="your-ec2-public-ip"
AWS_KEY_PATH="path/to/your-key.pem"
```

## Step 2: Deploy the Sync Server

### Option A: Automated Deployment (Recommended)

```bash
# Set your AWS details
export AWS_SERVER_IP="your-ec2-public-ip"
export AWS_KEY_PATH="~/.ssh/your-aws-key.pem"
export AWS_USER="ubuntu"

# Run deployment script
./deploy-aws-server.sh
```

### Option B: Manual Deployment

1. **Connect to your EC2 instance:**
```bash
ssh -i ~/.ssh/your-aws-key.pem ubuntu@your-ec2-ip
```

2. **Install Node.js and dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

3. **Upload server files:**
```bash
# From your local machine
scp -i ~/.ssh/your-aws-key.pem aws-sync-server.js ubuntu@your-ec2-ip:~/
scp -i ~/.ssh/your-aws-key.pem package.json ubuntu@your-ec2-ip:~/
scp -i ~/.ssh/your-aws-key.pem .env.production ubuntu@your-ec2-ip:~/.env
```

4. **Start the server:**
```bash
# On EC2 instance
npm install
pm2 start aws-sync-server.js --name punjabi-sync-server
pm2 startup
pm2 save
```

## Step 3: Configure Environment Variables

### Update Local Environment (.env.local)
```env
# AWS Sync Configuration
AWS_SYNC_SERVER_URL=http://YOUR_EC2_IP:3001
NEXT_PUBLIC_AWS_SYNC_SERVER_URL=http://YOUR_EC2_IP:3001
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
SYNC_INTERVAL=30000
```

### Update Production Environment (.env.production)
```env
# Add these to your existing .env.production
AWS_SYNC_SERVER_URL=http://YOUR_EC2_IP:3001
AWS_SYNC_SECRET=punjabi-heritage-sync-secret-2024
WEBSITE_SYNC_TOKEN=punjabi-heritage-website-sync-token-2024
```

### Update Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `AWS_SYNC_SERVER_URL` = `http://YOUR_EC2_IP:3001`
   - `AWS_SYNC_SECRET` = `punjabi-heritage-sync-secret-2024`
   - `WEBSITE_SYNC_TOKEN` = `punjabi-heritage-website-sync-token-2024`
   - `SYNC_INTERVAL` = `30000`

## Step 4: Test the Setup

### 1. Health Check
```bash
curl http://YOUR_EC2_IP:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-08-16T09:47:07.749Z",
  "mongodb": "connected",
  "uptime": 123.45
}
```

### 2. Test Product Sync
```bash
curl -X POST http://YOUR_EC2_IP:3001/api/sync/products \
  -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add",
    "product": {
      "id": "test-123",
      "name": "Test Product",
      "price": 999
    }
  }'
```

### 3. Test from Admin Panel
1. Go to your admin panel
2. Navigate to the Sync Dashboard
3. Check server status (should show "Connected")
4. Try adding/editing a product
5. Check sync logs for activity

## Step 5: Integrate with Admin Panel

### Add Sync to Product Operations

Update your product management functions to include sync:

```typescript
// In your admin product functions
import { useAWSSync } from '@/hooks/useAWSSync';

const { syncProduct } = useAWSSync();

// When adding a product
const handleAddProduct = async (productData) => {
  // Save locally first
  const savedProduct = await saveProductLocally(productData);
  
  // Sync to AWS server
  await syncProduct('add', savedProduct);
};

// When updating a product
const handleUpdateProduct = async (productData) => {
  const updatedProduct = await updateProductLocally(productData);
  await syncProduct('update', updatedProduct);
};

// When deleting a product
const handleDeleteProduct = async (productId) => {
  await deleteProductLocally(productId);
  await syncProduct('delete', { id: productId });
};
```

## Step 6: Website Integration

### Add Sync Client to Website

Create an API route to pull updates:

```typescript
// app/api/sync/pull/route.ts
import { syncProductsFromAWS } from '@/lib/website-sync-client';

export async function GET() {
  try {
    const products = await syncProductsFromAWS();
    
    // Update your local storage/database
    await updateLocalProducts(products);
    
    return Response.json({ success: true, count: products.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Set up Automatic Sync (Optional)

Add to your website's startup:

```typescript
// In your main layout or app component
import { getWebsiteSyncClient } from '@/lib/website-sync-client';

useEffect(() => {
  const syncClient = getWebsiteSyncClient();
  if (syncClient) {
    // Start auto-sync for products every 30 seconds
    syncClient.startAutoSync('products', (products) => {
      // Update your product state/cache
      updateProductCache(products);
    });
  }
  
  return () => {
    syncClient?.stopAllAutoSync();
  };
}, []);
```

## Step 7: Monitoring and Maintenance

### Monitor Server Status
```bash
# SSH to your EC2 instance
ssh -i ~/.ssh/your-aws-key.pem ubuntu@YOUR_EC2_IP

# Check PM2 status
pm2 status

# View logs
pm2 logs punjabi-sync-server

# Monitor in real-time
pm2 monit
```

### Server Management Commands
```bash
# Restart server
pm2 restart punjabi-sync-server

# Stop server
pm2 stop punjabi-sync-server

# View detailed info
pm2 info punjabi-sync-server

# Update server code
pm2 stop punjabi-sync-server
# Upload new files
pm2 start punjabi-sync-server
```

### Backup Sync Data
```bash
# Create backup of sync data
tar -czf sync-backup-$(date +%Y%m%d).tar.gz aws-sync-data/

# Download backup to local machine
scp -i ~/.ssh/your-aws-key.pem ubuntu@YOUR_EC2_IP:~/sync-backup-*.tar.gz ./
```

## Step 8: Security Considerations

### 1. Use HTTPS (Recommended for Production)
- Set up SSL certificate using Let's Encrypt
- Use nginx as reverse proxy
- Update URLs to use HTTPS

### 2. Restrict Access
- Update security group to allow only your admin panel IP
- Use VPC for additional security
- Rotate sync secrets regularly

### 3. Database Security
- Use MongoDB Atlas with IP whitelisting
- Enable authentication
- Use encrypted connections

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check security group allows port 3001
   - Verify server is running: `pm2 status`
   - Check server logs: `pm2 logs punjabi-sync-server`

2. **Authentication Failed**
   - Verify AWS_SYNC_SECRET matches in all environments
   - Check Authorization header format

3. **MongoDB Connection Issues**
   - Verify MONGODB_URI in server environment
   - Check MongoDB Atlas IP whitelist
   - Test connection manually

4. **Sync Not Working**
   - Check admin panel sync configuration
   - Verify server health endpoint
   - Review sync logs in dashboard

### Debug Commands
```bash
# Test server connectivity
curl -v http://YOUR_EC2_IP:3001/api/health

# Check server logs
pm2 logs punjabi-sync-server --lines 100

# Test authentication
curl -H "Authorization: Bearer punjabi-heritage-sync-secret-2024" \
     http://YOUR_EC2_IP:3001/api/sync/logs
```

## Success Indicators

✅ **Server Health Check**: Returns status "healthy"  
✅ **Admin Panel**: Shows "Connected" in sync dashboard  
✅ **Product Sync**: Adding/editing products creates sync logs  
✅ **Website Updates**: Changes appear on live website  
✅ **Monitoring**: PM2 shows server running without errors  

## Next Steps

1. **Set up SSL/HTTPS** for production security
2. **Configure automated backups** for sync data
3. **Set up monitoring alerts** for server downtime
4. **Implement rate limiting** for API endpoints
5. **Add webhook notifications** for sync events

Your AWS sync server is now ready to keep your admin panel and website perfectly synchronized! 🚀
