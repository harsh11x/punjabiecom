# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "punjabi-heritage")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these providers:
   - **Email/Password**: Enable and allow users to sign up
   - **Google**: Enable and configure OAuth consent screen

## 3. Get Firebase Config

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "Punjabi Heritage Web")
6. Copy the Firebase config object

## 4. Environment Variables

Create a `.env.local` file in your project root and add your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# JWT Secret (for admin panel)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Razorpay Keys (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## 5. Google OAuth Setup (Optional)

If you want Google sign-in:

1. In Firebase Authentication > Sign-in method > Google
2. Click "Configure"
3. Add your authorized domain (localhost for development, your domain for production)
4. Copy the Client ID and Client Secret

## 6. Install Dependencies

```bash
pnpm install
```

## 7. Test the Setup

1. Start the development server:
   ```bash
   pnpm run dev
   ```

2. Visit `http://localhost:3000/login` to test Firebase authentication

## Features Included

✅ **Email/Password Authentication**
- User registration and login
- Password validation
- Error handling

✅ **Google Sign-In**
- One-click Google authentication
- Automatic account creation

✅ **User Management**
- Profile updates
- Session management
- Secure logout

✅ **Admin Panel Access**
- Special admin user creation
- Admin-only routes protection

## Admin Panel Access

After setting up Firebase, create an admin user:

```bash
pnpm run create-admin
```

Then access the admin panel at:
- Local: `http://localhost:3000/admin`
- Production: `https://your-domain.vercel.app/admin`

Admin credentials:
- Email: `admin@punjabiecom.com`
- Password: `admin123`

## Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firebase Rules**: Configure Firebase Security Rules for production
3. **Domain Restrictions**: Add your production domain to Firebase authorized domains
4. **Admin Access**: Change default admin credentials after first login

## Troubleshooting

- **"Firebase not initialized"**: Check your environment variables
- **"Google sign-in not working"**: Verify OAuth configuration
- **"Admin access denied"**: Run `pnpm run create-admin` to create admin user
