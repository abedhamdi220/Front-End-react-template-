import React from "react";
import { Loader2 } from "lucide-react";
import { useDashboardState } from "../hooks/useDashboardState";
import Header from "../components/dashboard/Header";
import NavigationTabs from "../components/dashboard/NavigationTabs";
import DashboardModals from "../components/dashboard/DashboardModals";

// Views
import ShowcaseView from "../views/ShowcaseView";
import CustomizeView from "../views/CustomizeView";
import { GalleryView, OrdersView, ProfileView } from "../views/AccountViews";
import { WalletView, AddressesView, InvoicesView, CouponsView } from "../views/FinancialViews";

export default function Dashboard({ user, onLogout }) {
  const { state, handlers } = useDashboardState(user);

  const renderActiveView = () => {
    switch (state.activeView) {
      case "showcase": return <ShowcaseView showcaseDesigns={state.showcaseDesigns} setActiveView={handlers.setActiveView} setDesignStep={handlers.setDesignStep} setPrompt={handlers.setPrompt} />;
      case "customize": return <CustomizeView state={state} handlers={handlers} />;
      case "gallery": return <GalleryView designs={state.designs} handlers={handlers} />;
      case "orders": return <OrdersView orders={state.orders} handlers={handlers} />;
      case "profile": return <ProfileView state={state} handlers={handlers} />;
      case "wallet": return <WalletView wallet={state.wallet} transactions={state.transactions} />;
      case "addresses": return <AddressesView addresses={state.addresses} handlers={handlers} />;
      case "invoices": return <InvoicesView invoices={state.invoices} handlers={handlers} />;
      case "coupons": return <CouponsView coupons={state.availableCoupons} />;
      default: return <ShowcaseView showcaseDesigns={state.showcaseDesigns} setActiveView={handlers.setActiveView} setDesignStep={handlers.setDesignStep} setPrompt={handlers.setPrompt} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] via-[#E8DCC8] to-[#F5F0E8] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300 font-sans" dir="rtl" data-testid="dashboard-page">
      
      <Header 
        profileData={state.profileData} onLogout={onLogout} designsQuota={state.designsQuota} 
        unreadCount={state.unreadCount} notifications={state.notifications} 
        markNotificationAsRead={handlers.markNotificationAsRead} deleteNotification={handlers.deleteNotification} 
        markAllNotificationsAsRead={handlers.markAllNotificationsAsRead} setActiveView={handlers.setActiveView} 
        resetDesigner={handlers.resetDesigner} 
      />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <NavigationTabs activeView={state.activeView} setActiveView={handlers.setActiveView} designsCount={state.designs.length} ordersCount={state.orders.length} />
        
        {state.loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
            <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
            <p className="text-zinc-500 font-medium animate-pulse">جاري تجهيز الاستوديو...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderActiveView()}
          </div>
        )}
      </main>

      <DashboardModals state={state} handlers={handlers} />
    </div>
  );
}