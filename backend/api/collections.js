import express from 'express';
import { ShopifyService } from '../services/shopify.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const collections = ShopifyService.getCollections();
    return sendSuccess(res, collections);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.get('/:slug', (req, res) => {
  try {
    const collection = ShopifyService.getCollectionBySlug(req.params.slug);
    if (!collection) {
      return sendError(res, 'Collection not found', 404);
    }
    const products = ShopifyService.getAllProducts({ category: collection.title });
    return sendSuccess(res, { collection, products });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
