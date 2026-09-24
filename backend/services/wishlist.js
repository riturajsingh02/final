import { ShopifyService } from './shopify.js';

const wishlists = new Map();

export class WishlistService {
  static getWishlist(customerId) {
    if (!wishlists.has(customerId)) {
      wishlists.set(customerId, new Set());
    }
    const productIds = Array.from(wishlists.get(customerId));
    const items = productIds
      .map(id => ShopifyService.getProductById(id))
      .filter(Boolean);
    return items;
  }

  static toggleItem(customerId, productId) {
    if (!wishlists.has(customerId)) {
      wishlists.set(customerId, new Set());
    }
    const set = wishlists.get(customerId);
    const numId = Number(productId);
    let added = false;
    if (set.has(numId)) {
      set.delete(numId);
      added = false;
    } else {
      set.add(numId);
      added = true;
    }
    return { added, items: this.getWishlist(customerId) };
  }
}

export default WishlistService;
