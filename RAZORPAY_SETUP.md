# Razorpay Payment Integration Setup

## Overview
Razorpay has been fully integrated into the application. The previous implementation was just a simulation (mock). Now it's a real payment gateway.

## What Was Implemented

### 1. Backend API Routes
- **POST `/api/payment/create-order`** - Creates a Razorpay order
- **POST `/api/payment/verify`** - Verifies payment signature and saves order

### 2. Frontend Components
- **RazorpayScript** - Loads the Razorpay checkout.js script
- **Payment Page** - Updated with real Razorpay checkout flow

### 3. Database
- Orders are saved to `orders` collection with payment details

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Keys (Server-side)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Razorpay Key (Client-side)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
```

## How to Get Razorpay Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test Keys (for development)
4. Copy Key ID and Key Secret

## Payment Flow

1. User clicks "Pay Now" on payment page
2. Frontend calls `/api/payment/create-order` with amount
3. Backend creates order in Razorpay and returns `order_id`
4. Frontend opens Razorpay checkout modal with order details
5. User completes payment in Razorpay modal
6. Razorpay calls frontend `handler` with payment details
7. Frontend calls `/api/payment/verify` with signature
8. Backend verifies signature using HMAC SHA256
9. If valid, order is saved to database
10. Cart is cleared and user sees success message

## Security

- Signature verification ensures payment authenticity
- Server-side order creation prevents amount tampering
- API keys are never exposed to client (except public key)

## Files Created/Modified

### New Files:
- `src/app/api/payment/create-order/route.ts`
- `src/app/api/payment/verify/route.ts`
- `src/components/payment/RazorpayScript.tsx`

### Modified Files:
- `src/app/(pages)/payment/page.tsx` - Full rewrite with real integration
- `package.json` - Added `razorpay` and `crypto-js` dependencies

## Testing

1. Use Razorpay Test Mode
2. Use test card: `5267 3181 8797 5449`
3. Any expiry date in future
4. Any CVV
5. Any OTP (test mode accepts any)

## Switching to Production

1. Get Live Keys from Razorpay Dashboard
2. Replace test keys with live keys in `.env.local`
3. Ensure your domain is whitelisted in Razorpay dashboard
4. Enable webhooks for production reliability
