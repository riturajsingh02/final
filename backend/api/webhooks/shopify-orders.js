/**
 * THE Candlorre — SHOPIFY ORDERS WEBHOOK HANDLER
 * POST /api/webhooks/shopify-orders
 * Idempotent, verified processing for orders, fulfillments, cancellations, and refunds.
 */

import { Router } from 'express';
import crypto from 'crypto';
import { config } from '../../config/env.js';
import { AlertService } from '../../services/alertService.js';
import { db } from '../../db/index.js';

const router = Router();

function verifyShopifyHmac(req) {
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const secret = config.shopify.webhookSecret;

  if (!secret) return true; // Accept in local demo if secret not configured
  if (!hmacHeader) return false;

  const rawBody = req.rawBody || JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

router.post('/', async (req, res) => {
  const topic = req.headers['x-shopify-topic'] || 'orders/create';
  const webhookId = req.headers['x-shopify-webhook-id'] || `ord_hook_${req.body?.id}_${topic}`;

  // 1. Authenticate HMAC
  if (!verifyShopifyHmac(req)) {
    console.warn(`[Webhook] Invalid HMAC signature for topic: ${topic}`);
    await AlertService.sendSystemErrorAlert({
      serviceName: 'Shopify Webhook Authenticator',
      error: new Error(`Rejected unauthorized order webhook with topic "${topic}"`)
    });
    return res.status(401).send('Unauthorized webhook signature.');
  }

  // 2. Webhook Idempotency Check
  const existingEvent = db.webhookEvents.findById(webhookId);
  if (existingEvent) {
    console.log(`[Webhook] Duplicate webhook event ignored: ${webhookId}`);
    return res.status(200).json({ received: true, duplicate: true });
  }

  await db.webhookEvents.create({
    id: webhookId,
    topic,
    orderId: req.body?.id,
    processedAt: new Date().toISOString()
  });

  const orderData = req.body;
  const orderNumber = orderData?.order_number || orderData?.id || 'N/A';

  try {
    switch (topic) {
      case 'orders/create':
        await AlertService.handleNewOrder(orderData);
        // Also evaluate inventory changes for line items
        for (const item of (orderData?.line_items || [])) {
          if (item.product_id && item.variant_id) {
            const currentSnap = InventorySnapshot.getById(item.product_id, item.variant_id);
            if (currentSnap) {
              const remaining = Math.max(0, currentSnap.quantity - (item.quantity || 1));
              await AlertService.evaluateVariantInventory({
                productId: item.product_id,
                variantId: item.variant_id,
                sku: item.sku,
                productTitle: item.title,
                variantTitle: item.variant_title,
                price: parseFloat(item.price || 0),
                quantity: remaining
              });
            }
          }
        }
        break;

      case 'orders/paid':
        await AlertService.handlePaymentEvent({
          orderId: orderData?.id,
          orderNumber,
          eventType: 'PAYMENT_CONFIRMED',
          amount: orderData?.total_price,
          paymentGateway: orderData?.gateway || 'Shopify Payments'
        });
        break;

      case 'orders/fulfilled':
      case 'fulfillments/create':
        const fulfillment = orderData?.fulfillments?.[0] || {};
        await AlertService.handleOrderStatusChange({
          orderId: orderData?.id,
          orderNumber,
          status: 'fulfilled',
          trackingNumber: fulfillment.tracking_number || orderData?.tracking_number,
          trackingCompany: fulfillment.tracking_company
        });
        break;

      case 'orders/cancelled':
        await AlertService.handleOrderStatusChange({
          orderId: orderData?.id,
          orderNumber,
          status: 'cancelled'
        });
        break;

      case 'refunds/create':
        const refundAmount = orderData?.refund_line_items?.reduce((acc, it) => acc + parseFloat(it.subtotal || 0), 0) || orderData?.amount || 0;
        await AlertService.handlePaymentEvent({
          orderId: orderData?.order_id || orderData?.id,
          orderNumber,
          eventType: 'REFUND_ISSUED',
          amount: refundAmount,
          reason: orderData?.note || 'Store refund processed'
        });
        break;

      default:
        console.log(`[Webhook] Unhandled order topic: ${topic}`);
    }

    return res.status(200).json({ received: true, topic, orderId: orderData?.id });
  } catch (err) {
    console.error(`[Webhook Error] Processing ${topic}:`, err);
    await AlertService.sendSystemErrorAlert({
      serviceName: `Shopify Webhook (${topic})`,
      error: err
    });
    return res.status(500).json({ error: 'Webhook processing failed', message: err.message });
  }
});

export default router;
