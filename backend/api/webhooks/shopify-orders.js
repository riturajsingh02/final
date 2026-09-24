import express from 'express';
import { sendSuccess } from '../../utils/response.js';

const router = express.Router();

router.post('/', (req, res) => {
  // Webhook receiver for Shopify order events
  return sendSuccess(res, { received: true, event: req.headers['x-shopify-topic'] || 'orders/create' });
});

export default router;
