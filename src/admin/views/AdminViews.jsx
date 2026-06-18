import React from "react";
import { Users, Package, Clock, DollarSign, Settings, Trash2, Edit, CreditCard, Bell, ShieldAlert, Image as ImageIcon, CheckCircle, Tag } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../components/ui/UIComponents";

export const OverviewView = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4">
    {[
      { title: "إجمالي العملاء", val: stats.total_users, icon: Users, color: "from-blue-500 to-blue-600" },
      { title: "إجمالي الطلبات", val: stats.total_orders, icon: Package, color: "from-emerald-500 to-emerald-600" },
      { title: "الطلبات المعلقة", val: stats.pending_orders, icon: Clock, color: "from-amber-500 to-amber-600" },
      { title: "إجمالي الإيرادات", val: `${stats.total_revenue} ر.س`, icon: DollarSign, color: "from-[#D4AF37] to-[#B8941F]" },
    ].map((s, i) => (
      <Card key={i} className="hover:shadow-lg transition-shadow">
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`p-4 bg-gradient-to-br ${s.color} rounded-2xl text-white shadow-lg`}><s.icon className="w-8 h-8" /></div>
          <div><p className="text-sm font-bold text-zinc-500">{s.title}</p><p className="text-2xl font-black text-[#3E2723]">{s.val}</p></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const CustomersView = ({ customers, setModals, modals }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="flex flex-row justify-between items-center bg-zinc-50/50 border-b pb-4">
      <CardTitle className="text-xl font-bold">إدارة العملاء</CardTitle>
      <div className="flex gap-2">
        <Button size="sm" variant="outline">تصدير CSV</Button>
      </div>
    </CardHeader>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr>
            <th className="p-4 font-bold">الاسم</th>
            <th className="p-4 font-bold">البريد الإلكتروني</th>
            <th className="p-4 font-bold">تاريخ التسجيل</th>
            <th className="p-4 font-bold">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {customers.map(c => (
            <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="p-4 font-bold text-[#3E2723]">{c.username}</td>
              <td className="p-4 text-zinc-600" dir="ltr">{c.email}</td>
              <td className="p-4 text-zinc-600">{new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
              <td className="p-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setModals({...modals, permissions: { open: true, targetId: c.id, type: 'customer', currentPerms: [] }})}>
                  <Settings className="w-4 h-4 ml-1" /> الصلاحيات
                </Button>
                <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export const AdminsView = ({ admins, setModals, modals }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="flex flex-row justify-between items-center bg-zinc-50/50 border-b pb-4">
      <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> إدارة المشرفين</CardTitle>
      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">إضافة مشرف</Button>
    </CardHeader>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr><th className="p-4 font-bold">المشرف</th><th className="p-4 font-bold">البريد</th><th className="p-4 font-bold">الصلاحيات</th><th className="p-4 font-bold">الإجراءات</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {admins.map(a => (
            <tr key={a.id} className="hover:bg-zinc-50/50">
              <td className="p-4 font-bold text-[#3E2723]">{a.username}</td>
              <td className="p-4 text-zinc-600" dir="ltr">{a.email}</td>
              <td className="p-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Super Admin</span></td>
              <td className="p-4">
                <Button size="sm" variant="outline" onClick={() => setModals({...modals, permissions: { open: true, targetId: a.id, type: 'admin', currentPerms: [] }})}>تعديل الصلاحيات</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export const OrdersView = ({ orders, updateOrderStatus, sendInvoice }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="border-b pb-4 bg-zinc-50/50"><CardTitle className="text-xl font-bold">الطلبات والفواتير</CardTitle></CardHeader>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr><th className="p-4 font-bold">رقم الطلب</th><th className="p-4 font-bold">التفاصيل</th><th className="p-4 font-bold">تاريخ الطلب</th><th className="p-4 font-bold">الحالة</th><th className="p-4 font-bold">إجراءات</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-zinc-50/50">
              <td className="p-4 font-bold text-lg">#{o.id}</td>
              <td className="p-4 text-zinc-600 max-w-[200px] truncate">{o.prompt}</td>
              <td className="p-4 text-zinc-500">{new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
              <td className="p-4">
                <select 
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm border-0 focus:ring-2 ${o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </td>
              <td className="p-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => sendInvoice(o.id)} className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white">إرسال الفاتورة</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export const WalletsView = ({ wallets, setModals, modals }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="border-b pb-4 bg-zinc-50/50"><CardTitle className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#D4AF37]"/> المحافظ المالية</CardTitle></CardHeader>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr><th className="p-4 font-bold">العميل</th><th className="p-4 font-bold">الرصيد الحالي</th><th className="p-4 font-bold">عمليات</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {wallets.map(w => (
            <tr key={w.id} className="hover:bg-zinc-50/50">
              <td className="p-4 font-bold text-[#3E2723]">{w.customer_name}</td>
              <td className="p-4 font-black text-lg text-emerald-600">{w.balance} ر.س</td>
              <td className="p-4 flex gap-2">
                <Button size="sm" onClick={() => setModals({...modals, walletTx: { open: true, customerId: w.id, type: 'deposit' }})} className="bg-emerald-500 hover:bg-emerald-600 text-white">إيداع</Button>
                <Button size="sm" onClick={() => setModals({...modals, walletTx: { open: true, customerId: w.id, type: 'withdraw' }})} className="bg-red-500 hover:bg-red-600 text-white">خصم</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export const DesignsView = ({ designs }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="border-b pb-4 bg-zinc-50/50"><CardTitle className="text-xl font-bold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-[#D4AF37]"/> إدارة التصاميم المولدة</CardTitle></CardHeader>
    <CardContent className="p-6 text-center text-zinc-500 py-12">
      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
      <p className="font-bold">مكتبة التصاميم</p>
      <p className="text-sm">سيتم عرض جميع التصاميم التي قام المستخدمون بتوليدها هنا لمراجعتها.</p>
    </CardContent>
  </Card>
);

export const CouponsView = ({ coupons }) => (
  <Card className="animate-in slide-in-from-bottom-4">
    <CardHeader className="border-b pb-4 bg-zinc-50/50 flex flex-row justify-between items-center"><CardTitle className="text-xl font-bold flex items-center gap-2"><Tag className="w-5 h-5 text-[#D4AF37]"/> الكوبونات</CardTitle><Button size="sm">إضافة كوبون</Button></CardHeader>
    <CardContent className="p-0 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="bg-zinc-50 text-zinc-500">
          <tr><th className="p-4 font-bold">الكود</th><th className="p-4 font-bold">نسبة الخصم</th><th className="p-4 font-bold">إجراءات</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {coupons.map(c => (
            <tr key={c.id} className="hover:bg-zinc-50/50">
              <td className="p-4 font-mono font-bold text-lg">{c.code}</td>
              <td className="p-4 font-black text-[#D4AF37]">{c.discount_percentage}%</td>
              <td className="p-4"><Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
);

export const NotificationsView = ({ notifications, markNotificationRead }) => (
  <Card className="animate-in slide-in-from-bottom-4 max-w-3xl mx-auto">
    <CardHeader className="border-b pb-4 bg-zinc-50/50 flex flex-row justify-between items-center"><CardTitle className="text-xl font-bold">الإشعارات الإدارية</CardTitle><Button size="sm" variant="outline" onClick={() => markNotificationRead()}>تحديد الكل كمقروء</Button></CardHeader>
    <CardContent className="p-0">
      <div className="divide-y divide-zinc-100">
        {notifications.length === 0 ? <div className="p-8 text-center text-zinc-500">لا توجد إشعارات حالياً</div> : notifications.map(n => (
          <div key={n.id} className={`p-4 flex justify-between items-center ${!n.read_at ? 'bg-amber-50/50' : 'bg-white'}`}>
            <div className="flex gap-3 items-center">
              <div className={`w-2 h-2 rounded-full ${!n.read_at ? 'bg-[#D4AF37]' : 'bg-zinc-300'}`}></div>
              <p className={`text-sm ${!n.read_at ? 'font-bold text-[#3E2723]' : 'font-medium text-zinc-600'}`}>{n.title}</p>
            </div>
            {!n.read_at && <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)} className="h-8"><CheckCircle className="w-4 h-4 text-emerald-500" /></Button>}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);