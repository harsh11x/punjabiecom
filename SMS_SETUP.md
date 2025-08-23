# 📱 SMS Setup Guide for Order Notifications

This guide explains how to set up SMS notifications for order confirmations using free SMS APIs.

## 🆓 Free SMS API Options

### 1. **Twilio** (Recommended for testing)
- **Free Trial**: $15-20 credit
- **Setup**: 
  1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
  2. Get Account SID and Auth Token
  3. Get a phone number for sending SMS
- **Pros**: Reliable, good documentation, global coverage
- **Cons**: Paid after trial

### 2. **Vonage** (Formerly Nexmo)
- **Free Trial**: $2 credit
- **Setup**: 
  1. Sign up at [vonage.com](https://www.vonage.com/communications-apis/sms/)
  2. Get API Key and Secret
  3. Configure sender ID
- **Pros**: Good pricing, global coverage
- **Cons**: Smaller free trial

### 3. **MSG91** (Popular in India)
- **Free Trial**: 100 SMS
- **Setup**: 
  1. Sign up at [msg91.com](https://msg91.com/)
  2. Get API Key
  3. Create a flow template for order confirmation
- **Pros**: India-focused, good pricing
- **Cons**: Limited global coverage

## ⚙️ Environment Variables

Add these to your `.env.local` file:

```bash
# Choose one provider
SMS_PROVIDER=twilio  # or 'vonage', 'msg91', 'test'

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
SMS_FROM_NUMBER=+1234567890

# Vonage
SMS_API_KEY=your_api_key
SMS_API_SECRET=your_api_secret
SMS_FROM_NUMBER=PUNJABI

# MSG91
SMS_API_KEY=your_api_key
```

## 🧪 Test Mode

By default, the system runs in test mode and logs SMS messages to the console. This is perfect for development and testing.

## 📱 SMS Message Format

Order confirmation messages include:
- Order number
- Order status
- Total amount
- Store branding
- Tracking information

Example: `🎉 Thank you for your order! Order #12345 has been confirmed. Total: ₹1299. Track your order at our website. - Punjabi Jutti Store`

## 🚀 Production Deployment

1. Choose your SMS provider
2. Configure environment variables in Vercel
3. Test with real orders
4. Monitor SMS delivery rates

## 💡 Tips

- **Phone Number Format**: Use international format (+91XXXXXXXXXX for India)
- **Message Length**: Keep under 160 characters for single SMS
- **Rate Limits**: Most providers have rate limits for free tiers
- **Fallback**: System gracefully handles SMS failures
