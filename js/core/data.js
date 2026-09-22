/* =========================================================
   THE CANDLEIER — INTEGRATION SETTINGS & INVENTORY
   ========================================================= */

const CANDLEIER_CONFIG = {
  shopifyStoreDomain: window.SHOPIFY_STORE_DOMAIN || '',
  shopifyStorefrontToken: window.SHOPIFY_STOREFRONT_TOKEN || '',
  shopifyApiVersion: '2024-04',
  razorpayKeyId: window.RAZORPAY_KEY_ID || '',
  customerAccountUrl: '/account.html',
  pincodeServiceabilityEndpoint: '/api/check-pincode',
  orderTrackingEndpoint: '',
  ga4MeasurementId: '',
  metaPixelId: ''
};

// Asynchronously fetch server-side configuration if available
(function initConfig() {
  if (typeof fetch === 'function') {
    fetch('/api/config')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data === 'object') {

          if (
            data.shopifyStoreDomain &&
            !CANDLEIER_CONFIG.shopifyStoreDomain
          ) {
            CANDLEIER_CONFIG.shopifyStoreDomain =
              data.shopifyStoreDomain;
          }

          if (
            data.shopifyStorefrontToken &&
            !CANDLEIER_CONFIG.shopifyStorefrontToken
          ) {
            CANDLEIER_CONFIG.shopifyStorefrontToken =
              data.shopifyStorefrontToken;
          }

          if (data.shopifyApiVersion) {
            CANDLEIER_CONFIG.shopifyApiVersion =
              data.shopifyApiVersion;
          }
          if (data.razorpayKeyId) {
            CANDLEIER_CONFIG.razorpayKeyId = data.razorpayKeyId;
          }

          if (data.ga4MeasurementId) {
            CANDLEIER_CONFIG.ga4MeasurementId =
              data.ga4MeasurementId;
          }

          if (data.metaPixelId) {
            CANDLEIER_CONFIG.metaPixelId =
              data.metaPixelId;
          }

          if (data.orderTrackingEndpoint) {
            CANDLEIER_CONFIG.orderTrackingEndpoint =
              data.orderTrackingEndpoint;
          }

          if (
            window.CandleierAnalytics &&
            typeof window.CandleierAnalytics.init === 'function'
          ) {
            window.CandleierAnalytics.init(CANDLEIER_CONFIG);
          }
        }
      })
      .catch(() => {});
  }
})();


/* =========================================================
   STORE CATEGORIES
   ========================================================= */

const storeCategories = [
  "Premium Luxury Candles",
  "Metal Collection",
  "Diffusers and Aromas",
  "Wooden Collection",
  "Home essentials",
  "Seven Chakra- Positivity collection"
];


/* =========================================================
   CANDLE INVENTORY
   ========================================================= */

