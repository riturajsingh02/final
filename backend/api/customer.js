import express from 'express';
import { CustomerService } from '../services/customer.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = express.Router();

// Middleware to extract customer from token
function authMiddleware(req, res, next) {
  const token = req.cookies?.candlorre_auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return sendError(res, 'Authentication required', 401);
  }
  try {
    const payload = CustomerService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return sendError(res, err.message, 401);
  }
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const result = await CustomerService.register({ fullName, email, phone, password });
    
    res.cookie('candlorre_auth_token', result.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return sendSuccess(res, result, 'Account created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, err.statusCode || 400);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const result = await CustomerService.login({ identifier, password });

    res.cookie('candlorre_auth_token', result.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return sendSuccess(res, result, 'Welcome back to The Candlorre');
  } catch (err) {
    return sendError(res, err.message, err.statusCode || 401);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('candlorre_auth_token');
  return sendSuccess(res, null, 'Signed out successfully');
});

router.get('/me', authMiddleware, (req, res) => {
  try {
    const customer = CustomerService.getCustomerById(req.user.id);
    if (!customer) return sendError(res, 'Customer not found', 404);
    return sendSuccess(res, CustomerService.sanitizeCustomer(customer));
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.put('/profile', authMiddleware, (req, res) => {
  try {
    const updated = CustomerService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.get('/addresses', authMiddleware, (req, res) => {
  try {
    const customer = CustomerService.getCustomerById(req.user.id);
    return sendSuccess(res, customer?.addresses || []);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

router.post('/addresses', authMiddleware, (req, res) => {
  try {
    const addresses = CustomerService.addAddress(req.user.id, req.body);
    return sendSuccess(res, addresses, 'Address saved', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.put('/addresses/:id', authMiddleware, (req, res) => {
  try {
    const addresses = CustomerService.updateAddress(req.user.id, req.params.id, req.body);
    return sendSuccess(res, addresses, 'Address updated');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

router.delete('/addresses/:id', authMiddleware, (req, res) => {
  try {
    const addresses = CustomerService.deleteAddress(req.user.id, req.params.id);
    return sendSuccess(res, addresses, 'Address removed');
  } catch (err) {
    return sendError(res, err.message, 400);
  }
});

export default router;
