# Simple Server Deployment

## Upload These 3 Files to Your Server:

1. `server.js` - Main server file
2. `server-package.json` - Rename to `package.json` on server  
3. `server.env` - Rename to `.env` on server

## Deployment Commands:

```bash
# 1. Upload files
scp -i ~/.ssh/your-key.pem server.js ubuntu@3.111.208.77:~/punjabiecom/
scp -i ~/.ssh/your-key.pem server-package.json ubuntu@3.111.208.77:~/punjabiecom/package.json
scp -i ~/.ssh/your-key.pem server.env ubuntu@3.111.208.77:~/punjabiecom/.env

# 2. SSH to server
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77
cd punjabiecom

# 3. Install dependencies
npm install

# 4. Test server manually (optional)
node server.js
# Should show: "🚀 Punjabi Heritage Sync Server READY!"
# Press Ctrl+C to stop

# 5. Start with PM2
pm2 stop punjabiecom 2>/dev/null || true
pm2 delete punjabiecom 2>/dev/null || true
pm2 start server.js --name punjabiecom
pm2 save

# 6. Check status
pm2 status
pm2 logs punjabiecom
```

## Test Server:

```bash
# Health check
curl http://3.111.208.77:3001/api/health

# Should return:
# {"status":"healthy","timestamp":"...","mongodb":"file-only","uptime":...}
```

## Key Features:

✅ **Self-contained** - Works without external dependencies  
✅ **Error handling** - Graceful fallbacks for all operations  
✅ **File storage** - No database required  
✅ **MongoDB optional** - Works with or without database  
✅ **Detailed logging** - Easy to debug issues  
✅ **CORS enabled** - Works with your admin panel  
✅ **Authentication** - Secure API endpoints  

## PM2 Commands:

```bash
pm2 status           # Check status
pm2 logs punjabiecom # View logs
pm2 restart punjabiecom # Restart server
pm2 stop punjabiecom # Stop server
pm2 monit           # Real-time monitoring
```

That's it! The server should work immediately after these steps. 🚀
