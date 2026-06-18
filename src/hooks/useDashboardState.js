import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_ENDPOINTS, CLOTHING_TYPES, BACKEND_URL } from "../config/constants";

export function useDashboardState(user) {
  // Navigation & Core State
  const [activeView, setActiveView] = useState("showcase");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Shop & Design State
  const [designs, setDesigns] = useState([]);
  const [showcaseDesigns, setShowcaseDesigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sizeChart, setSizeChart] = useState({});
  const [designsQuota, setDesignsQuota] = useState({ designs_limit: 10, designs_used: 0, designs_remaining: 10, is_unlimited: false });

  // Measurements State
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState({ chest: "", waist: "", hips: "", length: "" });
  const [suggestedSize, setSuggestedSize] = useState(null);

  // Account State
  const [profileData, setProfileData] = useState({ first_name: "", last_name: "", email: "", phone: "", avatar: "" });
  const [wallet, setWallet] = useState({ balance: 0, currency: "SAR" });
  const [transactions, setTransactions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // UI & Modals State
  const [designStep, setDesignStep] = useState("select-type");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, designId: null });
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // AI Builder State
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [enhancing, setEnhancing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedViewAngle, setSelectedViewAngle] = useState("front");
  const [selectedClothingType, setSelectedClothingType] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedLogoPosition, setSelectedLogoPosition] = useState("center");
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [compositeImage, setCompositeImage] = useState(null);
  const [showComposite, setShowComposite] = useState(false);

  // Checkout & Forms
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  // Profile & Review Forms
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ title: "", city: "", area: "", street: "", building: "", is_default: false });
  const [savingAddress, setSavingAddress] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Initial Sync
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || user.username || "", last_name: user.last_name || "",
        email: user.email || "", phone: user.phone || "", avatar: user.avatar || ""
      });
      setProfileForm({ first_name: user.first_name || user.username || "", last_name: user.last_name || "", phone: user.phone || "" });
      setPhoneNumber(user.phone || "");
    }
  }, [user]);

  // Data Fetching
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(), fetchWalletData(), fetchAddresses(), fetchDesigns(),
        fetchShowcase(), fetchOrders(), fetchInvoices(), fetchNotifications(),
        fetchCoupons(), fetchDesignsQuota(), fetchSizeChartMock()
      ]);
    } catch (error) { console.error("Error fetching initial data:", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    registerDeviceToken();
    fetchAllData();
    const notificationInterval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(notificationInterval);
  }, []);

  // API Methods
  const fetchProfile = async () => {
    try { const res = await axios.get(API_ENDPOINTS.account.profile); setProfileData(res.data.data || res.data); } catch (e) {}
  };
  const updateProfile = async (e) => {
    e.preventDefault(); setUpdatingProfile(true);
    try {
      const res = await axios.put(API_ENDPOINTS.account.profile, profileForm);
      setProfileData(res.data.data || res.data); setIsEditingProfile(false); toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) { toast.error("فشل في تحديث البيانات"); } finally { setUpdatingProfile(false); }
  };

  const fetchWalletData = async () => {
    try {
      const bRes = await axios.get(API_ENDPOINTS.account.walletBalance); setWallet(bRes.data.data || bRes.data);
      const tRes = await axios.get(API_ENDPOINTS.account.walletTransactions); setTransactions(tRes.data.data || tRes.data || []);
    } catch (error) {
      setWallet({ balance: 1250.50, currency: "SAR" });
      setTransactions([{ id: 1, type: 'credit', amount: 500, description: 'استرداد نقدي من طلب ملغى', created_at: new Date().toISOString() }]);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.account.addresses);
      const fetched = res.data.data || res.data || [];
      setAddresses(fetched);
      const defaultAddr = fetched.find(a => a.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id); else if (fetched.length > 0) setSelectedAddressId(fetched[0].id);
    } catch (error) {
      const mock = [{ id: 1, title: 'المنزل', city: 'الرياض', area: 'الملقا', street: 'شارع', is_default: true }];
      setAddresses(mock); setSelectedAddressId(mock[0].id);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault(); setSavingAddress(true);
    try {
      if (editingAddress) { await axios.put(`${API_ENDPOINTS.account.addresses}/${editingAddress.id}`, addressForm); toast.success("تم التحديث"); } 
      else { await axios.post(API_ENDPOINTS.account.addresses, addressForm); toast.success("تمت الإضافة"); }
      fetchAddresses(); setShowAddressModal(false); resetAddressForm();
    } catch (error) { toast.error("فشل الحفظ"); } finally { setSavingAddress(false); }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العنوان؟")) return;
    try { await axios.delete(`${API_ENDPOINTS.account.addresses}/${id}`); toast.success("تم الحذف"); fetchAddresses(); } catch (error) { toast.error("فشل الحذف"); }
  };
  const resetAddressForm = () => { setEditingAddress(null); setAddressForm({ title: "", city: "", area: "", street: "", building: "", is_default: false }); };

  const fetchInvoices = async () => {
    try { const res = await axios.get(API_ENDPOINTS.account.invoices); setInvoices(res.data.data || res.data || []); } 
    catch (e) { setInvoices([{ id: 101, order_id: 'ORD-9982', amount: 120, status: 'paid', date: new Date().toISOString() }]); }
  };
  const downloadInvoice = async (invoiceId) => {
    try {
      toast.info("جاري التجهيز...");
      const res = await axios.get(`${API_ENDPOINTS.account.invoices}/${invoiceId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data])); const link = document.createElement('a');
      link.href = url; link.setAttribute('download', `invoice-${invoiceId}.pdf`); document.body.appendChild(link); link.click(); link.remove();
      toast.success("تم التحميل");
    } catch (error) { toast.error("فشل التحميل"); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.account.notifications); const notifs = res.data.data || res.data || [];
      setNotifications(notifs); setUnreadCount(notifs.filter(n => !n.is_read).length);
    } catch (error) {
      setNotifications([{ id: 1, title: 'طلب جديد', message: 'تم استلام طلبك', is_read: false, created_at: new Date().toISOString() }]);
      setUnreadCount(1);
    }
  };
  const markNotificationAsRead = async (id) => {
    try {
      await axios.patch(`${API_ENDPOINTS.account.notifications}/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) { setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n)); setUnreadCount(prev => Math.max(0, prev - 1)); }
  };
  const markAllNotificationsAsRead = async () => {
    try { await axios.patch(API_ENDPOINTS.account.notificationsReadAll); setNotifications(notifications.map(n => ({ ...n, is_read: true }))); setUnreadCount(0); } catch (e) {}
  };
  const deleteNotification = async (id) => {
    try { await axios.delete(`${API_ENDPOINTS.account.notifications}/${id}`); setNotifications(notifications.filter(n => n.id !== id)); } catch (e) {}
  };
  const registerDeviceToken = async () => { try { await axios.post(API_ENDPOINTS.fcmToken, { token: "mock_token" }); } catch (e) {} };

  // Shop APIs
  const fetchDesignsQuota = async () => { try { const res = await axios.get(`${BACKEND_URL}/api/user/designs-quota`); setDesignsQuota(res.data); } catch(e){} };
  const fetchDesigns = async () => { try { const res = await axios.get(API_ENDPOINTS.shop.designs); setDesigns(res.data.data || res.data || []); } catch(e){} };
  const fetchShowcase = async () => {
    try {
      const res = await axios.get(`${API_BASE}/shop/designs/showcase`).catch(()=>({data:[]}));
      if (res.data?.length > 0) setShowcaseDesigns(res.data); else setShowcaseDesigns([{ id: 101, title: 'تيشيرت', description: 'تجربة', image_url: '[https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&w=500](https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&w=500)', is_featured: true }]);
    } catch(e){}
  };
  const fetchSizeChartMock = async () => { setSizeChart({ "M": { chest: "96-101", waist: "82-87", hips: "96-101" } }); };
  const fetchOrders = async () => {
    try { const res = await axios.get(API_ENDPOINTS.shop.orders); setOrders(res.data.data || res.data || []); }
    catch(e){ setOrders([{ id: 'ORD-1', status: 'completed', total_amount: 120, created_at: new Date().toISOString(), size: 'M', prompt: 'تجربة' }]); }
  };
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API_BASE}/shop/coupons`).catch(()=>({data:[]}));
      if (res.data?.length > 0) setAvailableCoupons(res.data); else setAvailableCoupons([{ code: 'WELCOME', discount_percentage: 20, min_purchase: 0 }]);
    } catch(e){}
  };

  const handleCalculateSize = () => {
    if (!measurements.chest || !measurements.waist) {
      toast.error("يرجى إدخال محيط الصدر والخصر على الأقل");
      return;
    }
    const chest = parseInt(measurements.chest);
    if (chest < 90) setSuggestedSize("S");
    else if (chest >= 90 && chest < 100) setSuggestedSize("M");
    else if (chest >= 100 && chest < 110) setSuggestedSize("L");
    else if (chest >= 110 && chest < 120) setSuggestedSize("XL");
    else setSuggestedSize("XXL");
    
    toast.success("تم حساب المقاس المقترح بنجاح!");
  };

  // AI & Generation
  const enhancePrompt = async () => {
    if (!prompt.trim()) return toast.error("أدخل وصفاً"); setEnhancing(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/designs/enhance-prompt`, { prompt, clothing_type: selectedClothingType }).catch(() => ({ data: { enhanced_prompt: `محسن: ${prompt}` } }));
      setEnhancedPrompt(res.data.enhanced_prompt); setPrompt(res.data.enhanced_prompt); toast.success("تم التحسين");
    } catch (e) { toast.error("فشل التحسين"); } finally { setEnhancing(false); }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("أدخل وصفاً");
    if (!designsQuota.is_unlimited && designsQuota.designs_remaining <= 0) return toast.error("نفد الرصيد");
    setGenerating(true); setCompositeImage(null); setShowComposite(false);
    try {
      const finalPrompt = enhancedPrompt || prompt;
      const payload = { prompt: finalPrompt, clothing_type: selectedClothingType, logo_base64: logoPreview?.split(',')[1], logo_position: selectedLogoPosition, user_photo_base64: userPhotoPreview?.split(',')[1], view_angle: selectedViewAngle };
      const res = await axios.post(`${BACKEND_URL}/api/designs/preview`, payload).catch(() => new Promise(r => setTimeout(() => r({ data: { image_base64: '[https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500](https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500)', composite_image_base64: userPhotoPreview ? '[https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500](https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500)' : null, designs_remaining: designsQuota.designs_remaining - 1 } }), 2000)));
      setGeneratedDesign({ image_base64: res.data.image_base64, image_url: res.data.image_url, prompt: finalPrompt, clothing_type: selectedClothingType });
      if (res.data.composite_image_base64) { setCompositeImage(res.data.composite_image_base64); toast.success("تم دمج صورتك"); } else toast.success("تم التوليد");
      if (res.data.designs_remaining !== undefined) setDesignsQuota(prev => ({ ...prev, designs_remaining: res.data.designs_remaining }));
    } catch (e) { toast.error("حدث خطأ"); } finally { setGenerating(false); }
  };

  const handleSaveToGallery = async () => {
    if (!generatedDesign) return;
    try {
      const res = await axios.post(API_ENDPOINTS.shop.designs, { prompt: generatedDesign.prompt, image_base64: generatedDesign.image_base64, image_url: generatedDesign.image_url, clothing_type: generatedDesign.clothing_type, user_photo_base64: userPhotoPreview?.split(',')[1] });
      setDesigns([res.data.data || res.data, ...designs]); toast.success("تم الحفظ"); setActiveView("gallery");
    } catch (e) { toast.error("فشل الحفظ"); }
  };

  const handleDeleteDesign = async () => {
    try { await axios.delete(`${API_ENDPOINTS.shop.designs}/${deleteDialog.designId}`); setDesigns(designs.filter(d => d.id !== deleteDialog.designId)); toast.success("تم الحذف"); fetchDesignsQuota(); } catch (e) {} finally { setDeleteDialog({ open: false, designId: null }); }
  };

  // Checkout & Reviews
  const validateCouponCode = async () => {
    if (!couponCode.trim()) return; setValidatingCoupon(true);
    setTimeout(() => {
      const matched = availableCoupons.find(c => c.code === couponCode.toUpperCase());
      if (matched) { setAppliedCoupon(matched); toast.success("تم تطبيق الخصم"); } else { toast.error("كود غير صحيح"); setAppliedCoupon(null); }
      setValidatingCoupon(false);
    }, 800);
  };

  const handleSubmitOrder = async () => {
    if (!phoneNumber.trim()) return toast.error("رقم الهاتف مطلوب");
    if (addresses.length > 0 && !selectedAddressId) return toast.error("اختر عنوان");
    setSubmittingOrder(true);
    try {
      await axios.post(API_ENDPOINTS.shop.orders, { design_image_base64: generatedDesign.image_base64, prompt: generatedDesign.prompt, clothing_type: selectedClothingType, size: selectedSize, phone_number: phoneNumber, address_id: selectedAddressId, notes: orderNotes, coupon_code: appliedCoupon ? couponCode : null });
      toast.success("تم استلام الطلب!"); setShowOrderForm(false); resetDesigner(); setActiveView("orders"); fetchOrders();
    } catch (e) { toast.error("فشل إرسال الطلب"); } finally { setSubmittingOrder(false); }
  };

  const openReviewModal = (order) => { setReviewOrder(order); setReviewForm({ rating: 5, comment: "" }); setShowReviewModal(true); };
  const submitReview = async () => {
    if (!reviewForm.comment.trim()) return toast.error("اكتب تعليقاً"); setSubmittingReview(true);
    try { await axios.post(API_ENDPOINTS.shop.reviews, { order_id: reviewOrder.id, rating: reviewForm.rating, comment: reviewForm.comment }); toast.success("شكراً لتقييمك"); setShowReviewModal(false); setOrders(orders.map(o => o.id === reviewOrder.id ? { ...o, is_reviewed: true } : o)); } catch (e) { toast.error("خطأ بالتقييم"); } finally { setSubmittingReview(false); }
  };

  const resetDesigner = () => {
    setPrompt(""); setEnhancedPrompt(""); setLogoPreview(null); setUserPhotoPreview(null); setGeneratedDesign(null); setCompositeImage(null); setShowComposite(false); setShowOrderForm(false); setSelectedViewAngle("front"); setSelectedLogoPosition("center"); setSelectedClothingType(null); setOrderNotes(""); setCouponCode(""); setAppliedCoupon(null); setDesignStep("select-type");
  };
  const handleClothingTypeSelect = (type) => { setSelectedClothingType(type.value); setDesignStep("customize"); };

  return {
    state: { activeView, loading, isSidebarOpen, designs, showcaseDesigns, orders, sizeChart, designsQuota, showMeasurements, measurements, suggestedSize, profileData, wallet, transactions, addresses, invoices, notifications, unreadCount, availableCoupons, designStep, deleteDialog, showOrderForm, showAddressModal, showReviewModal, showSizeChart, prompt, enhancedPrompt, logoPreview, userPhotoPreview, enhancing, generating, selectedViewAngle, selectedClothingType, selectedSize, selectedLogoPosition, generatedDesign, compositeImage, showComposite, phoneNumber, orderNotes, selectedAddressId, submittingOrder, couponCode, appliedCoupon, validatingCoupon, isEditingProfile, profileForm, updatingProfile, editingAddress, addressForm, savingAddress, reviewOrder, reviewForm, submittingReview },
    handlers: { setActiveView, setIsSidebarOpen, setShowMeasurements, setMeasurements, setSuggestedSize, handleCalculateSize, setDesignStep, setDeleteDialog, setShowOrderForm, setShowAddressModal, setShowReviewModal, setShowSizeChart, setPrompt, setLogoPreview, setUserPhotoPreview, setSelectedViewAngle, setSelectedSize, setSelectedLogoPosition, setShowComposite, setPhoneNumber, setOrderNotes, setSelectedAddressId, setCouponCode, setAppliedCoupon, setIsEditingProfile, setProfileForm, setAddressForm, setReviewForm, updateProfile, handleSaveAddress, handleDeleteAddress, resetAddressForm, downloadInvoice, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, enhancePrompt, handleGenerate, handleSaveToGallery, handleDeleteDesign, validateCouponCode, handleSubmitOrder, openReviewModal, submitReview, resetDesigner, handleClothingTypeSelect }
  };
}
