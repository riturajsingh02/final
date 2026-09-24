export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'candlorre_luxury_jwt_secret_dev_key_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    sessionSecret: process.env.SESSION_SECRET || 'candlorre_luxury_session_secret_2026',
  },
  shopify: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'the-candlorre.myshopify.com',
    storefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN || 'mock_token',
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || 'mock_admin_token',
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || 'mock_webhook_secret',
  },
  support: {
    email: process.env.SUPPORT_EMAIL || 'support@thecandlorre.com',
    phone: process.env.SUPPORT_PHONE || '+91 9762831995',
    whatsapp: process.env.WHATSAPP_NUMBER || '919762831995',
  }
};

export default config;
