import React from "react";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Trash2, ShoppingCart, Star, Info, Edit, Phone, ShieldCheck, User, Plus, Package, MapPin, Receipt, Download, Tag, Loader2, Save } from "lucide-react";
import { CLOTHING_TYPES, formatImageSrc, formatDate, formatCurrency } from "../config/constants";

export const GalleryView = ({ designs, handlers: { resetDesigner, setActiveView, setDeleteDialog } }) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <div>
        <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">معرض تصاميمك الخاصة</h2>
        <p className="text-zinc-500">مكتبة تحتوي على {designs.length} ابتكار من إبداعك</p>
      </div>
      <Button onClick={() => { resetDesigner(); setActiveView("customize"); }} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold h-12 rounded-xl">
        <Plus className="w-5 h-5 ml-2" /> ابتكار تصميم جديد
      </Button>
    </div>

    {designs.length === 0 ? (
      <div className="glass dark:bg-zinc-900/50 rounded-3xl p-16 text-center flex flex-col items-center">
        <div className="w-32 h-32 mb-6 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-[#D4AF37]">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#3E2723] dark:text-white">معرضك فارغ حالياً!</h3>
        <p className="text-zinc-500 mb-8 max-w-md">ابدأ بتوليد تصاميمك الأولى باستخدام الذكاء الاصطناعي واحتفظ بها هنا لطباعتها لاحقاً.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {designs.map((design) => (
          <Card key={design.id} className="group overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <img 
                src={formatImageSrc(design.image_url || design.image_base64)} 
                alt="تصميم محفوظ" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <button onClick={() => setDeleteDialog({ open: true, designId: design.id })} className="p-2 bg-white/90 dark:bg-zinc-900/90 text-red-500 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-[-10px] group-hover:translate-y-0 duration-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {CLOTHING_TYPES.find(t=>t.value===design.clothing_type)?.label || 'غير محدد'}
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-relaxed" title={design.prompt}>{design.prompt}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full font-bold border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                <ShoppingCart className="w-4 h-4 ml-2" /> طلب طباعة
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export const OrdersView = ({ orders, handlers: { openReviewModal } }) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-4">
    <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
      <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">تتبع طلباتك</h2>
      <p className="text-zinc-500">حالة ومسار جميع القطع التي قمت بطلبها</p>
    </div>

    {orders.length === 0 ? (
      <div className="glass dark:bg-zinc-900/50 rounded-3xl p-16 text-center flex flex-col items-center">
        <Package className="w-24 h-24 text-zinc-300 dark:text-zinc-700 mb-6" />
        <h3 className="text-2xl font-bold mb-3 text-[#3E2723] dark:text-white">لم تقم بأي طلبات بعد</h3>
        <p className="text-zinc-500 mb-8">صمم قطعتك الأولى واطلبها لتصلك إلى باب منزلك</p>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-[#D4AF37]/50 transition-colors">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-48 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 relative">
                <img src={formatImageSrc(order.image_url || order.design_image_base64)} alt="طلب" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {order.size}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-black text-[#3E2723] dark:text-white">طلب رقم #{String(order.id).substring(0, 8)}</h4>
                      <span className="text-xs text-zinc-500">{formatDate(order.created_at)}</span>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      order.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل ومُسلم' : order.status === 'processing' ? 'قيد التنفيذ' : order.status === 'cancelled' ? 'ملغي' : 'قيد المراجعة'}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-2">{order.prompt}</p>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <div className="font-bold text-lg text-[#3E2723] dark:text-white">
                    {formatCurrency(order.total_amount)}
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'completed' && !order.is_reviewed && (
                      <Button onClick={() => openReviewModal(order)} variant="outline" className="h-9 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black">
                        <Star className="w-4 h-4 ml-2" /> تقييم المنتج
                      </Button>
                    )}
                    <Button variant="ghost" className="h-9 text-zinc-500 hover:text-black dark:hover:text-white bg-zinc-100 dark:bg-zinc-800">
                      <Info className="w-4 h-4 ml-2" /> التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export const ProfileView = ({ state: { profileData, profileForm, isEditingProfile, updatingProfile }, handlers: { setProfileForm, setIsEditingProfile, updateProfile } }) => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
      
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-950 shadow-lg overflow-hidden flex items-center justify-center text-4xl text-zinc-400 font-bold">
          {profileData.avatar ? (
            <img src={formatImageSrc(profileData.avatar)} alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
          ) : (
            profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : <User className="w-12 h-12" />
          )}
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-[#D4AF37] text-white rounded-full shadow-md hover:scale-110 transition-transform">
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 text-center md:text-right">
        <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-2">
          {profileData.first_name} {profileData.last_name}
        </h2>
        <p className="text-zinc-500 mb-6">{profileData.email}</p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center gap-3">
            <Phone className="w-4 h-4 text-zinc-400" />
            <span className="font-bold text-sm" dir="ltr">{profileData.phone || 'غير محدد'}</span>
          </div>
          <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold text-sm">حساب موثق</span>
          </div>
        </div>
      </div>
    </div>

    <Tabs defaultValue="details" className="w-full" dir="rtl">
      <TabsList className="bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl mb-6 w-full md:w-auto flex h-auto">
        <TabsTrigger value="details" className="rounded-lg py-2.5 text-sm font-bold flex-1 md:flex-none">البيانات الأساسية</TabsTrigger>
        <TabsTrigger value="security" className="rounded-lg py-2.5 text-sm font-bold flex-1 md:flex-none">الأمان وكلمة المرور</TabsTrigger>
        <TabsTrigger value="notifications" className="rounded-lg py-2.5 text-sm font-bold flex-1 md:flex-none">تفضيلات الإشعارات</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#3E2723] dark:text-white">المعلومات الشخصية</h3>
          {!isEditingProfile && (
            <Button variant="outline" onClick={() => setIsEditingProfile(true)} className="h-9 text-xs font-bold border-[#D4AF37] text-[#D4AF37]">
              <Edit className="w-3 h-3 ml-2" /> تعديل البيانات
            </Button>
          )}
        </div>
        
        <form onSubmit={updateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-500">الاسم الأول</Label>
              <Input 
                value={isEditingProfile ? profileForm.first_name : profileData.first_name} 
                onChange={(e) => setProfileForm({...profileForm, first_name: e.target.value})}
                disabled={!isEditingProfile}
                className={`h-12 bg-zinc-50 dark:bg-zinc-950 ${!isEditingProfile ? 'border-transparent font-bold' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500">الاسم الأخير</Label>
              <Input 
                value={isEditingProfile ? profileForm.last_name : profileData.last_name} 
                onChange={(e) => setProfileForm({...profileForm, last_name: e.target.value})}
                disabled={!isEditingProfile}
                className={`h-12 bg-zinc-50 dark:bg-zinc-950 ${!isEditingProfile ? 'border-transparent font-bold' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500">البريد الإلكتروني (غير قابل للتعديل)</Label>
              <Input 
                value={profileData.email} 
                disabled
                className="h-12 bg-zinc-100 dark:bg-zinc-800/50 border-transparent text-zinc-500"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500">رقم الجوال</Label>
              <Input 
                value={isEditingProfile ? profileForm.phone : profileData.phone} 
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                disabled={!isEditingProfile}
                className={`h-12 bg-zinc-50 dark:bg-zinc-950 ${!isEditingProfile ? 'border-transparent font-bold' : ''}`}
                dir="ltr"
              />
            </div>
          </div>
          
          {isEditingProfile && (
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Button type="button" variant="ghost" onClick={() => setIsEditingProfile(false)} disabled={updatingProfile}>
                إلغاء
              </Button>
              <Button type="submit" disabled={updatingProfile} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold px-8">
                {updatingProfile ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />} حفظ التغييرات
              </Button>
            </div>
          )}
        </form>
      </TabsContent>
      
      <TabsContent value="security" className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
        <h3 className="text-xl font-bold mb-2">إعدادات الأمان</h3>
        <p className="text-zinc-500 mb-6">قم بتغيير كلمة المرور الخاصة بك أو إدارة الأجهزة المتصلة بحسابك.</p>
        <Button variant="outline" className="font-bold border-zinc-300 dark:border-zinc-700">طلب تغيير كلمة المرور</Button>
      </TabsContent>
    </Tabs>
  </div>
);
