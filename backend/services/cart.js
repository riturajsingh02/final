import { ShopifyService } from './shopify.js';

// In-Memory cart storage keyed by sessionId or customerId
const carts = new Map();

export class CartService {
  static getCart(cartId) {
    if (!carts.has(cartId)) {
      carts.set(cartId, {
        items: [],
        couponCode: null,
        discountPercent: 0,
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        total: 0,
        freeShippingThreshold: 999
      });
    }
    const cart = carts.get(cartId);
    this.recalculate(cart);
    return cart;
  }

  static addItem(cartId, { productId, quantity = 1, variant = null }) {
    const cart = this.getCart(cartId);
    const product = ShopifyService.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const existingIndex = cart.items.findIndex(
      item => item.productId === product.id && item.variant === variant
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        variant: variant || (product.variants && product.variants[0]?.name) || '',
        quantity: Math.max(1, quantity)
      });
    }

    this.recalculate(cart);
    return cart;
  }

  static updateQuantity(cartId, { productId, variant, quantity }) {
    const cart = this.getCart(cartId);
    const itemIndex = cart.items.findIndex(
      i => i.productId === Number(productId) && (variant ? i.variant === variant : true)
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    this.recalculate(cart);
    return cart;
  }

  static removeItem(cartId, { productId, variant }) {
    return this.updateQuantity(cartId, { productId, variant, quantity: 0 });
  }

  static applyCoupon(cartId, code) {
    const cart = this.getCart(cartId);
    const upperCode = (code || '').trim().toUpperCase();

    if (upperCode === 'SAVE5') {
      cart.couponCode = 'SAVE5';
      cart.discountPercent = 5;
    } else if (upperCode === 'WELCOME10') {
      cart.couponCode = 'WELCOME10';
      cart.discountPercent = 10;
    } else {
      throw new Error('Invalid coupon code. Try "SAVE5" for 5% off.');
    }

    this.recalculate(cart);
    return cart;
  }

  static clearCart(cartId) {
    const cart = this.getCart(cartId);
    cart.items = [];
    cart.couponCode = null;
    cart.discountPercent = 0;
    this.recalculate(cart);
    return cart;
  }

  static recalculate(cart) {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.discountAmount = Math.round((cart.subtotal * cart.discountPercent) / 100);
    cart.shippingFee = cart.subtotal >= cart.freeShippingThreshold || cart.subtotal === 0 ? 0 : 99;
    cart.total = Math.max(0, cart.subtotal - cart.discountAmount + cart.shippingFee);
  }
}

export default CartService;
