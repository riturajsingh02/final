/**
 * THE Candlorre — ADMIN ALERT & STORE MANAGEMENT API
 * Endpoints for the real-time alert dashboard, report triggering, stock management, and settings.
 */

import { Router } from 'express';
import { AlertService } from '../services/alertService.js';
import { EmailService } from '../services/emailService.js';
import { InventorySnapshot } from '../models/InventorySnapshot.js';
import { AlertLog } from '../models/AlertLog.js';
import { AlertSettings } from '../models/AlertSettings.js';
import { StoreActivity } from '../models/StoreActivity.js';
import { scheduler } from '../services/scheduler.js';
import { db } from '../db/index.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

// GET /api/admin/dashboard — Aggregated dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const inventorySummary = InventorySnapshot.getSummary();
    const alertCounts = AlertLog.getCounts();
    const recentActivity = StoreActivity.getAll({ limit: 15 });
    const settings = AlertSettings.get();

    const orders = db.orders.find();
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => (o.createdAt || '').startsWith(today));

    const orderStats = {
      total: orders.length,
      today: todayOrders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      cod: orders.filter(o => String(o.paymentMethod || '').toLowerCase().includes('cod')).length,
      prepaid: orders.filter(o => !String(o.paymentMethod || '').toLowerCase().includes('cod')).length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      refunded: orders.filter(o => o.status === 'refunded').length
    };

    return sendSuccess(res, {
      inventory: inventorySummary,
      alerts: alertCounts,
      orders: orderStats,
      recentActivity,
      settings
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/admin/alerts — Alert log history with filters
router.get('/alerts', (req, res) => {
  try {
    const { type, severity, status, search, limit = 50 } = req.query;
    const alerts = AlertLog.getAll({ type, severity, status, search, limit });
    const counts = AlertLog.getCounts();
    return sendSuccess(res, { alerts, counts, count: alerts.length });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/admin/alerts/:id — Single alert detail with rendered HTML preview
router.get('/alerts/:id', (req, res) => {
  try {
    const alert = AlertLog.getById(req.params.id);
    if (!alert) return sendError(res, 'Alert record not found', 404);
    return sendSuccess(res, { alert });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/admin/alerts/:id/retry — Manually retry a failed email alert
router.post('/alerts/:id/retry', async (req, res) => {
  try {
    const result = await EmailService.retryAlert(req.params.id);
    return sendSuccess(res, result, 'Alert successfully re-dispatched.');
  } catch (err) {
    return sendError(res, `Retry failed: ${err.message}`, 500);
  }
});

// POST /api/admin/alerts/test — Send test alert to verify email dispatch
router.post('/alerts/test', async (req, res) => {
  try {
    const settings = AlertSettings.get();
    const recipient = req.body?.recipient || settings.alertEmail || 'thecandlorre@gmail.com';

    const result = await EmailService.sendEmail({
      to: recipient,
      subject: '🌿 The Candlorre — Alert Notification System Connected',
      severity: 'info',
      badgeText: 'System Health Verification',
      title: 'Alert Notification System Test',
      contentHtml: `
        <p>This is a verified test notification from <strong>The Candlorre Automated Store Alert System</strong>.</p>
        <table class="info-table">
          <tr><th>Setting</th><th>Configured Value</th></tr>
          <tr><td>Target Recipient</td><td><code>${recipient}</code></td></tr>
          <tr><td>Email Provider</td><td><code>${settings.emailProvider}</code></td></tr>
          <tr><td>Low Stock Threshold</td><td><strong>${settings.lowStockThreshold}</strong> units</td></tr>
          <tr><td>Critical Stock Threshold</td><td><strong>${settings.criticalStockThreshold}</strong> units</td></tr>
          <tr><td>Daily Inventory Report</td><td>${settings.enableDailyInventoryReport ? `Active (${settings.dailyInventoryReportHour}:00 IST)` : 'Disabled'}</td></tr>
          <tr><td>Daily Sales Report</td><td>${settings.enableDailySalesReport ? `Active (${settings.dailySalesReportHour}:00 IST)` : 'Disabled'}</td></tr>
        </table>
        <p style="color: #166534; font-weight: 600;">All alert pipelines, state deduplication, and email queues are functioning normally.</p>
      `,
      alertType: 'TEST_ALERT',
      metadata: { initiatedBy: 'admin', testTime: new Date().toISOString() }
    });

    return sendSuccess(res, result, `Test notification dispatched to ${recipient}.`);
  } catch (err) {
    return sendError(res, `Failed to dispatch test notification: ${err.message}`, 500);
  }
});

// GET /api/admin/inventory — Get real-time variant inventory snapshots
router.get('/inventory', (req, res) => {
  try {
    const summary = InventorySnapshot.getSummary();
    return sendSuccess(res, summary);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/admin/inventory/sync — Sync inventory from Shopify
router.post('/inventory/sync', async (req, res) => {
  try {
    const result = await scheduler.syncInventoryFromShopify();
    return sendSuccess(res, result, 'Shopify inventory synced successfully.');
  } catch (err) {
    return sendError(res, `Inventory sync failed: ${err.message}`, 500);
  }
});

// POST /api/admin/inventory/adjust — Manual inventory adjustment (triggers threshold checks)
router.post('/inventory/adjust', async (req, res) => {
  try {
    const { productId, variantId, quantity, sku, productTitle, variantTitle, price, imageUrl } = req.body;
    if (!productId || !variantId || quantity === undefined) {
      return sendError(res, 'productId, variantId, and quantity are required.', 400);
    }

    await AlertService.evaluateVariantInventory({
      productId,
      variantId,
      sku: sku || 'SKU-CNDLR',
      productTitle: productTitle || 'Botanical Candle',
      variantTitle: variantTitle || 'Standard',
      imageUrl: imageUrl || '',
      price: parseFloat(price || 0),
      quantity: parseInt(quantity, 10)
    });

    const updated = InventorySnapshot.getById(productId, variantId);
    return sendSuccess(res, { snapshot: updated }, 'Inventory adjusted and alert thresholds evaluated.');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/admin/settings — Get alert settings
router.get('/settings', (req, res) => {
  try {
    const settings = AlertSettings.get();
    return sendSuccess(res, settings);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// PUT /api/admin/settings — Update alert settings
router.put('/settings', async (req, res) => {
  try {
    const updated = await AlertSettings.update(req.body);
    return sendSuccess(res, updated, 'Alert settings updated successfully.');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/admin/reports/daily-inventory — Trigger Daily Inventory Report on demand
router.post('/reports/daily-inventory', async (req, res) => {
  try {
    const result = await AlertService.generateDailyInventoryReport();
    return sendSuccess(res, result, 'Daily Inventory Report generated and dispatched.');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/admin/reports/daily-sales — Trigger Daily Sales Report on demand
router.post('/reports/daily-sales', async (req, res) => {
  try {
    const result = await AlertService.generateDailySalesReport();
    return sendSuccess(res, result, 'Daily Sales Report generated and dispatched.');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/admin/activity — Get store activity audit log
router.get('/activity', (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    const activities = StoreActivity.getAll({ type, limit });
    return sendSuccess(res, { activities, count: activities.length });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
