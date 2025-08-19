# AWS Order Storage Setup Guide

This guide will help you set up AWS services for storing and managing orders in your Punjabi Heritage e-commerce store.

## 🚀 **Overview**

The new AWS order storage system provides:
- **Direct order storage** to AWS (bypassing local storage issues)
- **Real-time order management** in your admin panel
- **Order tracking and status updates** for customers
- **Automatic fallback** to local storage if AWS is unavailable

## 🔧 **Prerequisites**

1. **AWS Account** - Create one at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** - Install from [docs.aws.amazon.com/cli](https://docs.aws.amazon.com/cli)
3. **Node.js** - Version 18+ (already installed)

## 📋 **Step 1: Create AWS S3 Bucket**

### Via AWS Console:
1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. **Bucket name**: `punjabi-heritage-orders` (or your preferred name)
4. **Region**: Choose closest to your users (e.g., `us-east-1`)
5. **Block Public Access**: Keep all blocks enabled (orders should be private)
6. Click "Create bucket"

### Via AWS CLI:
```bash
aws s3 mb s3://punjabi-heritage-orders --region us-east-1
```

## 📊 **Step 2: Create DynamoDB Table**

### Via AWS Console:
1. Go to [DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Click "Create table"
3. **Table name**: `punjabi-heritage-orders`
4. **Partition key**: `_id` (String)
5. **Sort key**: Leave empty
6. **Capacity mode**: Choose "On-demand" (easier for development)
7. Click "Create table"

### Create Global Secondary Indexes:
After table creation, go to "Indexes" tab and create:

#### Index 1: Order Number Index
- **Index name**: `orderNumber-index`
- **Partition key**: `orderNumber` (String)

#### Index 2: Customer Email Index  
- **Index name**: `customerEmail-index`
- **Partition key**: `customerEmail` (String)

### Via AWS CLI:
```bash
# Create table
aws dynamodb create-table \
  --table-name punjabi-heritage-orders \
  --attribute-definitions AttributeName=_id,AttributeType=S \
  --key-schema AttributeName=_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Create GSI for order number
aws dynamodb update-table \
  --table-name punjabi-heritage-orders \
  --attribute-definitions AttributeName=orderNumber,AttributeType=S \
  --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"orderNumber-index\",\"KeySchema\":[{\"AttributeName\":\"orderNumber\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
  --region us-east-1

# Create GSI for customer email
aws dynamodb update-table \
  --table-name punjabi-heritage-orders \
  --attribute-definitions AttributeName=customerEmail,AttributeType=S \
  --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"customerEmail-index\",\"KeySchema\":[{\"AttributeName\":\"customerEmail\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]" \
  --region us-east-1
```

## 👤 **Step 3: Create IAM User**

### Via AWS Console:
1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. **Username**: `punjabi-heritage-orders-user`
4. **Access type**: Programmatic access
5. Click "Next: Permissions"

### Attach Policies:
Click "Attach existing policies directly" and add:
- `AmazonS3FullAccess` (or create custom policy for just your bucket)
- `AmazonDynamoDBFullAccess` (or create custom policy for just your table)

### Create Custom Policy (Recommended):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::punjabi-heritage-orders",
        "arn:aws:s3:::punjabi-heritage-orders/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/punjabi-heritage-orders",
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/punjabi-heritage-orders/index/*"
      ]
    }
  ]
}
```

6. Click "Next: Tags" → "Next: Review" → "Create user"
7. **Save the Access Key ID and Secret Access Key** - you'll need these!

## 🔑 **Step 4: Configure Environment Variables**

Add these to your `.env.local` file:

```bash
# AWS Configuration for Order Storage
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1
AWS_S3_BUCKET=punjabi-heritage-orders
AWS_DYNAMODB_TABLE=punjabi-heritage-orders
```

**Replace the values** with your actual AWS credentials and bucket/table names.

## 🧪 **Step 5: Test the Setup**

### Test Order Creation:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "items": [{"productId": "test", "name": "Test Product", "price": 100, "quantity": 1}],
    "shippingAddress": {"fullName": "Test User", "addressLine1": "Test Address", "city": "Test City", "state": "Test State", "pincode": "12345", "phone": "1234567890"},
    "subtotal": 100,
    "shippingCost": 0,
    "tax": 0
  }'
```

### Check AWS Storage:
1. **S3**: Go to your bucket and look for `orders/` folder
2. **DynamoDB**: Go to your table and check for the new order

## 🔍 **Step 6: Verify Admin Panel**

1. Go to `/admin/orders` in your browser
2. You should see orders loaded from AWS
3. Try updating an order status
4. Check that changes are reflected in AWS

## 🚨 **Troubleshooting**

### Common Issues:

#### 1. "Access Denied" Errors
- Check IAM user permissions
- Verify bucket/table names in environment variables
- Ensure region matches your resources

#### 2. "Table Not Found" Errors
- Verify DynamoDB table exists
- Check table name spelling
- Ensure region is correct

#### 3. "Bucket Not Found" Errors
- Verify S3 bucket exists
- Check bucket name spelling
- Ensure region is correct

#### 4. Orders Not Saving
- Check AWS credentials
- Verify environment variables are loaded
- Check browser console for errors

### Debug Commands:

#### Check AWS CLI Configuration:
```bash
aws configure list
aws sts get-caller-identity
```

#### Test S3 Access:
```bash
aws s3 ls s3://punjabi-heritage-orders
```

#### Test DynamoDB Access:
```bash
aws dynamodb scan --table-name punjabi-heritage-orders --region us-east-1
```

## 🔒 **Security Best Practices**

1. **Never commit AWS credentials** to version control
2. **Use IAM roles** instead of access keys in production
3. **Limit permissions** to only what's needed
4. **Rotate access keys** regularly
5. **Monitor AWS CloudTrail** for suspicious activity

## 💰 **Cost Optimization**

1. **S3**: Orders are small JSON files (~1-5KB each)
   - 1,000 orders = ~5MB = ~$0.0001/month
   
2. **DynamoDB**: On-demand pricing
   - Read/Write units only when accessed
   - Very cost-effective for small to medium usage

## 🚀 **Production Deployment**

1. **Use IAM Roles** instead of access keys
2. **Enable CloudWatch** monitoring
3. **Set up CloudTrail** for audit logging
4. **Configure S3 lifecycle policies** for old orders
5. **Set up DynamoDB backup** and point-in-time recovery

## 📞 **Support**

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify environment variables
3. Test with AWS CLI commands
4. Check browser console for errors
5. Review this guide's troubleshooting section

---

**🎉 Congratulations!** Your AWS order storage system is now set up and ready to handle orders reliably!
