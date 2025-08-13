# Punjabi E-commerce Store

A modern e-commerce platform for Punjabi traditional products including Juttis, Phulkari, and more.

## 🚀 Deployment on Vercel

### Prerequisites
- MongoDB Atlas database
- Razorpay account for payments
- Email service (Gmail, SendGrid, etc.)

### Environment Variables Required
Add these to your Vercel project settings:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EMAIL_HOST=your_email_host
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

### Deployment Steps
1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy - Vercel will automatically build and deploy your app

### Important Notes
- This app uses Next.js 15 with App Router
- MongoDB connection is handled via serverless functions
- Socket.IO features are disabled in production (Vercel doesn't support WebSocket servers)
- All API routes are serverless functions

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
