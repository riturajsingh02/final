// In-Memory order database
const orders = new Map();

// Seed initial demo order
const demoOrderId = 'CND-2026-8891';
orders.set(demoOrderId, {
  id: demoOrderId,
  orderNumber: '8891',
  customerId: 'cust_demo_101',
  customerName: 'Rituraj Singh',
  customerPhone: '9762831995',
  customerEmail: 'riturajsinghrana153@gmail.com',
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'IN_TRANSIT',
  statusLabel: 'Out for Delivery',
  paymentMethod: 'PREPAID',
  paymentStatus: 'PAID',
  waybillNumber: 'BLUEDART-8829104',
  courierPartner: 'Blue Dart Express',
  expectedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }),
  shippingAddress: {
    fullName: 'Rituraj Singh',
    phone: '9762831995',
    addressLine1: 'Villa 14, Royal Palm Residences, Sector 45',
    addressLine2: 'Near Botanical Conservatory',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122003'
  },
  items: [
    {
      id: 5,
      name: 'Diamond Glow Jar',
      variant: 'Obsidian Black',
      price: 849,
      quantity: 2,
      image: 'asset/Diamond Glow Jar – Black.jpg'
    },
    {
      id: 46,
      name: 'Reed Diffuser',
      variant: 'Royal Oud',
      price: 849,
      quantity: 1,
      image: 'asset/Oud Reed Diffuser.jpg'
    }
  ],
  pricing: {
    subtotal: 2547,
    discount: 127,
    shipping: 0,
    total: 2420
  },
  trackingHistory: [
    { time: '2 days ago', status: 'Order Placed & Handcrafted at Atelier', location: 'New Delhi Studio' },
    { time: 'Yesterday, 4:00 PM', status: 'Quality Assured & Dispatched', location: 'Delhi Sorting Hub' },
    { time: 'Today, 8:30 AM', status: 'Arrived at Destination Hub', location: 'Gurugram Central Hub' },
    { time: 'Today, 10:15 AM', status: 'Out for Delivery with Courier Executive', location: 'Gurugram' }
  ]
});

export class OrderService {
  static createOrder({ customerId, customerName, customerPhone, customerEmail, shippingAddress, items, pricing, paymentMethod = 'COD' }) {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CND-${new Date().getFullYear()}-${orderNum}`;
    const waybill = `ECOM-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newOrder = {
      id: orderId,
      orderNumber: String(orderNum),
      customerId: customerId || 'guest',
      customerName: customerName || 'Valued Patron',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
      statusLabel: 'Order Confirmed & Atelier Blending',
      paymentMethod,
      paymentStatus: paymentMethod === 'PREPAID' ? 'PAID' : 'PENDING_COD',
      waybillNumber: waybill,
      courierPartner: 'Delhivery Express',
      expectedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      shippingAddress,
      items,
      pricing,
      trackingHistory: [
        { time: 'Just now', status: 'Order Placed & Handcrafted at Atelier', location: 'New Delhi Studio' }
      ]
    };

    orders.set(orderId, newOrder);
    orders.set(waybill, newOrder);
    return newOrder;
  }

  static getOrderById(orderId) {
    if (!orderId) return null;
    const clean = orderId.trim();
    return orders.get(clean) || null;
  }

  static getOrdersByCustomerId(customerId) {
    const list = [];
    for (const ord of orders.values()) {
      if (ord.customerId === customerId && !list.some(o => o.id === ord.id)) {
        list.push(ord);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static trackOrder(query) {
    if (!query) return null;
    const q = query.trim();
    for (const ord of orders.values()) {
      if (
        ord.id.toLowerCase() === q.toLowerCase() ||
        ord.orderNumber === q ||
        ord.waybillNumber?.toLowerCase() === q.toLowerCase() ||
        ord.customerPhone === q
      ) {
        return ord;
      }
    }
    return null;
  }
}

export default OrderService;
