import React from "react";
import { ArrowRight, Wand2, Sparkles, Loader2, User, Image as ImageIcon, Save, ShoppingCart, X, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CLOTHING_TYPES, VIEW_ANGLES, SIZES, formatImageSrc } from "../config/constants";

export default function CustomizeView({ state, handlers }) {
  const { designStep, selectedClothingType, prompt, enhancing, enhancedPrompt, selectedViewAngle, selectedSize, userPhotoPreview, logoPreview, generating, generatedDesign, compositeImage, showComposite, showOrderForm, addresses, selectedAddressId, phoneNumber, orderNotes, couponCode, appliedCoupon, validatingCoupon, submittingOrder } = state;
  const { setDesignStep, handleClothingTypeSelect, setPrompt, enhancePrompt, setSelectedViewAngle, setSelectedSize, setShowSizeChart, setUserPhotoPreview, setLogoPreview, handleGenerate, setShowComposite, handleSaveToGallery, setShowOrderForm, setShowAddressModal, setSelectedAddressId, setPhoneNumber, setOrderNotes, setCouponCode, validateCouponCode, setAppliedCoupon, handleSubmitOrder } = handlers;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* شريط التقدم (Progress Indicator) */}
      <div className="flex items-center justify-center mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10" />
        <div className="flex justify-between w-full max-w-md px-4">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors ${designStep === 'select-type' || designStep === 'customize' ? 'bg-[#D4AF37] border-white dark:border-zinc-950 text-white' : 'bg-zinc-200 dark:bg-zinc-800 border-white dark:border-zinc-950 text-zinc-500'}`}>1</div>
            <span className="text-xs font-bold mt-2 text-[#3E2723] dark:text-white">النوع</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors ${designStep === 'customize' ? 'bg-[#D4AF37] border-white dark:border-zinc-950 text-white' : 'bg-zinc-200 dark:bg-zinc-800 border-white dark:border-zinc-950 text-zinc-500'}`}>2</div>
            <span className="text-xs font-bold mt-2 text-[#3E2723] dark:text-white">التصميم</span>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-colors ${showOrderForm ? 'bg-[#D4AF37] border-white dark:border-zinc-950 text-white' : 'bg-zinc-200 dark:bg-zinc-800 border-white dark:border-zinc-950 text-zinc-500'}`}>3</div>
            <span className="text-xs font-bold mt-2 text-[#3E2723] dark:text-white">الطلب</span>
          </div>
        </div>
      </div>

      {/* الخطوة 1: اختيار النوع */}
      {designStep === "select-type" && (
        <div className="animate-in fade-in zoom-in-95 duration-300 text-center">
          <h2 className="text-3xl font-black text-[#3E2723] dark:text-white mb-4">اختر القطعة التي تريد إبداعها</h2>
          <p className="text-zinc-500 mb-10 max-w-2xl mx-auto">ابدأ باختيار نوع الملابس، وسنوفر لك أفضل القوالب ليتم تطبيق تصميمك الذكي عليها بدقة عالية.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CLOTHING_TYPES.map((type) => (
              <div
                key={type.value}
                onClick={() => type.active && handleClothingTypeSelect(type)}
                className={`relative glass dark:bg-zinc-900/80 rounded-2xl p-6 transition-all duration-300 border-2 ${
                  type.active 
                    ? 'cursor-pointer group hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D4AF37]/10 border-transparent hover:border-[#D4AF37]' 
                    : 'cursor-not-allowed opacity-60 border-zinc-200 dark:border-zinc-800 grayscale'
                }`}
              >
                {!type.active && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-max bg-zinc-800 text-white text-[10px] font-bold py-1 px-3 rounded-full shadow-lg z-10">
                    قريباً
                  </div>
                )}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${type.active ? type.color : 'from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800'} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-4xl">{type.emoji}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#3E2723] dark:text-white">{type.label}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* الخطوة 2: لوحة التحكم بالتصميم */}
      {designStep === "customize" && selectedClothingType && (
        <div className="animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => setDesignStep("select-type")} className="rounded-full">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-black text-[#3E2723] dark:text-white flex items-center gap-2">
                <Wand2 className="text-[#D4AF37]" /> ابدأ سحرك على الـ {CLOTHING_TYPES.find(t => t.value === selectedClothingType)?.label}
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* لوحة الأدوات (يسار/يمين حسب اللغة) */}
            <div className="lg:col-span-5 space-y-6 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 relative">
              
              {/* حظر الواجهة إذا كنا في خطوة الطلب لمنع التعديل */}
              {showOrderForm && <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-[2px] z-10 rounded-3xl rounded-b-none" />}

              {/* قسم الوصف النصي */}
              <div className="space-y-3">
                <Label className="text-base font-bold text-[#3E2723] dark:text-white flex justify-between items-center">
                  <span>صِف فكرتك بالتفصيل</span>
                  <Button variant="ghost" size="sm" onClick={enhancePrompt} disabled={enhancing || !prompt.trim()} className="text-xs h-7 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                    {enhancing ? <Loader2 className="w-3 h-3 animate-spin ml-1" /> : <Sparkles className="w-3 h-3 ml-1" />} تحسين ذكي
                  </Button>
                </Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`مثال: ذئب يرتدي نظارة شمسية بأسلوب سايبربانك النيون، ألوان متوهجة على خلفية داكنة...`}
                  className="h-32 resize-none text-base bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                />
                {enhancedPrompt && (
                  <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-sm text-[#3E2723] dark:text-zinc-300">
                    <span className="font-bold text-[#D4AF37] block mb-1">الوصف المُحسّن من الذكاء الاصطناعي:</span>
                    {enhancedPrompt}
                  </div>
                )}
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

              {/* إعدادات العرض والمقاس */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[#3E2723] dark:text-white">زاوية التصميم</Label>
                  <Select value={selectedViewAngle} onValueChange={setSelectedViewAngle}>
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIEW_ANGLES.map(angle => (
                        <SelectItem key={angle.value} value={angle.value}>
                          <span className="flex items-center gap-2">{angle.icon} {angle.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-[#3E2723] dark:text-white flex justify-between">
                    المقاس
                    <button onClick={() => setShowSizeChart(true)} className="text-[#D4AF37] text-[10px] underline">دليل المقاسات</button>
                  </Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950/50 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

              {/* تخصيص إضافي (صورة شخصية / لوجو) */}
              <div className="space-y-4">
                <Label className="text-sm font-bold text-[#3E2723] dark:text-white">إضافات احترافية (اختياري)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {/* رفع الصورة الشخصية لدمجها */}
                  <div>
                    <Input
                      type="file" accept="image/*" id="photo-upload" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => { setUserPhotoPreview(reader.result); toast.success("تم رفع صورتك لدمجها مع التصميم"); };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="photo-upload" className={`flex flex-col items-center justify-center p-4 h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${userPhotoPreview ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-zinc-200 dark:border-zinc-700 hover:border-[#D4AF37] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                      {userPhotoPreview ? (
                        <div className="flex flex-col items-center gap-1">
                          <img src={userPhotoPreview} alt="Preview" className="w-8 h-8 rounded-full object-cover border" />
                          <span className="text-[10px] font-bold text-[#D4AF37]">تم الرفع (صورتك)</span>
                        </div>
                      ) : (
                        <>
                          <User className="w-6 h-6 text-zinc-400 mb-2" />
                          <span className="text-xs text-center text-zinc-500 font-medium">جرب التصميم عليك</span>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {/* رفع لوجو */}
                  <div>
                    <Input
                      type="file" accept="image/*" id="logo-upload" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => { setLogoPreview(reader.result); toast.success("تم إرفاق الشعار"); };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label htmlFor="logo-upload" className={`flex flex-col items-center justify-center p-4 h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${logoPreview ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-zinc-200 dark:border-zinc-700 hover:border-[#D4AF37] hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                      {logoPreview ? (
                        <div className="flex flex-col items-center gap-1">
                          <img src={logoPreview} alt="Preview" className="w-8 h-8 object-contain" />
                          <span className="text-[10px] font-bold text-[#D4AF37]">تم الرفع (لوجو)</span>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6 text-zinc-400 mb-2" />
                          <span className="text-xs text-center text-zinc-500 font-medium">أضف شعارك</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* زر توليد التصميم */}
              <Button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold h-14 rounded-xl shadow-lg shadow-black/10 text-lg transition-transform hover:scale-[1.02]"
              >
                {generating ? (
                  <><Loader2 className="mr-2 w-6 h-6 animate-spin" /> جاري سحر الذكاء الاصطناعي...</>
                ) : (
                  <><Sparkles className="mr-2 w-6 h-6" /> ابدأ التوليد السحري</>
                )}
              </Button>
            </div>

            {/* منطقة العرض ونتائج التصميم */}
            <div className="lg:col-span-7 flex flex-col h-full space-y-4">
              
              {/* مربع عرض الصورة */}
              <div className="flex-1 min-h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-3xl overflow-hidden relative shadow-inner border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                {generating ? (
                  <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-500">
                    <Wand2 className="w-16 h-16 animate-bounce mb-4 text-[#D4AF37]" />
                    <p className="font-bold text-lg">الذكاء الاصطناعي يعمل الآن...</p>
                    <p className="text-sm">نحن نقوم برسم خيالك بدقة فائقة</p>
                    
                    {/* شريط تقدم وهمي للجمالية */}
                    <div className="w-48 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-6 overflow-hidden">
                      <div className="h-full bg-[#D4AF37] animate-pulse w-full origin-left" style={{animationDuration: '2s'}} />
                    </div>
                  </div>
                ) : generatedDesign ? (
                  <div className="relative w-full h-full flex flex-col">
                    {/* Toggle Buttons if both composite and raw design exist */}
                    {compositeImage && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1 p-1 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg">
                        <button onClick={() => setShowComposite(false)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${!showComposite ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 dark:text-zinc-300'}`}>التصميم فقط</button>
                        <button onClick={() => setShowComposite(true)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${showComposite ? 'bg-[#D4AF37] text-black' : 'text-zinc-600 dark:text-zinc-300'}`}>صورتك مع التصميم</button>
                      </div>
                    )}
                    
                    <img 
                      src={formatImageSrc(showComposite && compositeImage ? compositeImage : generatedDesign.image_url || generatedDesign.image_base64)}
                      alt="تصميمك الجديد" 
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                ) : (
                  <div className="text-center opacity-30">
                    <ImageIcon className="w-24 h-24 mx-auto mb-4 text-zinc-400" />
                    <p className="text-xl font-bold">مساحة العرض</p>
                    <p className="text-sm">اكتب الوصف واضغط توليد لترى النتيجة هنا</p>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات بعد التوليد (حفظ / شراء) */}
              {generatedDesign && !showOrderForm && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                  <Button onClick={handleSaveToGallery} variant="outline" className="h-14 font-bold border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-xl bg-white dark:bg-zinc-900 text-base">
                    <Save className="ml-2 w-5 h-5" /> حفظ في المعرض
                  </Button>
                  <Button onClick={() => setShowOrderForm(true)} className="h-14 font-bold bg-[#D4AF37] hover:bg-[#B8941F] text-black rounded-xl shadow-lg shadow-[#D4AF37]/30 text-base">
                    <ShoppingCart className="ml-2 w-5 h-5" /> أريد شراء هذه القطعة
                  </Button>
                </div>
              )}

              {/* نموذج إتمام الطلب (يظهر فوق أزرار الإجراءات) */}
              {showOrderForm && (
                <div className="bg-white dark:bg-zinc-900 border-2 border-[#D4AF37] rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 relative">
                  <button onClick={() => setShowOrderForm(false)} className="absolute top-4 left-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <h3 className="text-2xl font-black text-[#3E2723] dark:text-white mb-6 flex items-center gap-2">
                    <Package className="text-[#D4AF37]" /> إتمام طلب الشراء
                  </h3>
                  
                  <div className="space-y-5">
                    {/* مراجعة سريعة */}
                    <div className="flex bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl gap-4">
                      <img src={formatImageSrc(generatedDesign.image_url || generatedDesign.image_base64)} className="w-20 h-20 object-cover rounded-lg border border-zinc-200 dark:border-zinc-800" alt="Thumb" />
                      <div>
                        <p className="font-bold text-lg">{CLOTHING_TYPES.find(t=>t.value===selectedClothingType)?.label}</p>
                        <p className="text-sm text-zinc-500">المقاس: <span className="font-bold text-[#D4AF37]">{selectedSize}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* اختيار العنوان */}
                      <div className="space-y-2">
                        <Label className="font-bold flex justify-between">
                          عنوان التوصيل
                          <button onClick={() => setShowAddressModal(true)} className="text-[#D4AF37] text-xs font-bold">+ إضافة جديد</button>
                        </Label>
                        {addresses.length === 0 ? (
                          <div className="p-3 border border-dashed border-red-300 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm text-red-600 text-center cursor-pointer" onClick={() => setShowAddressModal(true)}>
                            لا يوجد عنوان مضاف، اضغط لإضافة عنوان
                          </div>
                        ) : (
                          <Select value={String(selectedAddressId)} onValueChange={(val) => setSelectedAddressId(Number(val))}>
                            <SelectTrigger className="h-12 bg-zinc-50 dark:bg-zinc-950">
                              <SelectValue placeholder="اختر عنوان التوصيل" />
                            </SelectTrigger>
                            <SelectContent>
                              {addresses.map(addr => (
                                <SelectItem key={addr.id} value={String(addr.id)}>
                                  {addr.title} - {addr.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      {/* رقم الجوال (للتأكيد) */}
                      <div className="space-y-2">
                        <Label className="font-bold">رقم الجوال للتواصل</Label>
                        <Input 
                          value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                          className="h-12 bg-zinc-50 dark:bg-zinc-950" dir="ltr" 
                          placeholder="05XXXXXXXX"
                        />
                      </div>
                    </div>

                    {/* الكوبون والملاحظات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="font-bold text-sm">ملاحظات على الطلب (اختياري)</Label>
                        <Textarea 
                          value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} 
                          placeholder="أي تفاصيل خاصة بتغليف الهدية أو التوصيل..." 
                          className="h-12 min-h-12 resize-none bg-zinc-50 dark:bg-zinc-950"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-sm">كود الخصم (اختياري)</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={couponCode} onChange={(e) => setCouponCode(e.target.value)} 
                            placeholder="أدخل الكود هنا" disabled={!!appliedCoupon}
                            className="h-12 bg-zinc-50 dark:bg-zinc-950 uppercase"
                          />
                          {!appliedCoupon ? (
                            <Button onClick={validateCouponCode} disabled={!couponCode.trim() || validatingCoupon} className="h-12 bg-black text-white hover:bg-zinc-800 px-6">
                              {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "تطبيق"}
                            </Button>
                          ) : (
                            <Button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} variant="destructive" className="h-12">إلغاء</Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSubmitOrder} 
                      disabled={submittingOrder} 
                      className="w-full h-14 bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white dark:text-black font-black text-lg rounded-xl mt-4 hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all"
                    >
                      {submittingOrder ? <><Loader2 className="w-6 h-6 animate-spin ml-2" /> جاري اعتماد الطلب...</> : "تأكيد وإرسال الطلب"}
                    </Button>
                    <p className="text-center text-xs text-zinc-500 font-medium">سيقوم فريقنا بالتواصل معك لتأكيد التفاصيل وعملية الدفع</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}