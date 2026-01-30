# BitsInBinary Backend - Authentication & Subscription System

A complete authentication and email subscription system built with Node.js, Express, MongoDB, and JWT.

## Features

### Authentication System
- ✅ User registration with password hashing (bcrypt)
- ✅ Unique username system with validation
- ✅ Username availability checking with debouncing
- ✅ User login with JWT tokens (email OR username)
- ✅ Protected routes with middleware
- ✅ Role-based authorization (user/admin)
- ✅ Password validation and security
- ✅ Welcome email on registration

### Email Subscription System
- ✅ Newsletter subscription with email validation
- ✅ Subscription confirmation emails
- ✅ Unsubscribe functionality
- ✅ Admin panel for managing subscriptions
- ✅ Duplicate email handling
- ✅ MongoDB storage

### Email Services
- ✅ Welcome emails for new users
- ✅ Subscription confirmation emails
- ✅ Powered by Nodemailer with Gmail SMTP

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john@example.com",
    "role": "user",
    "isEmailVerified": false
  }
}
```

#### POST `/api/auth/login`
Login user (accepts email or username)
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
OR
```json
{
  "email": "johndoe123",
  "password": "SecurePass123"
}
```

#### POST `/api/auth/check-username`
Check username availability
```json
{
  "username": "johndoe123"
}
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "message": "Username is available"
}
```

#### GET `/api/auth/me` (Protected)
Get current user info
**Headers:** `Authorization: Bearer <token>`

#### POST `/api/auth/logout` (Protected)
Logout user and clear cookies

### Subscription Routes (`/api`)

#### POST `/api/subscribe`
Subscribe to newsletter
```json
{
  "email": "subscriber@example.com",
  "source": "website",
  "tags": ["newsletter", "tech"]
}
```

#### POST `/api/unsubscribe`
Unsubscribe from newsletter
```json
{
  "email": "subscriber@example.com"
}
```

#### GET `/api/admin/subscriptions` (Protected - Admin only)
Get all subscriptions (with pagination)
**Query params:** `?page=1&limit=10&active=true`

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Gmail account for SMTP

### 1. Backend Setup

```bash
cd bitsinbinary-backend
npm install
```

### 2. Environment Configuration
Create `.env` file with:
```env
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 3. Start the Server
```bash
npm run dev
```

The server will run on `http://localhost:5001`

### 4. Frontend Integration
The frontend API service is already configured in `/src/services/api.ts` with:
- Authentication functions (register, login, logout, getCurrentUser)
- Username availability checking with debouncing
- Subscription function (subscribeEmail)
- Centralized error handling
- Token management
- Custom hooks for username validation
- Ready-to-use React components (RegistrationForm, LoginForm, UsernameInput)

## Database Models

### User Model
```javascript
{
  name: String (required),
  username: String (required, unique, 3-20 chars, alphanumeric + underscore),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin']),
  isEmailVerified: Boolean,
  timestamps: true
}
```

### Subscription Model
```javascript
{
  email: String (required, unique),
  isActive: Boolean,
  source: String (enum: ['website', 'blog', 'newsletter', 'other']),
  tags: [String],
  unsubscribeToken: String (unique),
  timestamps: true
}
```

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Secure authentication with expiry
- **Input Validation:** express-validator for all endpoints
- **Rate Limiting:** Ready for implementation
- **CORS:** Configured for frontend origin
- **Error Handling:** Centralized error middleware

## Email Templates

### Welcome Email
Sent to new users upon registration with:
- Welcome message
- Platform benefits
- Getting started information

### Subscription Confirmation
Sent to newsletter subscribers with:
- Confirmation message
- Content expectations
- Unsubscribe information

## Testing

### Test Subscription
```bash
curl -X POST http://localhost:5001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Username Availability
```bash
curl -X POST http://localhost:5001/api/auth/check-username \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser123"}'
```

### Test Registration
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "username": "testuser123", "email": "test@example.com", "password": "TestPass123"}'
```

### Test Login (with email)
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "TestPass123"}'
```

### Test Login (with username)
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser123", "password": "TestPass123"}'
```

## Frontend Integration Example

```typescript
import { register, login, subscribeEmail, checkUsernameAvailability } from '@/services/api';

// Check username availability
const handleUsernameCheck = async (username: string) => {
  const result = await checkUsernameAvailability(username);
  
  if (result.success) {
    console.log(`Username "${username}" is ${result.available ? 'available' : 'taken'}`);
  }
};

// Register user
const handleRegister = async () => {
  const result = await register({
    name: 'John Doe',
    username: 'johndoe123',
    email: 'john@example.com',
    password: 'SecurePass123'
  });
  
  if (result.success) {
    // User registered and token stored automatically
    console.log('Registration successful!');
  }
};

// Subscribe to newsletter
const handleSubscribe = async (email: string) => {
  const result = await subscribeEmail(email);
  
  if (result.success) {
    // Show success toast
    console.log('Subscribed successfully!');
  }
};
```

## Production Considerations

1. **Environment Variables:** Ensure all sensitive data is in environment variables
2. **Rate Limiting:** Implement rate limiting for API endpoints
3. **Email Templates:** Consider using a template engine for better email designs
4. **Monitoring:** Add logging and monitoring for production
5. **Database Indexing:** Add proper indexes for email fields
6. **SSL/HTTPS:** Use HTTPS in production
7. **Input Sanitization:** Additional input sanitization for security

## Directory Structure

```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── email.js         # Email service configuration
│   └── jwt.js           # JWT utilities
├── controllers/
│   ├── authController.js        # Authentication logic
│   └── subscriptionController.js # Subscription logic
├── middleware/
│   ├── auth.js          # Authentication middleware
│   ├── error.js         # Error handling middleware
│   └── validation.js    # Input validation rules
├── models/
│   ├── User.js          # User model
│   └── Subscription.js  # Subscription model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── subscription.js  # Subscription routes
└── index.js             # Main application file
```

## Status

✅ **Backend Implementation:** Complete
✅ **Database Integration:** Complete  
✅ **Authentication System:** Complete
✅ **Email Subscription:** Complete
✅ **Email Services:** Complete
✅ **Frontend API Service:** Complete
✅ **Testing:** Complete

The system is ready for production deployment with proper environment configuration!
