import express from 'express';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { name, email, phone, inquiryType, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 'Name, email, and message are required', 400);
    }
    // In-memory acknowledgment
    return sendSuccess(
      res,
      { ticketId: `TKT-${Math.floor(100000 + Math.random() * 900000)}`, name, email },
      'Thank you for reaching out to The Candlorre Concierge Desk. An artisan fragrance advisor will respond within 24 hours.',
      201
    );
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

export default router;
