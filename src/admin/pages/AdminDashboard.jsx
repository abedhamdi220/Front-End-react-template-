import React from "react";
import { 
  Users, Package, Image as ImageIcon, Tag, TrendingUp, Wallet, Bell, ShieldAlert
} from "lucide-react";
import { useAdminState } from "../hooks/useAdminState";
import { Button, Input, Label, Dialog } from "../components/ui/UIComponents";
import AdminHeader from "../components/AdminHeader";

// Views
import { 
  OverviewView, CustomersView, AdminsView, OrdersView, 
  WalletsView, DesignsView, CouponsView, NotificationsView 
} from "../views/AdminViews";

const TABS = [
  { id: "overview", label: "الرئيسية", icon: TrendingUp },
  { id: "customers", label: "العملاء", icon: Users },
  { id: "admins", label: "المشرفين", icon: ShieldAlert },
  { id: "orders", label: "الطلبات والفواتير", icon: Package },
  { id: "wallets", label: "المحافظ المالية", icon: Wallet },
  { id: "designs", label: "التصاميم والخيارات", icon: ImageIcon },
  { id: "coupons", label: "الكوبونات", icon: Tag },
  { id: "notifications", label: "الإشعارات", icon: Bell },
];

export default function AdminDashboard({ user = { username: "مدير النظام" }, onLogout }) {
  const { state, handlers } = useAdminState();

  const renderView = () => {
    switch (state.activeTab) {
      case "overview": return <OverviewView stats={state.stats} />;
      case "customers": return <CustomersView customers={state.customers} setModals={handlers.setModals} modals={state.modals} />;
      case "admins": return <AdminsView admins={state.admins} setModals={handlers.setModals} modals={state.modals} />;
      case "orders": return <OrdersView orders={state.orders} updateOrderStatus={handlers.updateOrderStatus} sendInvoice={handlers.sendInvoice} />;
      case "wallets": return <WalletsView wallets={state.wallets} setModals={handlers.setModals} modals={state.modals} />;
      case "designs": return <DesignsView designs={state.designs} />;
      case "coupons": return <CouponsView coupons={state.coupons} />;
      case "notifications": return <NotificationsView notifications={state.notifications} markNotificationRead={handlers.markNotificationRead} />;
      default: return <OverviewView stats={state.stats} />;
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-[#E8DCC8] to-[#F5F0E8] font-sans">
      <AdminHeader 
        user={user} 
        notifications={state.notifications} 
        onLogout={onLogout} 
        setActiveTab={handlers.setActiveTab} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handlers.setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                  state.activeTab === tab.id
                    ? "bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white shadow-md"
                    : "text-[#5D4037] hover:bg-white/60"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {state.loading ? (
            <div className="text-center py-20 text-[#D4AF37] font-bold text-lg animate-pulse">جاري تحميل البيانات...</div>
          ) : (
            renderView()
          )}
        </div>
      </div>

      {/* MODALS */}
      <Dialog 
        open={state.modals.walletTx.open} 
        onClose={() => handlers.setModals({...state.modals, walletTx: { open: false }})}
        title={state.modals.walletTx.type === 'deposit' ? "إيداع رصيد للعميل" : "سحب رصيد من العميل"}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => handlers.setModals({...state.modals, walletTx: { open: false }})}>إلغاء</Button>
            <Button onClick={handlers.handleWalletTransaction} className={state.modals.walletTx.type === 'deposit' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700 text-white"}>
              تأكيد العملية
            </Button>
          </div>
        }
      >
        <form id="walletForm" onSubmit={handlers.handleWalletTransaction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>المبلغ (ر.س)</Label>
            <Input type="number" name="amount" required min="1" className="h-12 bg-zinc-50" />
          </div>
          <div className="space-y-2">
            <Label>ملاحظات / سبب العملية</Label>
            <Input type="text" name="notes" placeholder="اكتب السبب هنا (مثال: تعويض، شحن رصيد)..." className="h-12 bg-zinc-50" />
          </div>
        </form>
      </Dialog>

      <Dialog 
        open={state.modals.permissions.open} 
        onClose={() => handlers.setModals({...state.modals, permissions: { open: false }})}
        title={`إدارة صلاحيات ${state.modals.permissions.type === 'customer' ? 'العميل' : 'المشرف'}`}
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => handlers.setModals({...state.modals, permissions: { open: false }})}>إلغاء</Button>
            <Button onClick={handlers.updatePermissions} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">حفظ الصلاحيات</Button>
          </div>
        }
      >
        <div className="space-y-3 pt-4">
          <p className="text-sm text-[#5D4037] mb-4 font-bold">حدد الصلاحيات المسموحة في النظام:</p>
          {['view_dashboard', 'manage_orders', 'manage_customers', 'manage_wallets', 'manage_showcase'].map(perm => (
            <label key={perm} className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors">
              <input type="checkbox" className="w-5 h-5 accent-[#D4AF37]" />
              <span className="text-[#3E2723] font-bold font-mono text-sm">{perm}</span>
            </label>
          ))}
        </div>
      </Dialog>

    </div>
  );
}
