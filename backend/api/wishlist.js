import express from 'express';
import { WishlistService } from '../services/wishlist.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

function getCustomerId(req) {
  return req.cookies?.candlorre_auth_id || req.headers['x-customer-id'] || 'guest_user';
}

router.get('/', (req, res) => {
  try {
    const customerId = getCustomerId(req);
    const items = WishlistService.getWishlist(customerId);
    return sendSuccess(res, items);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.post('/toggle', (req, res) => {
  try {
    const customerId = getCustomerId(req);
    const { productId } = req.body;
    const result = WishlistService.toggleItem(customerId, productId);
    return sendSuccess(res, result, result.added ? 'Added to Saved Sanctuary' : 'Removed from Saved Sanctuary');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

export default router;
