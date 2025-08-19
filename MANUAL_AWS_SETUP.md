# 🚀 Manual AWS Setup Guide

Since you're running on AWS Lightsail with limited permissions, here's how to manually set up AWS services for your order storage.

## 🔍 **Current Issue**

Your Lightsail instance role doesn't have permission to create AWS resources. This is normal for security reasons.

## ✅ **Solution Options**

### Option 1: Manual AWS Console Setup (Recommended)

#### Step 1: Create S3 Bucket
1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. **Bucket name**: `punjabi-heritage-orders-834076182529` (using your account ID)
4. **Region**: `us-east-1` (or your preferred region)
5. Keep default settings (private bucket)
6. Click "Create bucket"

#### Step 2: Create DynamoDB Table
1. Go to [DynamoDB Console](https://console.aws.amazon.com/dynamodb/)
2. Click "Create table"
3. **Table name**: `punjabi-heritage-orders`
4. **Partition key**: `_id` (String)
5. **Capacity**: On-demand
6. Click "Create table"

After table creation, add these Global Secondary Indexes:
- **Index 1**: `orderNumber-index` with partition key `orderNumber` (String)
- **Index 2**: `customerEmail-index` with partition key `customerEmail` (String)

#### Step 3: Create IAM User
1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. **Username**: `punjabi-heritage-orders-user`
4. Click "Next"
5. Click "Attach policies directly"
6. Click "Create policy" and use this JSON:

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
        "arn:aws:s3:::punjabi-heritage-orders-834076182529",
        "arn:aws:s3:::punjabi-heritage-orders-834076182529/*"
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
        "arn:aws:dynamodb:us-east-1:834076182529:table/punjabi-heritage-orders",
        "arn:aws:dynamodb:us-east-1:834076182529:table/punjabi-heritage-orders/index/*"
      ]
    }
  ]
}
```

7. Save policy as `PunjabiHeritageOrdersPolicy`
8. Attach this policy to the user
9. Create access key for the user
10. **Save the Access Key ID and Secret Access Key**

#### Step 4: Configure Environment Variables
Add these to your `.env.local` file:

```bash
# AWS Configuration for Order Storage
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1
AWS_S3_BUCKET=punjabi-heritage-orders-834076182529
AWS_DYNAMODB_TABLE=punjabi-heritage-orders
```

### Option 2: Use Local Storage (Quick Start)

Your application is designed to work without AWS! It will automatically:
- Save orders to local files (`data/orders.json`)
- Save carts to local storage + file backup
- Work perfectly for development and small deployments

To use local storage only:
1. Run `./LIMITED_AWS_SETUP.sh`
2. Start using the application immediately
3. Orders will be saved to `data/orders.json`

### Option 3: AWS CLI with Different Credentials

If you have personal AWS credentials (not the Lightsail role):

```bash
# Configure AWS CLI with your personal credentials
aws configure --profile personal
# Enter your personal Access Key ID, Secret, and region

# Set the profile for this session
export AWS_PROFILE=personal

# Run the complete setup
./COMPLETE_AWS_SETUP.sh
```

## 🚀 **Quick Commands**

### For Local Storage (No AWS):
```bash
./LIMITED_AWS_SETUP.sh
```

### For AWS Setup (After manual creation):
```bash
# Add your AWS credentials to .env.local first
./QUICK_START.sh
```

### Test Order Creation:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "items": [{"productId": "test", "name": "Test Product", "punjabiName": "Test Product", "price": 100, "quantity": 1, "size": "Standard", "color": "Default", "image": ""}],
    "shippingAddress": {"fullName": "Test User", "addressLine1": "Test Address", "city": "Test City", "state": "Test State", "pincode": "12345", "phone": "1234567890"},
    "subtotal": 100,
    "shippingCost": 0,
    "tax": 0,
    "total": 100
  }'
```

## 🔍 **Verification**

After setup, verify everything works:

1. **Check Local Storage**: Look for `data/orders.json` file
2. **Check AWS Storage**: Look in S3 bucket and DynamoDB table
3. **Test Admin Panel**: Go to `/admin/orders` and try to view orders
4. **Test User Orders**: Go to `/orders` and check order tracking

## 💡 **Recommendations**

1. **For Development**: Use local storage (Option 2)
2. **For Production**: Use manual AWS setup (Option 1)
3. **For Testing**: Both work great!

## 📞 **Troubleshooting**

### Local Storage Issues:
- Check `data/` directory permissions
- Ensure disk space is available
- Look for `data/orders.json` file

### AWS Issues:
- Verify credentials in `.env.local`
- Check S3 bucket permissions
- Verify DynamoDB table exists
- Test with AWS CLI: `aws s3 ls` and `aws dynamodb list-tables`

---

**🎉 Your store will work perfectly with either option!**
