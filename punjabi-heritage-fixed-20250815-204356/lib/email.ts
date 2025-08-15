import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  shippingAddress: string
  orderStatus: string
  trackingId?: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const itemsList = data.items
      .map(item => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`)
      .join('\n')

    const mailOptions = {
      from: `"Punjab Heritage" <${process.env.EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Punjab Heritage</h1>
            <p style="color: #fef3c7; margin: 5px 0;">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">Order Confirmed! 🎉</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Thank you for your order! We're excited to prepare your traditional Punjabi items.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #dc2626;">Order Details</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Status:</strong> ${data.orderStatus.charAt(0).toUpperCase() + data.orderStatus.slice(1)}</p>
              <p><strong>Total Amount:</strong> ₹${data.totalAmount.toLocaleString()}</p>
              ${data.trackingId ? `<p><strong>Tracking ID:</strong> ${data.trackingId}</p>` : ''}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #dc2626;">Items Ordered</h3>
              <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${itemsList}</pre>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #dc2626;">Shipping Address</h3>
              <p>${data.shippingAddress}</p>
            </div>
            
            <p>We'll send you updates as your order progresses. If you have any questions, please don't hesitate to contact us.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280;">Thank you for choosing Punjab Heritage!</p>
              <p style="color: #f59e0b; font-weight: bold;">ਪੰਜਾਬੀ ਵਿਰਾਸਤ ਨੂੰ ਚੁਣਨ ਲਈ ਧੰਨਵਾਦ!</p>
            </div>
          </div>
          
          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Punjab Heritage - Authentic Punjabi Crafts</p>
            <p style="margin: 5px 0; font-size: 14px; color: #d1d5db;">
              Email: support@punjabheritage.com | Phone: +91-XXXXXXXXXX
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent to:', data.customerEmail)
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

export async function sendOrderStatusUpdateEmail(data: OrderEmailData) {
  try {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is currently being processed.',
      shipped: 'Great news! Your order has been shipped.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.'
    }

    const message = statusMessages[data.orderStatus as keyof typeof statusMessages] || 'Your order status has been updated.'

    const mailOptions = {
      from: `"Punjab Heritage" <${process.env.EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Order Update - ${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Punjab Heritage</h1>
            <p style="color: #fef3c7; margin: 5px 0;">ਪੰਜਾਬ ਹੈਰਿਟੇਜ</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">Order Status Update</h2>
            
            <p>Dear ${data.customerName},</p>
            
            <p>${message}</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="margin-top: 0; color: #dc2626;">Order Details</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Status:</strong> ${data.orderStatus.charAt(0).toUpperCase() + data.orderStatus.slice(1)}</p>
              ${data.trackingId ? `<p><strong>Tracking ID:</strong> ${data.trackingId}</p>` : ''}
            </div>
            
            ${data.orderStatus === 'shipped' && data.trackingId ? `
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #10b981;">
                <h3 style="margin-top: 0; color: #059669;">📦 Tracking Information</h3>
                <p>Your order is on its way! Track your package using the tracking ID: <strong>${data.trackingId}</strong></p>
              </div>
            ` : ''}
            
            <p>Thank you for your patience and for choosing Punjab Heritage!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280;">Punjab Heritage - Authentic Punjabi Crafts</p>
              <p style="color: #f59e0b; font-weight: bold;">ਪੰਜਾਬੀ ਵਿਰਾਸਤ</p>
            </div>
          </div>
          
          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">Punjab Heritage</p>
            <p style="margin: 5px 0; font-size: 14px; color: #d1d5db;">
              Email: support@punjabheritage.com | Phone: +91-XXXXXXXXXX
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Order status update email sent to:', data.customerEmail)
  } catch (error) {
    console.error('Error sending order status update email:', error)
    throw error
  }
}