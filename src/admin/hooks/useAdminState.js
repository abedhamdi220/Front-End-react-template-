import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ADMIN_ENDPOINTS } from "../config/constants";

export function useAdminState() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState({ total_users: 0, total_orders: 0, total_revenue: 0, pending_orders: 0 });
  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [designOptions, setDesignOptions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [modals, setModals] = useState({
    walletTx: { open: false, customerId: null, type: 'deposit' },
    permissions: { open: false, targetId: null, type: 'customer', currentPerms: [] },
    invoice: { open: false, orderId: null },
    adminForm: { open: false, admin: null }
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await axios.get(ADMIN_ENDPOINTS.analytics).catch(() => ({data: { total_users: 150, total_orders: 320, total_revenue: 15400, pending_orders: 12 }}));
        setStats(res.data);
      } else if (activeTab === "customers") {
        const res = await axios.get(ADMIN_ENDPOINTS.customers).catch(() => ({data: [{ id: 1, username: "أحمد", email: "ahmed@ex.com", created_at: new Date() }]}));
        setCustomers(res.data);
      } else if (activeTab === "admins") {
        const res = await axios.get(ADMIN_ENDPOINTS.admins).catch(() => ({data: [{ id: 1, username: "المدير الأول", email: "admin@ex.com" }]}));
        setAdmins(res.data);
      } else if (activeTab === "orders") {
        const resOrders = await axios.get(ADMIN_ENDPOINTS.orders).catch(() => ({data: [{ id: 1, prompt: "تصميم غرفة", status: "pending", created_at: new Date() }]}));
        const resInvoices = await axios.get(ADMIN_ENDPOINTS.invoices).catch(() => ({data: []}));
        setOrders(resOrders.data);
        setInvoices(resInvoices.data);
      } else if (activeTab === "designs") {
        const resDesigns = await axios.get(ADMIN_ENDPOINTS.designs).catch(() => ({data: []}));
        const resOptions = await axios.get(ADMIN_ENDPOINTS.designOptions).catch(() => ({data: []}));
        setDesigns(resDesigns.data);
        setDesignOptions(resOptions.data);
      } else if (activeTab === "wallets") {
        const res = await axios.get(ADMIN_ENDPOINTS.wallets).catch(() => ({data: [{ id: 1, customer_name: "أحمد", balance: 500 }]}));
        setWallets(res.data);
      } else if (activeTab === "coupons") {
        const res = await axios.get(ADMIN_ENDPOINTS.coupons).catch(() => ({data: [{ id: 1, code: "SUMMER25", discount_percentage: 25 }]}));
        setCoupons(res.data);
      } else if (activeTab === "notifications") {
        const res = await axios.get(ADMIN_ENDPOINTS.notifications).catch(() => ({data: [{ id: 1, title: "طلب جديد", read_at: null }]}));
        setNotifications(res.data);
      }
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleWalletTransaction = async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const notes = e.target.notes.value;
    const { customerId, type } = modals.walletTx;
    try {
      await axios.post(`${ADMIN_ENDPOINTS.wallets}/${type}`, { customer_id: customerId, amount, notes });
      toast.success("تم تنفيذ العملية بنجاح");
      setModals({...modals, walletTx: { open: false }});
      fetchData();
    } catch (error) { toast.error("فشل تنفيذ العملية"); }
  };

  const updatePermissions = async (e) => {
    e.preventDefault();
    const { targetId, type } = modals.permissions;
    const endpoint = type === 'customer' ? `/customers/${targetId}/permissions` : `/admins/${targetId}/permissions`;
    try {
      await axios.put(`${API_BASE}/admin${endpoint}`, { permissions: [] });
      toast.success("تم تحديث الصلاحيات");
      setModals({...modals, permissions: { open: false }});
    } catch (error) { toast.error("فشل تحديث الصلاحيات"); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.post(`${ADMIN_ENDPOINTS.orders}/${id}/status`, { status });
      toast.success("تم تحديث الحالة");
      fetchData();
    } catch (error) { toast.error("فشل تحديث الحالة"); }
  };

  const sendInvoice = async (orderId) => {
    try {
      await axios.post(`${ADMIN_ENDPOINTS.orders}/${orderId}/invoice/send`);
      toast.success("تم إرسال الفاتورة للعميل");
    } catch (error) { toast.error("فشل إرسال الفاتورة"); }
  };

  const markNotificationRead = async (id = null) => {
    try {
      if(id) await axios.post(`${ADMIN_ENDPOINTS.notifications}/read`, { id });
      else await axios.get(`${ADMIN_ENDPOINTS.notifications}/read-all`);
      fetchData();
    } catch (error) {}
  };

  return {
    state: { activeTab, loading, searchQuery, stats, customers, admins, orders, invoices, designs, designOptions, coupons, wallets, notifications, modals },
    handlers: { setActiveTab, setSearchQuery, setModals, handleWalletTransaction, updatePermissions, updateOrderStatus, sendInvoice, markNotificationRead, fetchData }
  };
}
