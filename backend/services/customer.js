import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';

// In-Memory customer store (seeded with demo user)
const customers = new Map();

// Seed demo user
const demoPasswordHash = bcrypt.hashSync('Candlorre@2026', 10);
const demoUser = {
  id: 'cust_demo_101',
  fullName: 'Rituraj Singh',
  email: 'riturajsinghrana153@gmail.com',
  phone: '9762831995',
  passwordHash: demoPasswordHash,
  tier: 'Sanctuary Connoisseur',
  memberSince: '2026',
  addresses: [
    {
      id: 'addr_demo_01',
      fullName: 'Rituraj Singh',
      phone: '9762831995',
      addressLine1: 'Villa 14, Royal Palm Residences, Sector 45',
      addressLine2: 'Near Botanical Conservatory',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122003',
      addressType: 'HOME',
      isDefault: true
    }
  ],
  defaultAddressId: 'addr_demo_01'
};
customers.set(demoUser.email.toLowerCase(), demoUser);
customers.set(demoUser.phone, demoUser);

export class CustomerService {
  static async register({ fullName, email, phone, password }) {
    if (!fullName || (!email && !phone) || !password) {
      throw new ValidationError('Full name, email/phone, and password are required');
    }

    const emailKey = email ? email.toLowerCase() : null;
    if (emailKey && customers.has(emailKey)) {
      throw new ValidationError('An account with this email already exists');
    }
    if (phone && customers.has(phone)) {
      throw new ValidationError('An account with this mobile number already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newId = `cust_${Date.now()}`;
    const newCustomer = {
      id: newId,
      fullName: fullName.trim(),
      email: emailKey || '',
      phone: phone ? phone.trim() : '',
      passwordHash,
      tier: 'Sanctuary Explorer',
      memberSince: new Date().getFullYear().toString(),
      addresses: [],
      defaultAddressId: null
    };

    if (emailKey) customers.set(emailKey, newCustomer);
    if (phone) customers.set(phone.trim(), newCustomer);

    const token = this.generateToken(newCustomer);
    return { customer: this.sanitizeCustomer(newCustomer), token };
  }

  static async login({ identifier, password }) {
    if (!identifier || !password) {
      throw new ValidationError('Identifier and password are required');
    }

    const key = identifier.trim().toLowerCase();
    const customer = customers.get(key);

    if (!customer) {
      throw new UnauthorizedError('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid login credentials');
    }

    const token = this.generateToken(customer);
    return { customer: this.sanitizeCustomer(customer), token };
  }

  static generateToken(customer) {
    return jwt.sign(
      { id: customer.id, email: customer.email, fullName: customer.fullName },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, config.auth.jwtSecret);
    } catch {
      throw new UnauthorizedError('Session expired or invalid token');
    }
  }

  static getCustomerById(id) {
    for (const cust of customers.values()) {
      if (cust.id === id) return cust;
    }
    return null;
  }

  static sanitizeCustomer(cust) {
    if (!cust) return null;
    const { passwordHash, ...rest } = cust;
    const defaultAddr = rest.addresses.find(a => a.id === rest.defaultAddressId) || rest.addresses[0] || null;
    return { ...rest, defaultAddress: defaultAddr };
  }

  static updateProfile(id, updates) {
    const cust = this.getCustomerById(id);
    if (!cust) throw new ValidationError('Customer not found');

    if (updates.fullName) cust.fullName = updates.fullName.trim();
    if (updates.phone) cust.phone = updates.phone.trim();
    if (updates.email) {
      const oldEmail = cust.email;
      const newEmail = updates.email.trim().toLowerCase();
      if (oldEmail !== newEmail) {
        if (customers.has(newEmail)) throw new ValidationError('Email already registered');
        customers.delete(oldEmail);
        cust.email = newEmail;
        customers.set(newEmail, cust);
      }
    }
    return this.sanitizeCustomer(cust);
  }

  static addAddress(customerId, addressData) {
    const cust = this.getCustomerById(customerId);
    if (!cust) throw new ValidationError('Customer not found');

    const addrId = `addr_${Date.now()}`;
    const newAddr = {
      id: addrId,
      fullName: addressData.fullName || cust.fullName,
      phone: addressData.phone || cust.phone,
      addressLine1: addressData.addressLine1,
      addressLine2: addressData.addressLine2 || '',
      city: addressData.city,
      state: addressData.state || 'India',
      pincode: addressData.pincode,
      addressType: addressData.addressType || 'HOME',
      isDefault: Boolean(addressData.isDefault || cust.addresses.length === 0)
    };

    if (newAddr.isDefault) {
      cust.addresses.forEach(a => a.isDefault = false);
      cust.defaultAddressId = addrId;
    }

    cust.addresses.push(newAddr);
    return cust.addresses;
  }

  static updateAddress(customerId, addressId, addressData) {
    const cust = this.getCustomerById(customerId);
    if (!cust) throw new ValidationError('Customer not found');

    const index = cust.addresses.findIndex(a => a.id === addressId);
    if (index === -1) throw new ValidationError('Address not found');

    cust.addresses[index] = {
      ...cust.addresses[index],
      ...addressData,
      id: addressId
    };

    if (addressData.isDefault) {
      cust.addresses.forEach(a => a.isDefault = (a.id === addressId));
      cust.defaultAddressId = addressId;
    }

    return cust.addresses;
  }

  static deleteAddress(customerId, addressId) {
    const cust = this.getCustomerById(customerId);
    if (!cust) throw new ValidationError('Customer not found');

    cust.addresses = cust.addresses.filter(a => a.id !== addressId);
    if (cust.defaultAddressId === addressId) {
      cust.defaultAddressId = cust.addresses[0]?.id || null;
      if (cust.addresses[0]) cust.addresses[0].isDefault = true;
    }

    return cust.addresses;
  }
}

export default CustomerService;
