# Dockerfile for Punjabi Heritage Sync Server
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server-package.json package.json
COPY server.env .env

# Install dependencies
RUN npm install --production

# Copy server file
COPY server.js .

# Create sync data directory
RUN mkdir -p sync-data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start server
CMD ["node", "server.js"]
