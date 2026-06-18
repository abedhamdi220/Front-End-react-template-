import React, { useState } from "react";
import { Sparkles, Bell, Sun, Moon, LogOut, X, Clock, CheckCircle, Trash2, Wand2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { formatDate } from "../../config/constants";

export default function Header({ profileData, onLogout, designsQuota, unreadCount, notifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, setActiveView, resetDesigner }) {
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="glass border-b border-[#3E2723]/10 dark:border-zinc-800 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-4">
        
        {/* Logo & Welcome */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl shadow-lg flex-shrink-0 transform hover:rotate-12 transition-transform cursor-pointer" onClick={() => setActiveView("showcase")}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <h1 className="text-xl md:text-2xl font-black text-[#3E2723] dark:text-zinc-100 tracking-tight truncate">استوديو التصميم</h1>
            <p className="text-xs font-medium text-[#5D4037] dark:text-zinc-400 truncate opacity-80">أهلاً بك مجدداً، {profileData?.first_name || "يا صديقي"}</p>
          </div>
        </div>
        
        {/* Action Buttons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Designs Quota Badge */}
          {!designsQuota.is_unlimited && (
            <div className={`hidden sm:flex flex-col justify-center px-3 py-1.5 rounded-lg border backdrop-blur-sm transition-colors ${
              designsQuota.designs_remaining === 0 
                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' 
                : designsQuota.designs_remaining <= 3
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              <div className="text-xs font-black text-center whitespace-nowrap">
                {designsQuota.designs_remaining === 0 ? "نفد الرصيد" : (
                  <span className="flex items-center gap-1 justify-center">
                    <span>{designsQuota.designs_remaining}</span>
                    <span className="opacity-50 text-[10px]">/ {designsQuota.designs_limit}</span>
                  </span>
                )}
              </div>
              <div className="text-[9px] font-medium opacity-80 text-center uppercase tracking-wider">تصاميم متبقية</div>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <Button
              onClick={() => setShowNotifications(!showNotifications)}
              variant="outline"
              size="icon"
              className="border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white dark:hover:text-black relative h-10 w-10 rounded-full shadow-sm transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse">
                  {unreadCount > 9 ? '+9' : unreadCount}
                </span>
              )}
            </Button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setShowNotifications(false)} />
                <div className="fixed md:absolute top-16 md:top-auto bottom-0 md:bottom-auto left-0 right-0 md:left-auto md:right-0 md:mt-3 w-full md:w-96 glass dark:bg-zinc-900 border dark:border-zinc-800 rounded-t-3xl md:rounded-2xl shadow-2xl z-50 flex flex-col max-h-[85vh] md:max-h-[32rem] overflow-hidden transform transition-all animate-in slide-in-from-bottom-5 md:slide-in-from-top-2">
                  <div className="flex items-center justify-between p-4 border-b border-[#3E2723]/10 dark:border-zinc-800 bg-gradient-to-l from-[#D4AF37]/10 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#D4AF37]/20 rounded-lg">
                        <Bell className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <h3 className="font-bold text-[#3E2723] dark:text-zinc-100">مركز الإشعارات</h3>
                    </div>
                    <Button onClick={() => setShowNotifications(false)} variant="ghost" size="icon" className="h-8 w-8 rounded-full md:hidden text-zinc-500">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-2">
                    {notifications.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                          <Bell className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">صندوق الإشعارات فارغ</p>
                        <p className="text-xs text-zinc-400 mt-1">سنخبرك هنا بكل جديد يخص حسابك وطلباتك</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 rounded-xl cursor-pointer transition-all border border-transparent ${
                              !notif.is_read 
                                ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 shadow-sm' 
                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                            onClick={() => markNotificationAsRead(notif.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                              <div className="flex-1 min-w-0">
                                <h4 className={`text-sm mb-1 ${!notif.is_read ? 'font-bold text-[#3E2723] dark:text-zinc-100' : 'font-semibold text-zinc-700 dark:text-zinc-300'}`}>
                                  {notif.title}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2 line-clamp-2">{notif.message}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(notif.created_at)}
                                  </span>
                                  <button onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {unreadCount > 0 && (
                    <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <Button onClick={markAllNotificationsAsRead} variant="ghost" className="w-full text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10">
                        <CheckCircle className="w-4 h-4 ml-2" /> تحديد الكل كمقروء
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white dark:hover:text-black h-10 w-10 rounded-full transition-all"
            title="تبديل مظهر النظام"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Desktop Actions */}
          <Button
            onClick={() => { resetDesigner(); setActiveView("customize"); }}
            className="hidden lg:flex bg-gradient-to-l from-[#D4AF37] to-[#B8941F] hover:shadow-lg hover:shadow-[#D4AF37]/20 text-white dark:text-black font-bold h-10 px-5 rounded-full transition-all"
          >
            <Wand2 className="ml-2 w-4 h-4" /> تصميم جديد
          </Button>

          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 h-10 w-10 rounded-full"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
