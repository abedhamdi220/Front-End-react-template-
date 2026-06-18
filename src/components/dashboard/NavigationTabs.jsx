import React from "react";
import { TrendingUp, Wand2, Image as ImageIcon, Package, Wallet, User, MapPin, Receipt, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function NavigationTabs({ activeView, setActiveView, designsCount, ordersCount }) {
  const tabs = [
    { id: "showcase", label: "الرئيسية", icon: TrendingUp },
    { id: "customize", label: "ابتكر تصميم", icon: Wand2 },
    { id: "gallery", label: `معرضي (${designsCount})`, icon: ImageIcon },
    { id: "orders", label: `طلباتي (${ordersCount})`, icon: Package },
    { id: "wallet", label: "المحفظة", icon: Wallet },
    { id: "profile", label: "حسابي", icon: User },
  ];

  return (
    <div className="glass dark:bg-zinc-900/60 rounded-2xl p-2 mb-8 overflow-x-auto hide-scrollbar border border-white/20 dark:border-zinc-800/50 shadow-sm">
      <div className="flex gap-2 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center px-5 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
              activeView === tab.id
                ? "bg-[#D4AF37] text-white dark:text-zinc-950 shadow-md shadow-[#D4AF37]/20 transform scale-[1.02]"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-[#3E2723] dark:hover:text-zinc-200"
            }`}
          >
            <tab.icon className={`ml-2 w-4 h-4 ${activeView === tab.id ? 'animate-pulse' : ''}`} />
            {tab.label}
          </button>
        ))}
        
        {/* قائمة منسدلة للمزيد في الشاشات الكبيرة مع الأيقونات كاملة كما في الأصل */}
        <div className="hidden lg:flex items-center border-r border-zinc-300 dark:border-zinc-700 pr-2 mr-2">
            <Select value={activeView} onValueChange={setActiveView}>
              <SelectTrigger className="w-[140px] border-none bg-transparent font-bold text-zinc-600 dark:text-zinc-400 focus:ring-0">
                <SelectValue placeholder="المزيد..." />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl">
                <SelectItem value="addresses">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> العناوين</div>
                </SelectItem>
                <SelectItem value="invoices">
                  <div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-[#D4AF37]" /> الفواتير</div>
                </SelectItem>
                <SelectItem value="coupons">
                  <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-[#D4AF37]" /> الكوبونات</div>
                </SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>
    </div>
  );
}
