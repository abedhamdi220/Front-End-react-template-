import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/admin/showcase-designs`;

export function useShowcase(token) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const initialFormState = { title: "", description: "", prompt: "", clothing_type: "shirt", color: "", image_base64: "", tags: [], is_featured: false };
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const fetchDesigns = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}?page=${page}`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.data) {
        setDesigns(response.data.data);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.last_page || 1);
      } else {
        setDesigns(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) { toast.error("فشل في تحميل التصاميم"); setDesigns([]); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDesigns(currentPage); }, [currentPage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجا");
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_base64: reader.result.split(',')[1] });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingDesign) {
        await axios.put(`${API}/${editingDesign.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("تم تحديث التصميم بنجاح");
      } else {
        await axios.post(API, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("تم إضافة التصميم بنجاح");
      }
      fetchDesigns(currentPage); handleCloseDialog();
    } catch (error) { toast.error(error.response?.data?.detail || "حدث خطأ"); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التصميم؟")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم حذف التصميم بنجاح");
      if (designs.length === 1 && currentPage > 1) setCurrentPage(prev => prev - 1);
      else fetchDesigns(currentPage);
    } catch (error) { toast.error("فشل في حذف التصميم"); }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await axios.put(`${API}/${id}/toggle-featured`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("تم تحديث حالة التصميم"); fetchDesigns(currentPage);
    } catch (error) { toast.error("فشل في تحديث الحالة"); }
  };

  const handleEdit = (design) => {
    setEditingDesign(design);
    setFormData({
      title: design.title, description: design.description, prompt: design.prompt,
      clothing_type: design.clothing_type, color: design.color || "", image_base64: "",
      tags: design.tags || [], is_featured: design.is_featured
    });
    const imgSrc = design.image_url || (design.image_base64 ? `data:image/png;base64,${design.image_base64}` : null);
    setImagePreview(imgSrc); setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false); setEditingDesign(null); setFormData(initialFormState); setImagePreview(null); setTagInput("");
  };

  return {
    state: { designs: Array.isArray(designs) ? designs : [], loading, showDialog, editingDesign, currentPage, totalPages, formData, imagePreview, tagInput },
    handlers: { setCurrentPage, handleImageUpload, handleAddTag, handleRemoveTag, handleSubmit, handleDelete, handleToggleFeatured, handleEdit, handleCloseDialog, setShowDialog, setFormData, setTagInput }
  };
}