const CANDLE_INVENTORY = [

  {
    id: 5,
    title: "Diamond Glow Jar – Black",
    category: "Premium Luxury Candles",
    price: 849,
    origPrice: 999,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Diamond Glow Jar – Black.jpg",
    images: [
      "asset/Diamond Glow Jar – Black.jpg",
      "asset/Diamond Glow Jar – Black_2.jpg",
      "asset/Diamond Glow Jar – Black_3.jpg",
      "asset/Diamond Glow Jar – Black_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 6,
    title: "Diamond Glow Jar – Amber",
    category: "Premium Luxury Candles",
    price: 849,
    origPrice: 999,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Diamond Glow Jar – Amber.jpg",
    images: [
      "asset/Diamond Glow Jar – Amber.jpg",
      "asset/Diamond Glow Jar – Amber_2.jpg",
      "asset/Diamond Glow Jar – Amber_3.jpg",
      "asset/Diamond Glow Jar – Amber_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 9,
    title: "Triple Glow Bowl Candle",
    category: "Premium Luxury Candles",
    price: 799,
    origPrice: 899,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Triple Glow Bowl Candle.jpg",
    images: [
      "asset/Triple Glow Bowl Candle.jpg",
      "asset/Triple Glow Bowl Candle_2.jpg",
      "asset/Triple Glow Bowl Candle_3.jpg",
      "asset/Triple Glow Bowl Candle_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 10,
    title: "Double Glow Jar Candle",
    category: "Premium Luxury Candles",
    price: 749,
    origPrice: 849,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Double Glow Jar Candle.jpg",
    images: [
      "asset/Double Glow Jar Candle.jpg",
      "asset/Double Glow Jar Candle_2.jpg",
      "asset/Double Glow Jar Candle_3.jpg",
      "asset/Double Glow Jar Candle_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 11,
    title: "Grand Pillar – White – 12\"",
    category: "Premium Luxury Candles",
    price: 1749,
    origPrice: 1899,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Grand Pillar – White – 12.jpg",
    images: [
      "asset/Grand Pillar – White – 12.jpg",
      "asset/Grand Pillar – White – 12_2.jpg",
      "asset/Grand Pillar – White – 12_3.jpg",
      "asset/Grand Pillar – White – 12_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 15,
    title: "Classic Pillar – White – 9\"",
    category: "Premium Luxury Candles",
    price: 1549,
    origPrice: 1699,
    burn: "30-55 Hours",
    badge: "BESTSELLER",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Classic Pillar – White – 9.jpg",
    images: [
      "asset/Classic Pillar – White – 9.jpg",
      "asset/Classic Pillar – White – 9_2.jpg",
      "asset/Classic Pillar – White – 9_3.jpg",
      "asset/Classic Pillar – White – 9_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 19,
    title: "Mini Pillar – White – 6\"",
    category: "Premium Luxury Candles",
    price: 1349,
    origPrice: 1499,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Mini Pillar – White – 6.jpg",
    images: [
      "asset/Mini Pillar – White – 6.jpg",
      "asset/Mini Pillar – White – 6_2.jpg",
      "asset/Mini Pillar – White – 6_3.jpg",
      "asset/Mini Pillar – White – 6_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 37,
    title: "Ribbed Glow Pillar – Amber",
    category: "Premium Luxury Candles",
    price: 549,
    origPrice: 699,
    burn: "30-55 Hours",
    badge: "BESTSELLER",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Ribbed Glow Pillar – Amber.jpg",
    images: [
      "asset/Ribbed Glow Pillar – Amber.jpg",
      "asset/Ribbed Glow Pillar – Amber_2.jpg",
      "asset/Ribbed Glow Pillar – Amber_3.jpg",
      "asset/Ribbed Glow Pillar – Amber_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 38,
    title: "Ribbed Glow Pillar – Black",
    category: "Premium Luxury Candles",
    price: 549,
    origPrice: 699,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Ribbed Glow Pillar – Black.jpg",
    images: [
      "asset/Ribbed Glow Pillar – Black.jpg",
      "asset/Ribbed Glow Pillar – Black_2.jpg",
      "asset/Ribbed Glow Pillar – Black_3.jpg",
      "asset/Ribbed Glow Pillar – Black_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 39,
    title: "Mandala Glow Tin – Large",
    category: "Premium Luxury Candles",
    price: 399,
    origPrice: 499,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Mandala Glow Tin – Large.jpg",
    images: [
      "asset/Mandala Glow Tin – Large.jpg",
      "asset/Mandala Glow Tin – Large_2.jpg",
      "asset/Mandala Glow Tin – Large_3.jpg",
      "asset/Mandala Glow Tin – Large_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 40,
    title: "Mandala Glow Tin – Small",
    category: "Premium Luxury Candles",
    price: 399,
    origPrice: 499,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Mandala Glow Tin – Small.jpg",
    images: [
      "asset/Mandala Glow Tin – Small.jpg",
      "asset/Mandala Glow Tin – Small_2.jpg",
      "asset/Mandala Glow Tin – Small_3.jpg",
      "asset/Mandala Glow Tin – Small_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 41,
    title: "Golden Metal Luxe Jar Candle",
    category: "Metal Collection",
    price: 849,
    origPrice: 899,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Golden Metal Luxe Jar Candle.jpg",
    images: [
      "asset/Golden Metal Luxe Jar Candle.jpg",
      "asset/Golden Metal Luxe Jar Candle_2.jpg",
      "asset/Golden Metal Luxe Jar Candle_3.jpg",
      "asset/Golden Metal Luxe Jar Candle_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 42,
    title: "Golden Metal Bowl Candle",
    category: "Metal Collection",
    price: 599,
    origPrice: 699,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Golden Metal Bowl Candle.jpg",
    images: [
      "asset/Golden Metal Bowl Candle.jpg",
      "asset/Golden Metal Bowl Candle_2.jpg",
      "asset/Golden Metal Bowl Candle_3.jpg",
      "asset/Golden Metal Bowl Candle_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 43,
    title: "Hazy Metal Luxe Jar Candle",
    category: "Metal Collection",
    price: 749,
    origPrice: 799,
    burn: "30-55 Hours",
    badge: "BESTSELLER",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Hazy Metal Luxe Jar Candle.jpg",
    images: [
      "asset/Hazy Metal Luxe Jar Candle.jpg",
      "asset/Hazy Metal Luxe Jar Candle_2.jpg",
      "asset/Hazy Metal Luxe Jar Candle_3.jpg",
      "asset/Hazy Metal Luxe Jar Candle_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 44,
    title: "Floral Glow Metal Collection – Set of 3",
    category: "Metal Collection",
    price: 849,
    origPrice: 999,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Floral Glow Metal Collection – Set of 3.jpg",
    images: [
      "asset/Floral Glow Metal Collection – Set of 3.jpg",
      "asset/Floral Glow Metal Collection – Set of 3_2.jpg",
      "asset/Floral Glow Metal Collection – Set of 3_3.jpg",
      "asset/Floral Glow Metal Collection – Set of 3_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 45,
    title: "Metal Glow Votive",
    category: "Metal Collection",
    price: 499,
    origPrice: 599,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Metal Glow Votive.jpg",
    images: [
      "asset/Metal Glow Votive.jpg",
      "asset/Metal Glow Votive_2.jpg",
      "asset/Metal Glow Votive_3.jpg",
      "asset/Metal Glow Votive_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 46,
    title: "Neroli Reed Diffuser",
    category: "Diffusers and Aromas",
    price: 849,
    origPrice: 999,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Neroli Reed Diffuser.jpg",
    images: [
      "asset/Neroli Reed Diffuser.jpg",
      "asset/Neroli Reed Diffuser_2.jpg",
      "asset/Neroli Reed Diffuser_3.jpg",
      "asset/Neroli Reed Diffuser_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 51,
    title: "Oud Reed Diffuser",
    category: "Diffusers and Aromas",
    price: 849,
    origPrice: 999,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Oud Reed Diffuser.jpg",
    images: [
      "asset/Oud Reed Diffuser.jpg",
      "asset/Oud Reed Diffuser_2.jpg",
      "asset/Oud Reed Diffuser_3.jpg",
      "asset/Oud Reed Diffuser_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 52,
    title: "Trio Aroma Diffuser Set",
    category: "Diffusers and Aromas",
    price: 799,
    origPrice: 899,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Trio Aroma Diffuser Set.jpg",
    images: [
      "asset/Trio Aroma Diffuser Set.jpg",
      "asset/Trio Aroma Diffuser Set_2.jpg",
      "asset/Trio Aroma Diffuser Set_3.jpg",
      "asset/Trio Aroma Diffuser Set_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 54,
    title: "Grand Boat Candle – Large",
    category: "Wooden Collection",
    price: 2149,
    origPrice: 2299,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Grand Boat Candle – Large.jpg",
    images: [
      "asset/Grand Boat Candle – Large.jpg",
      "asset/Grand Boat Candle – Large_2.jpg",
      "asset/Grand Boat Candle – Large_3.jpg",
      "asset/Grand Boat Candle – Large_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 55,
    title: "Grand Boat Candle – Medium",
    category: "Wooden Collection",
    price: 1849,
    origPrice: 1999,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Grand Boat Candle – Medium.jpg",
    images: [
      "asset/Grand Boat Candle – Medium.jpg",
      "asset/Grand Boat Candle – Medium_2.jpg",
      "asset/Grand Boat Candle – Medium_3.jpg",
      "asset/Grand Boat Candle – Medium_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 56,
    title: "Glow Tea Lights – Set of 50",
    category: "Premium Luxury Candles",
    price: 229,
    origPrice: 299,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Glow Tea Lights – Set of 50.jpg",
    images: [
      "asset/Glow Tea Lights – Set of 50.jpg",
      "asset/Glow Tea Lights – Set of 50_2.jpg",
      "asset/Glow Tea Lights – Set of 50_3.jpg",
      "asset/Glow Tea Lights – Set of 50_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 57,
    title: "Glow Tea Lights – Set of 20",
    category: "Premium Luxury Candles",
    price: 129,
    origPrice: 149,
    burn: "30-55 Hours",
    badge: "BESTSELLER",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Glow Tea Lights – Set of 20.jpg",
    images: [
      "asset/Glow Tea Lights – Set of 20.jpg",
      "asset/Glow Tea Lights – Set of 20_2.jpg",
      "asset/Glow Tea Lights – Set of 20_3.jpg",
      "asset/Glow Tea Lights – Set of 20_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 60,
    title: "Classic Taper Candles – Red – Set of 2",
    category: "Premium Luxury Candles",
    price: 189,
    origPrice: 249,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Classic Taper Candles – Red – Set of 2.jpg",
    images: [
      "asset/Classic Taper Candles – Red – Set of 2.jpg",
      "asset/Classic Taper Candles – Red – Set of 2_2.jpg",
      "asset/Classic Taper Candles – Red – Set of 2_3.jpg",
      "asset/Classic Taper Candles – Red – Set of 2_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 61,
    title: "Classic Taper Candles – Amber – Set of 2",
    category: "Premium Luxury Candles",
    price: 189,
    origPrice: 249,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Classic Taper Candles – Amber – Set of 2.jpg",
    images: [
      "asset/Classic Taper Candles – Amber – Set of 2.jpg",
      "asset/Classic Taper Candles – Amber – Set of 2_2.jpg",
      "asset/Classic Taper Candles – Amber – Set of 2_3.jpg",
      "asset/Classic Taper Candles – Amber – Set of 2_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 62,
    title: "Classic Taper Candles – White – Set of 2",
    category: "Premium Luxury Candles",
    price: 189,
    origPrice: 249,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Classic Taper Candles – White – Set of 2.jpg",
    images: [
      "asset/Classic Taper Candles – White – Set of 2.jpg",
      "asset/Classic Taper Candles – White – Set of 2_2.jpg",
      "asset/Classic Taper Candles – White – Set of 2_3.jpg",
      "asset/Classic Taper Candles – White – Set of 2_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 63,
    title: "Classic Taper Candles – Black – Set of 2",
    category: "Premium Luxury Candles",
    price: 189,
    origPrice: 249,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Classic Taper Candles – Black – Set of 2.jpg",
    images: [
      "asset/Classic Taper Candles – Black – Set of 2.jpg",
      "asset/Classic Taper Candles – Black – Set of 2_2.jpg",
      "asset/Classic Taper Candles – Black – Set of 2_3.jpg",
      "asset/Classic Taper Candles – Black – Set of 2_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 65,
    title: "Scented Wardrobe Wax Tablets",
    category: "Home essentials",
    price: 449,
    origPrice: 499,
    burn: "30-55 Hours",
    badge: "",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Scented Wardrobe Wax Tablets.jpg",
    images: [
      "asset/Scented Wardrobe Wax Tablets.jpg",
      "asset/Scented Wardrobe Wax Tablets_2.jpg",
      "asset/Scented Wardrobe Wax Tablets_3.jpg",
      "asset/Scented Wardrobe Wax Tablets_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  },

  {
    id: 66,
    title: "Seven Chakra Candle Set – Set of 7",
    category: "Seven Chakra- Positivity collection",
    price: 699,
    origPrice: 749,
    burn: "30-55 Hours",
    badge: "NEW ARRIVAL",
    notes: {
      top: "Premium Soy Wax",
      heart: "Essential Oils",
      base: "Therapeutic Fragrance"
    },
    image: "asset/Seven Chakra Candle Set – Set of 7.jpg",
    images: [
      "asset/Seven Chakra Candle Set – Set of 7.jpg",
      "asset/Seven Chakra Candle Set – Set of 7_2.jpg",
      "asset/Seven Chakra Candle Set – Set of 7_3.jpg",
      "asset/Seven Chakra Candle Set – Set of 7_4.jpg"
    ],
    desc: "Hand-poured 100% natural botanical soy wax candles designed to elevate your space."
  }

];


/* =========================================================
   PRESENTATION-SAFE PRODUCT DETAILS
   ========================================================= */

CANDLE_INVENTORY.forEach(product => {

  product.dimensions =
    product.dimensions ||
    (
      product.category === 'Travel Tins'
        ? '7 × 7 × 5 cm'
        : product.category === 'Gift Hampers'
          ? '24 × 18 × 10 cm'
          : '9 × 9 × 11 cm'
    );

  product.stock =
    Number.isFinite(product.stock)
      ? product.stock
      : 20;

  product.images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [
        product.image || 'asset/one.jpg',
        `${(product.image || 'asset/one.jpg').replace(/\.([^.]+)$/, '')}_2.jpg`,
        `${(product.image || 'asset/one.jpg').replace(/\.([^.]+)$/, '')}_3.jpg`,
        `${(product.image || 'asset/one.jpg').replace(/\.([^.]+)$/, '')}_4.jpg`
      ];

  product.variants =
    product.variants ||
    [
      {
        id: `${product.id}-standard`,
        title: 'Standard',
        price: product.price,
        available: product.stock > 0
      }
    ];
});
