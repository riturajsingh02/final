export class PaymentService {
  static createRazorpayOrder({ amount, currency = 'INR', receipt }) {
    return {
      orderId: `order_rzp_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created'
    };
  }

  static verifyPayment({ razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
    return {
      success: true,
      transactionId: razorpayPaymentId || `pay_mock_${Date.now()}`
    };
  }
}

export default PaymentService;
