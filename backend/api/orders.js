import express from 'express';
import { OrderService } from '../services/order.js';
import { CustomerService } from '../services/customer.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const token = req.cookies?.candlorre_auth_token || req.headers.authorization?.replace('Bearer ', '');
    let customerId = 'cust_demo_101'; // default fallback to demo user for easy viewing
    if (token) {
      try {
        const decoded = CustomerService.verifyToken(token);
        customerId = decoded.id;
      } catch {}
    }
    const orders = OrderService.getOrdersByCustomerId(customerId);
    return sendSuccess(res, orders);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.get('/:id', (req, res) => {
  try {
    const order = OrderService.getOrderById(req.params.id);
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }
    return sendSuccess(res, order);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
