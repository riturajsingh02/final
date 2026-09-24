import express from 'express';
import { ShippingService } from '../services/shipping.js';
import { OrderService } from '../services/order.js';
import { CartService } from '../services/cart.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.post('/verify-pincode', (req, res) => {
  try {
    const { pincode } = req.body;
    const result = ShippingService.verifyPincode(pincode);
    return sendSuccess(res, result);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.post('/create-order', (req, res) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      pricing,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 'Cannot place order with empty cart', 400);
    }

    if (!customerName || !customerPhone || !shippingAddress?.addressLine1 || !shippingAddress?.pincode) {
      return sendError(res, 'Please provide full name, contact number, delivery address and pincode', 400);
    }

    const order = OrderService.createOrder({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      pricing: pricing || {
        subtotal: items.reduce((s, i) => s + (i.price * i.quantity), 0),
        discount: 0,
        shipping: 0,
        total: items.reduce((s, i) => s + (i.price * i.quantity), 0)
      },
      paymentMethod: paymentMethod || 'COD'
    });

    // Clear cart session if present
    const cartId = req.cookies?.candlorre_cart_id || req.headers['x-cart-id'] || 'default_cart_session';
    CartService.clearCart(cartId);

    return sendSuccess(res, order, 'Your Candlorre order has been confirmed!', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

export default router;
