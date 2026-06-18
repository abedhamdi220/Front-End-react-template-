import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useGoogleLogin } from '@react-oauth/google';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

export function useAuth(onLoginCallback) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return gmailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    return password.length >= minLength && hasLetters && hasNumbers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === "register") {
      if (!validateEmail(formData.email)) return toast.error("عذراً، التسجيل متاح فقط باستخدام بريد Gmail");
      if (!validatePassword(formData.password)) {
        return toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل وتحتوي على أحرف وأرقام");
      }
    }

    setLoading(true);
    try {
      const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload = authMode === "register" 
        ? { username: formData.username, email: formData.email, password: formData.password }
        : { username: formData.username, password: formData.password };

      const response = await axios.post(`${API}${endpoint}`, payload);
      
      toast.success(`تم ${authMode === "register" ? "إنشاء الحساب" : "تسجيل الدخول"} بنجاح!`);
      if (onLoginCallback) onLoginCallback(response.data.access_token, response.data.user);
      setShowAuth(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "حدث خطأ، يرجى التأكد من صحة البيانات والمحاولة مجدداً");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const response = await axios.post(`${API}/oauth/google`, { credential: tokenResponse.access_token });
        toast.success('تم تسجيل الدخول بنجاح بواسطة جوجل!');
        if (onLoginCallback) onLoginCallback(response.data.access_token, response.data.user);
        setShowAuth(false);
      } catch (error) { toast.error(error.response?.data?.detail || 'حدث خطأ أثناء تسجيل الدخول'); } 
      finally { setLoading(false); }
    },
    onError: () => toast.error('فشل الاتصال بخدمة جوجل، يرجى المحاولة مرة أخرى.')
  });

  return {
    state: { showAuth, authMode, loading, formData },
    handlers: { setShowAuth, setAuthMode, handleInputChange, handleSubmit, loginWithGoogle }
  };
}