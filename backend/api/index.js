import express from 'express';
import productsRouter from './products.js';
import collectionsRouter from './collections.js';
import searchRouter from './search.js';
import cartRouter from './cart.js';
import checkoutRouter from './checkout.js';
import customerRouter from './customer.js';
import ordersRouter from './orders.js';
import trackingRouter from './tracking.js';
import wishlistRouter from './wishlist.js';
import contactRouter from './contact.js';
import shopifyOrdersWebhook from './webhooks/shopify-orders.js';
import shopifyProductsWebhook from './webhooks/shopify-products.js';

const router = express.Router();

router.use('/products', productsRouter);
router.use('/collections', collectionsRouter);
router.use('/search', searchRouter);
router.use('/cart', cartRouter);
router.use('/checkout', checkoutRouter);
router.use('/customer', customerRouter);
router.use('/orders', ordersRouter);
router.use('/tracking', trackingRouter);
router.use('/wishlist', wishlistRouter);
router.use('/contact', contactRouter);
router.use('/webhooks/shopify-orders', shopifyOrdersWebhook);
router.use('/webhooks/shopify-products', shopifyProductsWebhook);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'The Candlorre Atelier',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;
