import React from "react";
import { Award, Bell } from "lucide-react";
import { Button } from "./ui/UIComponents";

export default function AdminHeader({ user, notifications, onLogout, setActiveTab }) {
  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-[#3E2723]/10 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3E2723]">لوحة التحكم المتقدمة</h1>
            <p className="text-sm text-[#5D4037]">مرحباً، {user?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setActiveTab('notifications')} className="relative">
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read_at).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Button>
          <Button onClick={onLogout} variant="outline" className="border-[#3E2723]/20">
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </header>
  );
}
