import express from 'express';
import { OrderService } from '../services/order.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.get('/:query', (req, res) => {
  try {
    const query = req.params.query;
    const order = OrderService.trackOrder(query);
    if (!order) {
      return sendError(res, `No active shipment found matching "${query}". Please check your order ID or tracking waybill.`, 404);
    }
    return sendSuccess(res, order);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
