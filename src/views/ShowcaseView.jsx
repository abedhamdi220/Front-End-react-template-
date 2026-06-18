import React from "react";
import { Sparkles, ArrowRight, Wand2, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { formatImageSrc } from "../config/constants";

export default function ShowcaseView({ showcaseDesigns, setActiveView, setDesignStep, setPrompt }) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
        <img src="[https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80](https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80)" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-20 p-8 sm:p-12 md:p-16 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full mb-4">الذكاء الاصطناعي في خدمتك</div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">صمم ملابسك بخيالك، ونحن نطبعها بواقعية.</h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-lg">أدخل وصفاً لما تتخيله، وسيقوم الذكاء الاصطناعي بتوليد تصميم فريد لك، جاهز للطباعة على أجود الخامات وتوصيله لباب بيتك.</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => { setActiveView("customize"); setDesignStep("select-type"); }} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold h-12 px-8 rounded-xl text-lg">
              ابدأ التصميم الآن <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Inspiration Grid */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#3E2723] dark:text-white flex items-center gap-2">
              <Sparkles className="text-[#D4AF37]" /> إلهام من مجتمعنا
            </h3>
            <p className="text-zinc-500 mt-1">تصفح أجمل التصاميم التي ابتكرها الذكاء الاصطناعي بناءً على أفكار العملاء</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseDesigns.map((design) => (
            <Card key={design.id} className="group overflow-hidden bg-white/50 dark:bg-zinc-900/50 border-white/20 dark:border-zinc-800 hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={formatImageSrc(design.image_url || design.image_base64)}
                  alt={design.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <Button size="sm" className="w-full bg-[#D4AF37] text-black font-bold mb-2" onClick={() => { setActiveView("customize"); setPrompt(design.description); setDesignStep("select-type"); }}>
                    استخدم هذه الفكرة <Wand2 className="w-4 h-4 mr-2" />
                  </Button>
                </div>
                {design.is_featured && (
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-black px-2.5 py-1 rounded-full text-[10px] font-black shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" /> مميز
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold text-[#3E2723] dark:text-zinc-100 mb-1 truncate">{design.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{design.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
