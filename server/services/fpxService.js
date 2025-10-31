const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// FPX Configuration
// In production, these should be in environment variables
const FPX_CONFIG = {
  merchantId: process.env.FPX_MERCHANT_ID || 'TEST_MERCHANT_001',
  merchantKey: process.env.FPX_MERCHANT_KEY || 'test-secret-key-123',
  exchangeId: process.env.FPX_EXCHANGE_ID || 'EX00010',
  // FPX URLs
  gatewayUrl: process.env.FPX_GATEWAY_URL || 'https://uat.mepsfpx.com.my/FPXMain/seller2DReceiver.jsp',
  callbackUrl: process.env.FPX_CALLBACK_URL || 'http://localhost:5000/api/fpx/callback',
  returnUrl: process.env.FPX_RETURN_URL || 'http://localhost:3000/payment/result'
};

// FPX Bank List (B2C - Individual)
const FPX_BANKS = [
  { code: '01', name: 'Maybank', type: 'B2C' },
  { code: '02', name: 'CIMB Bank', type: 'B2C' },
  { code: '03', name: 'Public Bank', type: 'B2C' },
  { code: '04', name: 'RHB Bank', type: 'B2C' },
  { code: '05', name: 'Hong Leong Bank', type: 'B2C' },
  { code: '06', name: 'AmBank', type: 'B2C' },
  { code: '07', name: 'UOB Bank', type: 'B2C' },
  { code: '08', name: 'Bank Islam', type: 'B2C' },
  { code: '09', name: 'HSBC Bank', type: 'B2C' },
  { code: '10', name: 'Bank Muamalat', type: 'B2C' },
  { code: '11', name: 'Affin Bank', type: 'B2C' },
  { code: '12', name: 'Alliance Bank', type: 'B2C' },
  { code: '13', name: 'BSN (Bank Simpanan Nasional)', type: 'B2C' },
  { code: '14', name: 'Standard Chartered', type: 'B2C' },
  { code: '15', name: 'OCBC Bank', type: 'B2C' },
  { code: '16', name: 'Kuwait Finance House', type: 'B2C' },
  { code: '17', name: 'Bank Rakyat', type: 'B2C' },
];

// FPX B2B Banks (for business/SME)
const FPX_BANKS_B2B = [
  { code: 'ABB0233', name: 'Affin Bank (B2B)', type: 'B2B' },
  { code: 'ABMB0212', name: 'Alliance Bank (B2B)', type: 'B2B' },
  { code: 'AMBB0209', name: 'AmBank (B2B)', type: 'B2B' },
  { code: 'BIMB0340', name: 'Bank Islam (B2B)', type: 'B2B' },
  { code: 'BMMB0341', name: 'Bank Muamalat (B2B)', type: 'B2B' },
  { code: 'BKRM0602', name: 'Bank Rakyat (B2B)', type: 'B2B' },
  { code: 'BCBB0235', name: 'CIMB Bank (B2B)', type: 'B2B' },
  { code: 'HLB0224', name: 'Hong Leong Bank (B2B)', type: 'B2B' },
  { code: 'HSBC0223', name: 'HSBC Bank (B2B)', type: 'B2B' },
  { code: 'KFH0346', name: 'Kuwait Finance House (B2B)', type: 'B2B' },
  { code: 'MBB0227', name: 'Maybank (B2B)', type: 'B2B' },
  { code: 'OCBC0229', name: 'OCBC Bank (B2B)', type: 'B2B' },
  { code: 'PBB0233', name: 'Public Bank (B2B)', type: 'B2B' },
  { code: 'RHB0218', name: 'RHB Bank (B2B)', type: 'B2B' },
  { code: 'SCB0216', name: 'Standard Chartered (B2B)', type: 'B2B' },
  { code: 'UOB0226', name: 'UOB Bank (B2B)', type: 'B2B' },
];

class FPXService {
  // Generate checksum for FPX request
  generateChecksum(data) {
    const message = Object.values(data).join('|');
    return crypto
      .createHash('sha256')
      .update(message + FPX_CONFIG.merchantKey)
      .digest('hex')
      .toUpperCase();
  }

  // Verify callback checksum
  verifyChecksum(data, receivedChecksum) {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === receivedChecksum;
  }

  // Get list of available banks
  getBankList(type = 'B2C') {
    return type === 'B2B' ? FPX_BANKS_B2B : FPX_BANKS;
  }

