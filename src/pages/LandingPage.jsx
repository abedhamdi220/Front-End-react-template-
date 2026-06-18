import React from "react";
import { Sparkles, Wand2, Heart, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import WhatsAppButton from "../components/WhatsAppButton"; // تأكد من إنشاء هذا المكون
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from "../hooks/useAuth";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function LandingPageContent({ onLogin }) {
  const { state, handlers } = useAuth(onLogin);
  const { showAuth, authMode, loading, formData } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-[#E8DCC8] to-[#F5F0E8] font-sans" dir="rtl">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-[#3E2723]/10 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-[#3E2723]">استوديو التصميم</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => { handlers.setAuthMode("login"); handlers.setShowAuth(true); }} className="text-[#5D4037] font-bold">تسجيل الدخول</Button>
            <Button onClick={() => { handlers.setAuthMode("register"); handlers.setShowAuth(true); }} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-bold shadow-lg">ابدأ مجاناً</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#D4AF37]/30 text-[#D4AF37] mb-8 font-bold text-sm shadow-sm">
            <Star className="w-4 h-4 fill-current" /> أحدث ثورة في عالم الأزياء بالذكاء الاصطناعي
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#3E2723] mb-6 leading-tight">
            صمم ملابسك <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#D4AF37] to-[#B8941F]">بخيالك</span>
          </h1>
          <p className="text-xl text-[#5D4037] mb-12 max-w-2xl mx-auto leading-relaxed">
            استخدم قوة الذكاء الاصطناعي لتحويل أفكارك إلى تصاميم أزياء حقيقية، نطبعها لك بأعلى جودة ونوصلها لباب بيتك.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => { handlers.setAuthMode("register"); handlers.setShowAuth(true); }} className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-black text-lg h-14 px-8 rounded-2xl shadow-xl shadow-[#D4AF37]/20 transition-all hover:-translate-y-1">
              ابتكر تصميمك الأول <Wand2 className="w-5 h-5 mr-2" />
            </Button>
            <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold text-[#3E2723] border-[#3E2723]/20 hover:bg-white/50">
              تصفح المعرض <ArrowRight className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/40 border-y border-[#3E2723]/5">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl font-black text-[#D4AF37] mb-2">+10K</div><div className="text-sm font-bold text-[#5D4037]">تصميم مبتكر</div></div>
            <div><div className="text-4xl font-black text-[#D4AF37] mb-2">%99</div><div className="text-sm font-bold text-[#5D4037]">دقة الطباعة</div></div>
            <div><div className="text-4xl font-black text-[#D4AF37] mb-2">24h</div><div className="text-sm font-bold text-[#5D4037]">سرعة التنفيذ</div></div>
            <div><div className="text-4xl font-black text-[#D4AF37] mb-2">+5K</div><div className="text-sm font-bold text-[#5D4037]">عميل سعيد</div></div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-black text-center text-[#3E2723] mb-16">كيف يعمل استوديو الذكاء الاصطناعي؟</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Wand2, title: "1. صِف فكرتك", desc: "اكتب ما تتخيله، وسيقوم الذكاء الاصطناعي بتحويل كلماتك إلى تصميم بصري مذهل." },
              { icon: Heart, title: "2. اختر القطعة", desc: "اختر نوع الملابس (تيشيرت، هودي، إلخ) والمقاس المناسب لك ولونك المفضل." },
              { icon: TrendingUp, title: "3. استلم طلبك", desc: "سنقوم بطباعة التصميم بأحدث التقنيات وشحنه إليك أينما كنت." }
            ].map((step, idx) => (
              <div key={idx} className="relative bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-[#3E2723]/10 hover:shadow-xl transition-all">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">{idx + 1}</div>
                <step.icon className="w-12 h-12 text-[#D4AF37] mb-6" />
                <h3 className="text-2xl font-bold text-[#3E2723] mb-4">{step.title}</h3>
                <p className="text-[#5D4037] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3E2723] text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6"><Sparkles className="w-6 h-6 text-[#D4AF37]" /><span className="text-2xl font-black">استوديو التصميم</span></div>
          <p className="text-white/60 mb-8">منصة الابتكار الأولى في الشرق الأوسط لتصميم وطباعة الأزياء بالذكاء الاصطناعي.</p>
          <div className="text-white/40 text-sm">© {new Date().getFullYear()} جميع الحقوق محفوظة.</div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      {WhatsAppButton && <WhatsAppButton />}

      {/* Auth Modal */}
      <Dialog open={showAuth} onOpenChange={handlers.setShowAuth}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl rounded-3xl p-0 overflow-hidden" dir="rtl">
          <div className="bg-gradient-to-l from-[#D4AF37] to-[#B8941F] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-20"><Sparkles className="w-32 h-32" /></div>
            <DialogHeader><DialogTitle className="text-3xl font-black text-white relative z-10">مرحباً بك في المستقبل</DialogTitle></DialogHeader>
            <p className="text-white/90 mt-2 relative z-10">سجل الآن وابدأ في تحويل خيالك إلى واقع</p>
          </div>

          <div className="p-6">
            <Tabs value={authMode} onValueChange={handlers.setAuthMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100 p-1 rounded-xl">
                <TabsTrigger value="login" className="rounded-lg font-bold">دخول</TabsTrigger>
                <TabsTrigger value="register" className="rounded-lg font-bold">حساب جديد</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handlers.handleSubmit} className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-bold text-[#5D4037]">اسم المستخدم</label><Input name="username" value={formData.username} onChange={handlers.handleInputChange} className="h-12 bg-zinc-50" required /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-[#5D4037]">كلمة المرور</label><Input name="password" type="password" value={formData.password} onChange={handlers.handleInputChange} className="h-12 bg-zinc-50" required /></div>
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-black text-lg mt-2">{loading ? "جاري التحقق..." : "تسجيل الدخول"}</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handlers.handleSubmit} className="space-y-4">
                  <div className="space-y-2"><label className="text-sm font-bold text-[#5D4037]">اسم المستخدم</label><Input name="username" value={formData.username} onChange={handlers.handleInputChange} className="h-12 bg-zinc-50" required /></div>
                  <div className="space-y-2"><label className="text-sm font-bold text-[#5D4037]">البريد الإلكتروني (Gmail فقط)</label><Input name="email" type="email" value={formData.email} onChange={handlers.handleInputChange} placeholder="example@gmail.com" className="h-12 bg-zinc-50" dir="ltr" required /></div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5D4037]">كلمة المرور</label>
                    <Input name="password" type="password" value={formData.password} onChange={handlers.handleInputChange} className="h-12 bg-zinc-50" placeholder="6 أحرف على الأقل (حروف وأرقام)" required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-[#D4AF37] hover:bg-[#B8941F] text-black font-black text-lg mt-2">{loading ? "جاري الإنشاء..." : "إنشاء حساب جديد"}</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-200" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-zinc-500 font-bold">أو باستخدام</span></div>
            </div>

            <Button type="button" onClick={() => handlers.loginWithGoogle()} disabled={loading} variant="outline" className="w-full h-12 border-2 border-zinc-200 hover:border-[#D4AF37] hover:bg-zinc-50 font-bold text-zinc-700 transition-all">
              <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H.18v2.84C2.27 21.59 6.8 24 12 24z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 6.8 1 2.27 3.41.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              المتابعة بحساب Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LandingPage({ onLogin }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LandingPageContent onLogin={onLogin} />
    </GoogleOAuthProvider>
  );
}
