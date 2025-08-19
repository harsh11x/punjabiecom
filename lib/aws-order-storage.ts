import AWS from 'aws-sdk'

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
})

// Order interface
export interface AWSOrder {
  _id: string
  orderNumber: string
  customerEmail: string
  items: Array<{
    productId: string
    name: string
    punjabiName: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
  }>
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'razorpay' | 'cod' | 'bank_transfer'
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  billingAddress?: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    phone: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Create new order in AWS
export async function createOrder(orderData: Omit<AWSOrder, '_id' | 'createdAt' | 'updatedAt'>): Promise<AWSOrder> {
  try {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const timestamp = new Date().toISOString()
    
    const order: AWSOrder = {
      _id: orderId,
      ...orderData,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    // Save to S3 as JSON file
    const s3Key = `orders/${orderId}.json`
    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET || 'punjabi-heritage-orders',
      Key: s3Key,
      Body: JSON.stringify(order, null, 2),
      ContentType: 'application/json'
    }).promise()

    // Also save to DynamoDB for faster queries
    await dynamoDB.put({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      Item: order
    }).promise()

    console.log('✅ Order saved to AWS:', orderId)
    return order

  } catch (error) {
    console.error('❌ Failed to save order to AWS:', error)
    throw new Error('Failed to save order to AWS storage')
  }
}

// Get order by ID
export async function getOrder(orderId: string): Promise<AWSOrder | null> {
  try {
    // Try DynamoDB first (faster)
    const dynamoResult = await dynamoDB.get({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      Key: { _id: orderId }
    }).promise()

    if (dynamoResult.Item) {
      return dynamoResult.Item as AWSOrder
    }

    // Fallback to S3
    const s3Key = `orders/${orderId}.json`
    const s3Result = await s3.getObject({
      Bucket: process.env.AWS_S3_BUCKET || 'punjabi-heritage-orders',
      Key: s3Key
    }).promise()

    if (s3Result.Body) {
      return JSON.parse(s3Result.Body.toString())
    }

    return null

  } catch (error) {
    console.error('❌ Failed to get order from AWS:', error)
    return null
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<AWSOrder | null> {
  try {
    // Query DynamoDB by order number
    const result = await dynamoDB.query({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      IndexName: 'orderNumber-index',
      KeyConditionExpression: 'orderNumber = :orderNumber',
      ExpressionAttributeValues: {
        ':orderNumber': orderNumber
      }
    }).promise()

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as AWSOrder
    }

    return null

  } catch (error) {
    console.error('❌ Failed to get order by number from AWS:', error)
    return null
  }
}

// Get orders by customer email
export async function getOrdersByEmail(customerEmail: string): Promise<AWSOrder[]> {
  try {
    const result = await dynamoDB.query({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      IndexName: 'customerEmail-index',
      KeyConditionExpression: 'customerEmail = :customerEmail',
      ExpressionAttributeValues: {
        ':customerEmail': customerEmail
      }
    }).promise()

    return (result.Items || []) as AWSOrder[]

  } catch (error) {
    console.error('❌ Failed to get orders by email from AWS:', error)
    return []
  }
}

// Get all orders (for admin panel)
export async function getAllOrders(): Promise<AWSOrder[]> {
  try {
    const result = await dynamoDB.scan({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders'
    }).promise()

    return (result.Items || []) as AWSOrder[]

  } catch (error) {
    console.error('❌ Failed to get all orders from AWS:', error)
    return []
  }
}

// Update order status and tracking
export async function updateOrderStatus(
  orderId: string, 
  updates: Partial<Pick<AWSOrder, 'status' | 'paymentStatus' | 'trackingNumber' | 'estimatedDelivery' | 'notes'>>
): Promise<AWSOrder | null> {
  try {
    const order = await getOrder(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    const updatedOrder: AWSOrder = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    // Update in S3
    const s3Key = `orders/${orderId}.json`
    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET || 'punjabi-heritage-orders',
      Key: s3Key,
      Body: JSON.stringify(updatedOrder, null, 2),
      ContentType: 'application/json'
    }).promise()

    // Update in DynamoDB
    await dynamoDB.put({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      Item: updatedOrder
    }).promise()

    console.log('✅ Order updated in AWS:', orderId)
    return updatedOrder

  } catch (error) {
    console.error('❌ Failed to update order in AWS:', error)
    return null
  }
}

// Delete order (for admin use)
export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    // Delete from S3
    const s3Key = `orders/${orderId}.json`
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET || 'punjabi-heritage-orders',
      Key: s3Key
    }).promise()

    // Delete from DynamoDB
    await dynamoDB.delete({
      TableName: process.env.AWS_DYNAMODB_TABLE || 'punjabi-heritage-orders',
      Key: { _id: orderId }
    }).promise()

    console.log('✅ Order deleted from AWS:', orderId)
    return true

  } catch (error) {
    console.error('❌ Failed to delete order from AWS:', error)
    return false
  }
}
