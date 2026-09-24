export class ShippingService {
  static verifyPincode(pincode) {
    const code = String(pincode).trim();
    if (!/^\d{6}$/.test(code)) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      };
    }

    const firstDigit = code[0];
    const isMetro = ['1', '4', '5', '6', '7'].includes(firstDigit);

    return {
      serviceable: true,
      pincode: code,
      codAvailable: true,
      estimatedDeliveryDays: isMetro ? '3 to 5 business days' : '5 to 7 business days',
      expressEligible: true,
      courierPartner: 'Delhivery / Blue Dart Express',
      message: `✓ PIN ${code} is fully serviceable with Express Shipping & COD available!`
    };
  }
}

export default ShippingService;
