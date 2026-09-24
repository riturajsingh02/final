import express from 'express';
import { ShopifyService } from '../services/shopify.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const query = req.query.q || req.query.search || '';
    const products = ShopifyService.getAllProducts({ search: query });
    return sendSuccess(res, { query, results: products, total: products.length });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
