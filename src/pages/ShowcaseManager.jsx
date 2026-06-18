import React from "react";
import { Plus, Edit, Trash2, Star, EyeOff, Upload, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useShowcase } from "../hooks/useShowcase";

export default function ShowcaseManager({ token }) {
  const { state, handlers } = useShowcase(token);

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#3E2723]">إدارة التصاميم الملهمة</h2>
        <Button onClick={() => handlers.setShowDialog(true)} className="bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white">
          <Plus className="ml-2 w-4 h-4" /> إضافة تصميم جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.designs.length > 0 ? state.designs.map((design) => {
          const imgSrc = design.image_url || (design.image_base64 ? `data:image/png;base64,${design.image_base64}` : null);
          return (
            <Card key={design.id} className="glass overflow-hidden">
              <div className="relative aspect-square bg-white">
                {imgSrc ? <img src={imgSrc} alt={design.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">لا توجد صورة</div>}
                {design.is_featured && <div className="absolute top-2 right-2 bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"><Star className="w-3 h-3 fill-current" /> مميز</div>}
                {!design.is_active && <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"><EyeOff className="w-3 h-3" /> مخفي</div>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-[#3E2723] mb-2 line-clamp-1">{design.title}</h3>
                <p className="text-sm text-[#5D4037] mb-3 line-clamp-2">{design.description}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handlers.handleEdit(design)} variant="outline" size="sm" className="flex-1 border-[#D4AF37] text-[#D4AF37]"><Edit className="w-3 h-3 ml-1" /> تعديل</Button>
                  <Button onClick={() => handlers.handleToggleFeatured(design.id)} variant="outline" size="sm" className={design.is_featured ? 'border-[#D4AF37] bg-[#D4AF37] text-white' : 'border-gray-300'}><Star className={`w-3 h-3 ${design.is_featured ? 'fill-current' : ''}`} /></Button>
                  <Button onClick={() => handlers.handleDelete(design.id)} variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-500 hover:text-white"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        }) : (
          <div className="col-span-full text-center py-12 bg-white/50 rounded-xl border border-dashed border-[#D4AF37]/50"><p className="text-[#5D4037] font-medium">لا توجد تصاميم ملهمة حتى الآن.</p></div>
        )}
      </div>

      {state.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button onClick={() => handlers.setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={state.currentPage === 1} variant="outline" className="glass"><ChevronRight className="w-4 h-4 mr-1" /> السابق</Button>
          <span className="text-sm text-[#5D4037] font-semibold px-4 py-2 glass rounded-lg">صفحة {state.currentPage} من {state.totalPages}</span>
          <Button onClick={() => handlers.setCurrentPage(prev => Math.min(prev + 1, state.totalPages))} disabled={state.currentPage === state.totalPages} variant="outline" className="glass">التالي <ChevronLeft className="w-4 h-4 ml-1" /></Button>
        </div>
      )}

      <Dialog open={state.showDialog} onOpenChange={handlers.handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader><DialogTitle className="text-2xl font-bold text-[#3E2723]">{state.editingDesign ? "تعديل تصميم ملهم" : "إضافة تصميم ملهم جديد"}</DialogTitle></DialogHeader>
          <form onSubmit={handlers.handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 bg-white/50">
                {state.imagePreview ? (
                  <div className="relative">
                    <img src={state.imagePreview} alt="Preview" className="w-full h-64 object-contain rounded-lg" />
                    <Button type="button" onClick={() => { handlers.setFormData({ ...state.formData, image_base64: "" }); handlers.handleImageUpload({target:{files:[]}}) }} variant="destructive" size="sm" className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"><X className="w-4 h-4" /></Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer py-6"><Upload className="w-12 h-12 text-[#D4AF37] mb-2" /><span className="text-sm text-[#5D4037]">اضغط لرفع صورة</span>
                    <input type="file" accept="image/*" onChange={handlers.handleImageUpload} className="hidden" required={!state.editingDesign} />
                  </label>
                )}
            </div>
            <Input value={state.formData.title} onChange={(e) => handlers.setFormData({ ...state.formData, title: e.target.value })} placeholder="العنوان" required />
            <Textarea value={state.formData.description} onChange={(e) => handlers.setFormData({ ...state.formData, description: e.target.value })} placeholder="الوصف" required />
            <Textarea value={state.formData.prompt} onChange={(e) => handlers.setFormData({ ...state.formData, prompt: e.target.value })} placeholder="الـ Prompt" required dir="ltr" />
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button type="button" onClick={handlers.handleCloseDialog} variant="outline" className="flex-1">إلغاء</Button>
              <Button type="submit" disabled={state.loading} className="flex-1 bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white">{state.loading ? "جاري الحفظ..." : "حفظ التصميم"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
