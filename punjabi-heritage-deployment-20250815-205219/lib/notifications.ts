// Notification service for customer updates
// This is a placeholder implementation - you'll need to integrate with actual SMS/Email services

export interface NotificationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  orderNumber: string
  orderStatus: string
  trackingId?: string
  shippingProvider?: string
  estimatedDelivery?: string
}

export class NotificationService {
  // Send SMS notification
  static async sendSMS(data: NotificationData): Promise<boolean> {
    try {
      // Here you would integrate with SMS service like Twilio, MSG91, etc.
      console.log('SMS Notification:', {
        to: data.customerPhone,
        message: this.generateSMSMessage(data)
      })
      
      // Placeholder for actual SMS integration
      // const response = await fetch('https://your-sms-service.com/api/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: data.customerPhone,
      //     message: this.generateSMSMessage(data)
      //   })
      // })
      
      return true
    } catch (error) {
      console.error('SMS notification failed:', error)
      return false
    }
  }

  // Send email notification
  static async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      // Here you would integrate with email service like SendGrid, AWS SES, etc.
      console.log('Email Notification:', {
        to: data.customerEmail,
        subject: this.generateEmailSubject(data),
        body: this.generateEmailBody(data)
      })
      
      // Placeholder for actual email integration
      // const response = await fetch('https://your-email-service.com/api/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: data.customerEmail,
      //     subject: this.generateEmailSubject(data),
      //     html: this.generateEmailBody(data)
      //   })
      // })
      
      return true
    } catch (error) {
      console.error('Email notification failed:', error)
      return false
    }
  }

  // Generate SMS message
  private static generateSMSMessage(data: NotificationData): string {
    const statusMessages = {
      'confirmed': `Your order ${data.orderNumber} has been confirmed and is being processed.`,
      'processing': `Your order ${data.orderNumber} is being prepared for shipping.`,
      'shipped': `Your order ${data.orderNumber} has been shipped${data.trackingId ? ` with tracking ID: ${data.trackingId}` : ''}.`,
      'delivered': `Your order ${data.orderNumber} has been delivered. Thank you for shopping with us!`,
      'cancelled': `Your order ${data.orderNumber} has been cancelled. Please contact us for any queries.`
    }

    return statusMessages[data.orderStatus as keyof typeof statusMessages] || 
           `Your order ${data.orderNumber} status has been updated to ${data.orderStatus}.`
  }

  // Generate email subject
  private static generateEmailSubject(data: NotificationData): string {
    const statusSubjects = {
      'confirmed': `Order Confirmed - ${data.orderNumber}`,
      'processing': `Order Processing - ${data.orderNumber}`,
      'shipped': `Order Shipped - ${data.orderNumber}`,
      'delivered': `Order Delivered - ${data.orderNumber}`,
      'cancelled': `Order Cancelled - ${data.orderNumber}`
    }

    return statusSubjects[data.orderStatus as keyof typeof statusSubjects] || 
           `Order Update - ${data.orderNumber}`
  }

  // Generate email body
  private static generateEmailBody(data: NotificationData): string {
    const statusDetails = {
      'confirmed': 'Your order has been confirmed and is being processed.',
      'processing': 'Your order is being prepared for shipping.',
      'shipped': 'Your order has been shipped and is on its way to you.',
      'delivered': 'Your order has been delivered successfully.',
      'cancelled': 'Your order has been cancelled.'
    }

    const trackingInfo = data.trackingId ? `
      <p><strong>Tracking ID:</strong> ${data.trackingId}</p>
      ${data.shippingProvider ? `<p><strong>Shipping Provider:</strong> ${data.shippingProvider}</p>` : ''}
      ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
    ` : ''

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Punjab Heritage Store</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Order Update Notification</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${data.customerName},</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            ${statusDetails[data.orderStatus as keyof typeof statusDetails] || 'Your order status has been updated.'}
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${data.orderStatus.charAt(0).toUpperCase() + data.orderStatus.slice(1)}</p>
            ${trackingInfo}
          </div>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="/orders" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order Details
            </a>
          </div>
        </div>
        
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            Thank you for choosing Punjab Heritage Store
          </p>
        </div>
      </div>
    `
  }

  // Send both SMS and email notifications
  static async sendNotifications(data: NotificationData): Promise<{ sms: boolean; email: boolean }> {
    const [smsResult, emailResult] = await Promise.allSettled([
      this.sendSMS(data),
      this.sendEmail(data)
    ])

    return {
      sms: smsResult.status === 'fulfilled' ? smsResult.value : false,
      email: emailResult.status === 'fulfilled' ? emailResult.value : false
    }
  }

  // Send tracking update notification
  static async sendTrackingUpdate(data: NotificationData): Promise<{ sms: boolean; email: boolean }> {
    if (!data.trackingId) {
      console.warn('No tracking ID provided for tracking update notification')
      return { sms: false, email: false }
    }

    const trackingData = {
      ...data,
      orderStatus: 'shipped' // Override for tracking updates
    }

    return this.sendNotifications(trackingData)
  }
}
