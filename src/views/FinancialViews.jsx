import React from "react";
import { Wallet, Plus, Receipt, MapPin, Edit, Trash2, Download, Tag } from "lucide-react";
import { Button } from "../components/ui/button";
import { formatCurrency, formatDate } from "../config/constants";

export const WalletView = ({ wallet, transactions }) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 max-w-5xl mx-auto">
    <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-3xl p-8 md:p-10 text-black shadow-xl shadow-[#D4AF37]/20 relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-10">
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="font-semibold text-black/70 mb-2 flex items-center gap-2">
            <Wallet className="w-5 h-5" /> رصيد المحفظة المتاح
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight" dir="ltr">
            {formatCurrency(wallet.balance)}
          </h2>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button className="flex-1 md:flex-none bg-black text-white hover:bg-zinc-800 font-bold h-12 px-6 rounded-xl border-none">
            <Plus className="w-4 h-4 ml-2" /> شحن الرصيد
          </Button>
        </div>
      </div>
    </div>

    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <h3 className="text-xl font-bold text-[#3E2723] dark:text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-zinc-400" /> سجل العمليات
        </h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">لا توجد عمليات سابقة في محفظتك</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950/50 rounded-lg">
              <tr>
                <th className="px-6 py-4 font-bold rounded-r-lg">العملية</th>
                <th className="px-6 py-4 font-bold">التاريخ</th>
                <th className="px-6 py-4 font-bold">النوع</th>
                <th className="px-6 py-4 font-bold rounded-l-lg">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{t.description}</td>
                  <td className="px-6 py-4 text-zinc-500">{formatDate(t.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.type === 'credit' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50' : 'bg-red-100 text-red-700 dark:bg-red-950/50'
                    }`}>
                      {t.type === 'credit' ? 'إيداع' : 'خصم'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-black ${t.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`} dir="ltr">
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export const AddressesView = ({ addresses, handlers: { setShowAddressModal, setEditingAddress, setAddressForm, handleDeleteAddress, resetAddressForm } }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <div>
        <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">عناوين التوصيل</h2>
        <p className="text-zinc-500">إدارة الأماكن التي نقوم بتوصيل إبداعاتك إليها</p>
      </div>
      <Button onClick={() => { resetAddressForm(); setShowAddressModal(true); }} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold h-12 rounded-xl">
        <Plus className="w-5 h-5 ml-2" /> إضافة عنوان جديد
      </Button>
    </div>

    {addresses.length === 0 ? (
      <div className="glass dark:bg-zinc-900/50 rounded-3xl p-16 text-center flex flex-col items-center">
        <MapPin className="w-24 h-24 text-zinc-300 dark:text-zinc-700 mb-6" />
        <h3 className="text-2xl font-bold mb-3 text-[#3E2723] dark:text-white">لم تقم بإضافة عناوين بعد</h3>
        <p className="text-zinc-500 mb-8 max-w-md">أضف عنوانك الأول الآن لتسريع عملية إتمام الطلب في المستقبل</p>
        <Button onClick={() => { resetAddressForm(); setShowAddressModal(true); }} variant="outline" className="border-[#D4AF37] text-[#D4AF37] font-bold">إضافة عنوان</Button>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className={`relative bg-white dark:bg-zinc-900 p-6 rounded-2xl border-2 transition-all ${address.is_default ? 'border-[#D4AF37] shadow-md shadow-[#D4AF37]/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-[#D4AF37]/50'}`}>
            {address.is_default && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full">
                العنوان الافتراضي
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold flex items-center gap-2 text-[#3E2723] dark:text-white">
                <MapPin className="w-5 h-5 text-[#D4AF37]" /> {address.title}
              </h4>
              <div className="flex gap-2">
                <button onClick={() => { setEditingAddress(address); setAddressForm(address); setShowAddressModal(true); }} className="p-2 text-zinc-400 hover:text-[#D4AF37] bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteAddress(address.id)} className="p-2 text-zinc-400 hover:text-red-500 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <p><span className="font-bold text-zinc-400 dark:text-zinc-500 w-16 inline-block">المدينة:</span> {address.city}</p>
              <p><span className="font-bold text-zinc-400 dark:text-zinc-500 w-16 inline-block">الحي:</span> {address.area}</p>
              <p><span className="font-bold text-zinc-400 dark:text-zinc-500 w-16 inline-block">الشارع:</span> {address.street}</p>
              <p><span className="font-bold text-zinc-400 dark:text-zinc-500 w-16 inline-block">المبنى:</span> {address.building}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const InvoicesView = ({ invoices, handlers: { downloadInvoice } }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4">
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">الفواتير المالية</h2>
      <p className="text-zinc-500">سجل فواتير طلباتك السابقة مع إمكانية التحميل للطباعة</p>
    </div>
    
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      {invoices.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <Receipt className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium text-lg">لا توجد فواتير مُصدرة حالياً</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-bold rounded-r-lg">رقم الفاتورة / الطلب</th>
                <th className="px-6 py-4 font-bold">التاريخ</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">القيمة</th>
                <th className="px-6 py-4 font-bold rounded-l-lg text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-black text-zinc-900 dark:text-white">INV-{inv.id}</div>
                    <div className="text-[10px] text-zinc-500 mt-1">طلب: {inv.order_id}</div>
                  </td>
                  <td className="px-6 py-5 text-zinc-500">{formatDate(inv.date)}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50' : 'bg-red-100 text-red-700 dark:bg-red-950/50'
                    }`}>
                      {inv.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold" dir="ltr">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-5 text-left">
                    <Button onClick={() => downloadInvoice(inv.id)} variant="ghost" className="h-9 px-3 text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black rounded-lg">
                      <Download className="w-4 h-4 ml-2" /> PDF تحميل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export const CouponsView = ({ coupons }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4">
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">عروض وخصومات</h2>
      <p className="text-zinc-500">كوبونات حصرية لعملائنا المميزين</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coupons.map((coupon, idx) => (
        <div key={idx} className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] transition-colors group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Tag className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-3xl font-black text-[#D4AF37]">{coupon.discount_percentage}%</div>
            </div>
            <h4 className="font-bold text-lg mb-1">{coupon.description}</h4>
            <p className="text-xs text-zinc-500 mb-6">الحد الأدنى للشراء: {formatCurrency(coupon.min_purchase)}</p>
            
            <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden p-1">
              <div className="flex-1 font-mono text-center font-bold text-lg py-2 tracking-widest text-zinc-800 dark:text-zinc-200 select-all">
                {coupon.code}
              </div>
              <Button onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success("تم نسخ الكود"); }} className="bg-black text-white hover:bg-zinc-800 font-bold px-4">
                نسخ
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
