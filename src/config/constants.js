export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api/v1`;

export const API_ENDPOINTS = {
  auth: { logout: `${API_BASE}/auth/logout` },
  account: {
    profile: `${API_BASE}/account/profile`,
    walletBalance: `${API_BASE}/account/wallet/balance`,
    walletTransactions: `${API_BASE}/account/wallet/transactions`,
    addresses: `${API_BASE}/account/addresses`,
    invoices: `${API_BASE}/account/invoices`,
    notifications: `${API_BASE}/account/notifications`,
    notificationsReadAll: `${API_BASE}/account/notifications/read-all`,
  },
  shop: {
    designs: `${API_BASE}/shop/designs`,
    orders: `${API_BASE}/shop/orders`,
    reviews: `${API_BASE}/shop/reviews`,
  },
  fcmToken: `${API_BASE}/fcm-token`
};

export const VIEW_ANGLES = [
  { value: "front", label: "أمامي", icon: "👔" },
  { value: "side", label: "جانبي", icon: "🔄" },
  { value: "back", label: "خلفي", icon: "🔙" }
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export const LOGO_POSITIONS = [
  { value: "center", label: "وسط الصدر", icon: "⬤" },
  { value: "left", label: "الصدر الأيسر", icon: "◀" },
  { value: "right", label: "الصدر الأيمن", icon: "▶" },
  { value: "bottom", label: "أسفل الملابس", icon: "▼" },
  { value: "back", label: "الظهر", icon: "🔙" }
];

export const CLOTHING_TYPES = [
  { value: "tshirt", label: "تيشيرت", emoji: "👕", description: "تيشيرت قطني مريح للاستخدام اليومي بتصميم عصري", color: "from-blue-400 to-blue-600", active: true },
  { value: "hoodie", label: "هودي / كنزة", emoji: "🧥", description: "هودي دافئ ومريح للشتاء مع قبعة وجيب أمامي", color: "from-purple-400 to-purple-600", active: true },
  { value: "pants", label: "بنطلون", emoji: "👖", description: "بنطلون مريح بتصميم عصري يناسب جميع الأوقات", color: "from-amber-400 to-amber-600", active: true },
  { value: "shirt", label: "قميص رسمي", emoji: "👔", description: "قميص أنيق للمناسبات والعمل بخامات فاخرة", color: "from-indigo-400 to-indigo-600", active: false },
  { value: "dress", label: "فستان", emoji: "👗", description: "فستان أنيق للمناسبات الخاصة بتصاميم حصرية", color: "from-pink-400 to-pink-600", active: false },
  { value: "jacket", label: "جاكيت", emoji: "🧥", description: "جاكيت عصري للإطلالة المميزة في الأجواء الباردة", color: "from-gray-500 to-gray-700", active: false },
  { value: "polo", label: "بولو", emoji: "👕", description: "قميص بولو كلاسيكي وأنيق للعمل والنزهات", color: "from-green-400 to-green-600", active: false },
  { value: "sweater", label: "سويتر", emoji: "🧶", description: "سويتر صوف دافئ للشتاء بخيوط ناعمة", color: "from-red-400 to-red-600", active: false }
];

export const formatImageSrc = (imgSource) => {
  if (!imgSource) return "";
  if (imgSource.startsWith("http") || imgSource.startsWith("/")) return imgSource;
  if (imgSource.startsWith("data:")) return imgSource;
  return `data:image/png;base64,${imgSource}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('ar-EG', options);
};
