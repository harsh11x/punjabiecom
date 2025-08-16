# Alternative Deployment Methods (PM2 Issues)

Since PM2 is causing issues, here are 3 reliable alternatives:

## 🚀 **Option 1: Direct Node.js (Simplest)**

```bash
# SSH to your server
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77
cd punjabiecom

# Pull latest code
git pull origin main

# Run directly
./run-server-direct.sh
```

**Pros:** Simple, no dependencies  
**Cons:** Manual restart needed if server crashes

## 🔧 **Option 2: Systemd Service (Recommended)**

```bash
# SSH to your server
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77
cd punjabiecom

# Pull latest code
git pull origin main

# Create systemd service
./create-systemd-service.sh
```

**Pros:** Auto-restart, starts on boot, system integration  
**Cons:** Requires sudo access

## 🐳 **Option 3: Docker (Most Reliable)**

```bash
# SSH to your server
ssh -i ~/.ssh/your-key.pem ubuntu@3.111.208.77
cd punjabiecom

# Pull latest code
git pull origin main

# Deploy with Docker
./deploy-with-docker.sh
```

**Pros:** Isolated environment, very reliable, easy management  
**Cons:** Requires Docker installation

## 🔍 **Troubleshooting PM2 Issues**

### Common PM2 Problems:
1. **Memory leaks** - PM2 daemon consuming too much RAM
2. **File descriptor limits** - Too many open files
3. **Permission issues** - PM2 files owned by wrong user
4. **Node.js version conflicts** - Multiple Node versions
5. **System resource exhaustion** - Server out of memory/disk

### Quick PM2 Diagnosis:
```bash
# Check system resources
free -h
df -h

# Check PM2 processes
ps aux | grep pm2

# Check file limits
ulimit -n

# Check PM2 logs
ls -la ~/.pm2/logs/

# Nuclear PM2 reset
pm2 kill
sudo npm uninstall -g pm2
sudo npm install -g pm2
```

## 📊 **Recommended Approach**

1. **Try Option 2 (Systemd)** first - most reliable for production
2. **Fallback to Option 1 (Direct)** if systemd doesn't work
3. **Use Option 3 (Docker)** if you want maximum reliability

## 🧪 **Testing Your Deployment**

After using any method, test with:

```bash
# Health check
curl http://3.111.208.77:3001/api/health

# Should return:
# {"status":"healthy","timestamp":"...","mongodb":"file-only","uptime":...}
```

## 🔄 **Server Management**

### Systemd Commands:
```bash
sudo systemctl start punjabi-heritage
sudo systemctl stop punjabi-heritage
sudo systemctl restart punjabi-heritage
sudo systemctl status punjabi-heritage
sudo journalctl -u punjabi-heritage -f
```

### Docker Commands:
```bash
docker start punjabi-heritage
docker stop punjabi-heritage
docker restart punjabi-heritage
docker logs punjabi-heritage -f
```

### Direct Node Commands:
```bash
# Start
./run-server-direct.sh

# Stop
kill $(cat server.pid)

# View logs
tail -f server.log
```

## 🎯 **Choose Your Method**

- **For production stability**: Use **Systemd** (Option 2)
- **For quick testing**: Use **Direct** (Option 1)  
- **For maximum reliability**: Use **Docker** (Option 3)

All methods will work with your AWS sync system!
