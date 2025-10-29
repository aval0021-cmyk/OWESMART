# FPX Payment Gateway Integration Guide

## Overview
OweSmart now supports **FPX (Financial Process Exchange)** payment gateway - Malaysia's national inter-bank payment gateway system. Users can pay for subscriptions directly from their bank accounts.

## Features Implemented

### Backend (Node.js/Express)
- ✅ FPX Service (`server/services/fpxService.js`)
  - Bank list management (B2C & B2B)
  - Payment initiation with checksum generation
  - Callback processing and verification
  - Order ID generation

- ✅ FPX Controller (`server/controllers/fpxController.js`)
  - GET `/api/fpx/banks` - Retrieve available banks
  - POST `/api/fpx/initiate` - Initiate payment transaction
  - POST `/api/fpx/callback` - Handle FPX callback (webhook)
  - GET `/api/fpx/status/:orderId` - Check payment status

- ✅ Enhanced Subscription Model
  - Added `paymentMethod` field
  - Added `transactionId` field
  - Added `lastPaymentDate` field

### Frontend (React)
- ✅ FPX Checkout Page (`client/src/pages/FPXCheckout.js`)
  - Bank selection interface
  - Secure form submission to FPX gateway
  - Loading states and user feedback

- ✅ Payment Result Page (`client/src/pages/PaymentResult.js`)
  - Success/failure status display
  - Subscription details confirmation
  - Retry and navigation options

- ✅ Updated Pricing Page
  - Integrated navigation to FPX checkout

## Supported Banks

### B2C (Individual) - 17 Banks
- Maybank, CIMB Bank, Public Bank
- RHB Bank, Hong Leong Bank, AmBank
- UOB Bank, Bank Islam, HSBC Bank
- Bank Muamalat, Affin Bank, Alliance Bank
- BSN, Standard Chartered, OCBC Bank
- Kuwait Finance House, Bank Rakyat

### B2B (Business) - 16 Banks
- All major Malaysian banks with B2B services

## Payment Flow

```
1. User selects plan on Pricing page
   ↓
2. Redirected to FPX Checkout page
   ↓
3. User selects their bank
   ↓
4. System generates FPX form with checksum
   ↓
5. User redirected to bank's secure login
   ↓
6. User authorizes payment at bank
   ↓
7. FPX sends callback to server
   ↓
8. Server verifies and activates subscription
   ↓
9. User redirected to Payment Result page
   ↓
10. Shows success/failure with subscription details
```

## Configuration

### Environment Variables
Add these to your `.env` file:

```env
# FPX Configuration
FPX_MERCHANT_ID=your_merchant_id
FPX_MERCHANT_KEY=your_secret_key
FPX_EXCHANGE_ID=your_exchange_id
FPX_GATEWAY_URL=https://uat.mepsfpx.com.my/FPXMain/seller2DReceiver.jsp
FPX_CALLBACK_URL=http://localhost:5000/api/fpx/callback
FPX_RETURN_URL=http://localhost:3000/payment/result
```

**Note:** Current values are for **UAT (testing)** environment. For production:
- Update to production FPX gateway URL
- Use real merchant credentials from FPX registration
- Update callback/return URLs to your production domain

## Testing

### Test Mode (Current Setup)
The integration is configured for testing with:
- UAT gateway URLs
- Test merchant credentials
- Localhost callback URLs

### To Test:
1. Start backend: `npm run dev` (from root)
2. Start frontend: `npm start` (from client folder)
3. Navigate to `/pricing`
4. Select a plan
5. Choose a bank
6. Follow the payment flow

**Note:** In UAT mode, you won't actually be charged. Use test credentials provided by FPX.

## Production Deployment

### Before Going Live:
1. **Register with FPX**: Apply for merchant account at [mepsfpx.com.my](https://mepsfpx.com.my)
2. **Update Environment Variables**: Use production credentials
3. **Update URLs**: Change to your production domain
4. **SSL Certificate**: Ensure HTTPS for callback URLs
5. **Webhook Security**: FPX requires IP whitelisting
6. **Test Thoroughly**: Use FPX sandbox/UAT first

### Security Considerations:
- ✅ Checksum validation prevents tampering
- ✅ All payment data goes through FPX (PCI compliant)
- ✅ No credit card data stored on your server
- ✅ Callback endpoint validates all requests
- ✅ User authentication required for checkout

## Subscription Tiers

| Plan | Price | Features |
|------|-------|----------|
| OweSmart | RM 19.90 | Basic debt management |
| OweSmarter | RM 99.00 | + Credit reporting & what-if scenarios |
| OweBigSmarts | RM 299.00 | + Business loans & team access |

## API Endpoints

### Get Bank List
```javascript
GET /api/fpx/banks?type=B2C
Response: { banks: [...] }
```

### Initiate Payment
```javascript
POST /api/fpx/initiate
Headers: { Authorization: Bearer <token> }
Body: {
  tier: "OweSmart",
  price: 19.90,
  bankCode: "01",
  customerName: "John Doe",
  customerEmail: "john@example.com"
}
Response: {
  success: true,
  orderId: "ORD123_OweSmart_1234567890_ABCD",
  gatewayUrl: "...",
  formData: { ... }
}
```

### FPX Callback (Webhook)
```javascript
POST /api/fpx/callback
Body: { fpx_sellerOrderNo, fpx_debitAuthCodeStatus, ... }
Response: "OK"
```

### Check Payment Status
```javascript
GET /api/fpx/status/:orderId
Headers: { Authorization: Bearer <token> }
Response: {
  success: true,
  status: "completed",
  subscription: { ... }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 00 | Successful |
| 09 | Pending |
| 11 | Invalid merchant |
| 12 | Invalid transaction |
| 13 | Cancelled by user |
| 20 | Invalid FPX response |
| 99 | General error |

## Troubleshooting

### Payment not reflecting?
- Check server logs for callback receipt
- Verify FPX callback URL is accessible
- Ensure checksum calculation matches FPX format

### Bank not listed?
- Check if bank code is in `fpxService.js`
- Verify bank is active with FPX
- Try B2B banks for business accounts

### Callback not received?
- Ensure server is publicly accessible
- Check firewall/NAT settings
- Verify FPX has correct callback URL
- Test with ngrok for local development

## Files Modified/Created

### Backend
- `server/services/fpxService.js` (new)
- `server/controllers/fpxController.js` (new)
- `server/routes/fpxRoutes.js` (new)
- `server/models/Subscription.js` (updated)
- `server/server.js` (updated - added FPX routes)
- `package.json` (updated - added stripe, uuid)

### Frontend
- `client/src/pages/FPXCheckout.js` (new)
- `client/src/pages/PaymentResult.js` (new)
- `client/src/pages/Pricing.js` (updated)
- `client/src/App.js` (updated - added routes)

## Next Steps

1. **Test locally** - Verify the complete flow
2. **FPX Registration** - Apply for merchant account
3. **Production Config** - Update environment variables
4. **Go Live** - Deploy with production credentials

## Support

For FPX technical support:
- Email: support@mepsfpx.com.my
- Website: https://mepsfpx.com.my

For OweSmart integration support:
- Check server logs for detailed errors
- Review FPX documentation
- Test in UAT environment first

---

**Status:** ✅ FPX Integration Complete & Ready for Testing
**Environment:** UAT (Testing Mode)
**Production Ready:** After FPX merchant approval
