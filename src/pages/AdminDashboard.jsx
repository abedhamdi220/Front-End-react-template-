import React from "react";
import { 
  Users, Package, Image as ImageIcon, Tag, TrendingUp, DollarSign, 
  Trash2, Plus, Edit, Clock, Award, ShieldAlert, Wallet, Bell, FileText, Settings
} from "lucide-react";
import { useAdminState } from "../hooks/useAdminState";
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label, Dialog } from "../components/ui/AdminUIComponents"; // أفترض أنك نقلت مكونات الـ UI لملف منفصل

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

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-[#E8DCC8] to-[#F5F0E8] font-sans">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-[#3E2723]/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#3E2723]">لوحة التحكم المتقدمة</h1>
              <p className="text-sm text-[#5D4037]">مرحباً، {user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => handlers.setActiveTab('notifications')} className="relative">
              <Bell className="w-5 h-5" />
              {state.notifications.filter(n => !n.read_at).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </Button>
            <Button onClick={onLogout} variant="outline" className="border-[#3E2723]/20">تسجيل الخروج</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handlers.setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap text-sm ${
                  state.activeTab === tab.id ? "bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white shadow-md" : "text-[#5D4037] hover:bg-white/60"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {state.loading ? (
             <div className="text-center py-20 text-[#D4AF37] font-bold">جاري تحميل البيانات...</div>
          ) : (
            <>
              {/* هنا يتم استدعاء مكونات الواجهات (Views) التي قمنا بفصلها سابقاً، لتجنب تكدس الكود هنا */}
              {/* مثال: */}
              {/* {state.activeTab === "overview" && <OverviewTab stats={state.stats} />} */}
              {/* {state.activeTab === "customers" && <CustomersTab customers={state.customers} setModals={handlers.setModals} modals={state.modals} />} */}
              {/* اختصاراً للوقت وضعنا الكود هنا لكن في مشروعك استبدلها بالمكونات */}
              {state.activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "العملاء", val: state.stats.total_users, icon: Users },
                    { title: "الطلبات", val: state.stats.total_orders, icon: Package },
                    { title: "الطلبات المعلقة", val: state.stats.pending_orders, icon: Clock },
                    { title: "الإيرادات", val: `${state.stats.total_revenue} ر.س`, icon: DollarSign },
                  ].map((s, i) => (
                    <Card key={i}>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="p-4 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]"><s.icon className="w-8 h-8" /></div>
                        <div><p className="text-sm font-medium text-[#5D4037]">{s.title}</p><p className="text-2xl font-bold text-[#3E2723]">{s.val}</p></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {/* ... باقي الواجهات (Orders, Wallets, etc) */}
            </>
          )}
        </div>
      </div>

      {/* ================= النوافذ المنبثقة (MODALS) ================= */}
      <Dialog 
        open={state.modals.walletTx.open} 
        onClose={() => handlers.setModals({...state.modals, walletTx: { open: false }})}
        title={state.modals.walletTx.type === 'deposit' ? "إيداع رصيد" : "سحب رصيد"}
        footer={
          <><Button variant="ghost" onClick={() => handlers.setModals({...state.modals, walletTx: { open: false }})}>إلغاء</Button>
          <Button onClick={handlers.handleWalletTransaction}>تأكيد العملية</Button></>
        }
      >
        <form id="walletForm" onSubmit={handlers.handleWalletTransaction} className="space-y-4">
          <div><Label>المبلغ (ر.س)</Label><Input type="number" name="amount" required min="1" /></div>
          <div><Label>ملاحظات العملية</Label><Input type="text" name="notes" placeholder="سبب الإيداع أو السحب..." /></div>
        </form>
      </Dialog>

      <Dialog 
        open={state.modals.permissions.open} 
        onClose={() => handlers.setModals({...state.modals, permissions: { open: false }})}
        title="إدارة الصلاحيات (Permissions)"
        footer={
          <><Button variant="ghost" onClick={() => handlers.setModals({...state.modals, permissions: { open: false }})}>إلغاء</Button>
          <Button onClick={handlers.updatePermissions}>حفظ التغييرات</Button></>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-[#5D4037] mb-4">اختر الصلاحيات الممنوحة لهذا المستخدم:</p>
          {['dashboard.view', 'orders.manage', 'designs.create', 'wallets.deposit'].map(perm => (
            <label key={perm} className="flex items-center gap-3 p-2 border border-[#3E2723]/10 rounded-lg hover:bg-white cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#D4AF37]" />
              <span className="text-[#3E2723] text-sm">{perm}</span>
            </label>
          ))}
        </div>
      </Dialog>
    </div>
  );
}