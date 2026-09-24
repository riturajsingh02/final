import express from 'express';
import { ShopifyService } from '../services/shopify.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    const products = ShopifyService.getAllProducts({ category, search });
    return sendSuccess(res, products);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = ShopifyService.getProductById(req.params.id);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    return sendSuccess(res, product);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