  // Initiate FPX payment
  initiatePayment({ orderId, amount, customerName, customerEmail, bankCode, tier, productDesc, returnUrl }) {
    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Format amount to 2 decimal places (FPX requirement)
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Determine product description
    const description = productDesc || `OweSmart ${tier} Subscription`;

    // Use custom return URL if provided, otherwise use default
    const finalReturnUrl = returnUrl || FPX_CONFIG.returnUrl;

    // Prepare FPX request data
    const fpxData = {
      fpx_msgType: '01', // Authorization
      fpx_msgToken: '01', // For B2C
      fpx_sellerExId: FPX_CONFIG.exchangeId,
      fpx_sellerId: FPX_CONFIG.merchantId,
      fpx_sellerOrderNo: orderId,
      fpx_sellerTxnTime: this.getFormattedDateTime(),
      fpx_sellerBankCode: bankCode,
      fpx_txnCurrency: 'MYR',
      fpx_txnAmount: formattedAmount,
      fpx_buyerEmail: customerEmail,
      fpx_buyerName: customerName,
      fpx_buyerBankId: bankCode,
      fpx_buyerBankBranch: '01',
      fpx_buyerAccNo: '', // Optional
      fpx_buyerId: '', // Optional
      fpx_makerName: '', // Optional
      fpx_buyerIban: '', // Optional
      fpx_productDesc: description,
      fpx_version: '7.0',
    };

    // Generate checksum
    const checksum = this.generateChecksum(fpxData);
    fpxData.fpx_checkSum = checksum;

    return {
      transactionId,
      gatewayUrl: FPX_CONFIG.gatewayUrl,
      formData: fpxData,
      callbackUrl: FPX_CONFIG.callbackUrl,
      returnUrl: finalReturnUrl
    };
  }

  // Generate order ID for debt payment
  generateDebtOrderId(userId, debtId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DEBT${userId}_${debtId}_${timestamp}_${random}`;
  }

  // Process FPX callback
  processCallback(callbackData) {
    const {
      fpx_sellerOrderNo,
      fpx_txnId,
      fpx_buyerName,
      fpx_buyerBankId,
      fpx_txnAmount,
      fpx_txnCurrency,
      fpx_debitAuthCode,
      fpx_debitAuthCodeStatus,
      fpx_creditAuthCode,
      fpx_fpxTxnId,
      fpx_fpxTxnTime,
      fpx_checkSum
    } = callbackData;

    // Verify checksum
    const dataToVerify = {
      fpx_sellerOrderNo,
      fpx_txnId,
      fpx_buyerName,
      fpx_buyerBankId,
      fpx_txnAmount,
      fpx_txnCurrency,
      fpx_debitAuthCode,
      fpx_debitAuthCodeStatus,
      fpx_creditAuthCode,
      fpx_fpxTxnId,
      fpx_fpxTxnTime
    };

    const isValid = this.verifyChecksum(dataToVerify, fpx_checkSum);

    // Determine payment status
    const isSuccess = fpx_debitAuthCodeStatus === '00'; // 00 = Success

    return {
      isValid,
      isSuccess,
      orderId: fpx_sellerOrderNo,
      transactionId: fpx_fpxTxnId,
      amount: fpx_txnAmount,
      authCode: fpx_debitAuthCode,
      status: fpx_debitAuthCodeStatus,
      statusMessage: this.getStatusMessage(fpx_debitAuthCodeStatus),
      buyerName: fpx_buyerName,
      bankId: fpx_buyerBankId,
      timestamp: fpx_fpxTxnTime
    };
  }

  // Get formatted date time for FPX (YYYYMMDDHHmmss)
  getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Get status message
  getStatusMessage(statusCode) {
    const statusMessages = {
      '00': 'Successful',
      '09': 'Pending',
      '11': 'Failed - Invalid merchant',
      '12': 'Failed - Invalid transaction',
      '13': 'Failed - Transaction cancelled by user',
      '20': 'Failed - Invalid FPX response',
      '99': 'Failed - General error'
    };
    return statusMessages[statusCode] || 'Unknown status';
  }

  // Generate order ID
  generateOrderId(userId, tier) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD${userId}_${tier}_${timestamp}_${random}`;
  }
}

module.exports = new FPXService();
