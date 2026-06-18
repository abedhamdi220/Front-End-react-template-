import { Users, Package, Image as ImageIcon, Tag, TrendingUp, Wallet, Bell, ShieldAlert } from "lucide-react";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api/v1`;

export const ADMIN_ENDPOINTS = {
  analytics: `${API_BASE}/admin/dashboard/analytics`,
  customers: `${API_BASE}/admin/customers`,
  admins: `${API_BASE}/admin/admins`,
  orders: `${API_BASE}/admin/orders`,
  invoices: `${API_BASE}/admin/invoices`,
  designs: `${API_BASE}/admin/designs`,
  designOptions: `${API_BASE}/admin/design-options`,
  wallets: `${API_BASE}/admin/wallets`,
  coupons: `${API_BASE}/admin/coupons`,
  notifications: `${API_BASE}/admin/notifications`,
};

export const ADMIN_TABS = [
  { id: "overview", label: "الرئيسية", icon: TrendingUp },
  { id: "customers", label: "العملاء", icon: Users },
  { id: "admins", label: "المشرفين", icon: ShieldAlert },
  { id: "orders", label: "الطلبات والفواتير", icon: Package },
  { id: "wallets", label: "المحافظ المالية", icon: Wallet },
  { id: "designs", label: "التصاميم والخيارات", icon: ImageIcon },
  { id: "coupons", label: "الكوبونات", icon: Tag },
  { id: "notifications", label: "الإشعارات", icon: Bell },
];
