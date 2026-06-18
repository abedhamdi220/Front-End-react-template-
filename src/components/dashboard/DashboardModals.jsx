import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MapPin, Star, AlertCircle, Ruler, Loader2, Info } from "lucide-react";

export default function DashboardModals({ 
  state: { showAddressModal, editingAddress, addressForm, savingAddress, showReviewModal, reviewForm, submittingReview, showSizeChart, sizeChart, deleteDialog },
  handlers: { setShowAddressModal, setAddressForm, handleSaveAddress, setShowReviewModal, setReviewForm, submitReview, setShowSizeChart, setDeleteDialog, handleDeleteDesign }
}) {
  return (
    <>
      {/* نافذة إدارة العنوان */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MapPin className="text-[#D4AF37]" /> {editingAddress ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveAddress} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>تسمية العنوان (مثال: المنزل، العمل)</Label>
              <Input required value={addressForm.title} onChange={e => setAddressForm({...addressForm, title: e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المدينة</Label>
                <Input required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" />
              </div>
              <div className="space-y-2">
                <Label>الحي</Label>
                <Input required value={addressForm.area} onChange={e => setAddressForm({...addressForm, area: e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>اسم الشارع</Label>
              <Input required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <div className="space-y-2">
              <Label>رقم المبنى / الشقة (اختياري)</Label>
              <Input value={addressForm.building} onChange={e => setAddressForm({...addressForm, building: e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="is_default" checked={addressForm.is_default} onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})} className="w-4 h-4 accent-[#D4AF37]" />
              <Label htmlFor="is_default" className="cursor-pointer">تعيين كعنوان افتراضي</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowAddressModal(false)}>إلغاء</Button>
              <Button type="submit" disabled={savingAddress} className="bg-[#D4AF37] text-black font-bold px-8">
                {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ العنوان"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* نافذة التقييم والمراجعة للطلبات المكتملة */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Star className="text-[#D4AF37]" /> كيف كانت تجربتك؟
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className="focus:outline-none transition-transform hover:scale-110">
                  <Star className={`w-10 h-10 ${star <= reviewForm.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-zinc-300 dark:text-zinc-700'}`} />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>رأيك يهمنا (اكتب تعليقك)</Label>
              <Textarea 
                value={reviewForm.comment} 
                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} 
                placeholder="كيف وجدت جودة الطباعة والخامة؟" 
                className="h-32 resize-none bg-zinc-50 dark:bg-zinc-950" 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setShowReviewModal(false)}>تخطي الآن</Button>
              <Button onClick={submitReview} disabled={submittingReview} className="bg-[#D4AF37] text-black font-bold px-8">
                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال التقييم"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة جدول المقاسات */}
      <Dialog open={showSizeChart} onOpenChange={setShowSizeChart}>
        <DialogContent className="max-w-3xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#3E2723] dark:text-white flex items-center gap-2">
              <Ruler className="text-[#D4AF37]" /> الدليل الشامل للمقاسات
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 mt-4">
            <table className="w-full text-sm text-center">
              <thead className="bg-[#D4AF37] text-black font-black">
                <tr>
                  <th className="p-4 rounded-tr-xl">المقاس (Size)</th>
                  <th className="p-4">الصدر (سم)</th>
                  <th className="p-4">الخصر (سم)</th>
                  <th className="p-4 rounded-tl-xl">الوركين (سم)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {Object.entries(sizeChart).map(([size, dims]) => (
                  <tr key={size} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 font-black text-lg bg-zinc-50 dark:bg-zinc-950/50">{size}</td>
                    <td className="p-4 font-medium text-zinc-600 dark:text-zinc-300">{dims.chest}</td>
                    <td className="p-4 font-medium text-zinc-600 dark:text-zinc-300">{dims.waist}</td>
                    <td className="p-4 font-medium text-zinc-600 dark:text-zinc-300">{dims.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-4 text-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
            <Info className="w-4 h-4 inline ml-1" /> ملاحظة: هذه المقاسات تقريبية وقد تختلف قليلاً بنسبة 1-2 سم حسب نوع القطعة وتصميمها. ننصح بقياس قطعة مشابهة تمتلكها لمقارنة الأبعاد.
          </p>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, designId: null })}>
        <AlertDialogContent dir="rtl" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 font-black text-2xl flex items-center gap-2">
              <AlertCircle className="w-6 h-6" /> تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400 text-base mt-2">
              هل أنت متأكد من رغبتك في حذف هذا التصميم من معرضك؟ هذا الإجراء لا يمكن التراجع عنه نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-8">
            <AlertDialogCancel onClick={() => setDeleteDialog({open: false, designId: null})} className="mt-0 font-bold border-zinc-200 dark:border-zinc-700">تراجع وإلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDesign} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-8">
              نعم، قم بالحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
