import express from 'express';
import { CartService } from '../services/cart.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

function getCartId(req) {
  return req.cookies?.candlorre_cart_id || req.headers['x-cart-id'] || 'default_cart_session';
}

router.get('/', (req, res) => {
  try {
    const cartId = getCartId(req);
    const cart = CartService.getCart(cartId);
    return sendSuccess(res, cart);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.post('/add', (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId, quantity, variant } = req.body;
    const cart = CartService.addItem(cartId, { productId, quantity, variant });
    return sendSuccess(res, cart, 'Item added to bag');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.post('/update', (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId, quantity, variant } = req.body;
    const cart = CartService.updateQuantity(cartId, { productId, quantity, variant });
    return sendSuccess(res, cart, 'Bag updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.delete('/item', (req, res) => {
  try {
    const cartId = getCartId(req);
    const { productId, variant } = req.body;
    const cart = CartService.removeItem(cartId, { productId, variant });
    return sendSuccess(res, cart, 'Item removed from bag');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.post('/coupon', (req, res) => {
  try {
    const cartId = getCartId(req);
    const { code } = req.body;
    const cart = CartService.applyCoupon(cartId, code);
    return sendSuccess(res, cart, `Coupon "${code}" applied successfully!`);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.post('/clear', (req, res) => {
  try {
    const cartId = getCartId(req);
    const cart = CartService.clearCart(cartId);
    return sendSuccess(res, cart, 'Bag cleared');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
