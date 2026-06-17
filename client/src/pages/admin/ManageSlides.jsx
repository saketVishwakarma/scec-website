import { useEffect, useState } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import { slideService } from '../../services/contentService';

const emptyForm = { title: '', subtitle: '', linkUrl: '', isActive: true };

export default function ManageSlides() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const load = () => {
    setLoading(true);
    slideService.getAllAdmin()
      .then((res) => setSlides(res.data || []))
      .catch(() => toast.error('Failed to load slides'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (slide) => {
    setEditingId(slide._id);
    setForm({ title: slide.title || '', subtitle: slide.subtitle || '', linkUrl: slide.linkUrl || '', isActive: slide.isActive });
    setFile(null);
  };

  const resetForm = () => { setForm(emptyForm); setFile(null); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !file) {
      toast.error('Please select an image for the new slide');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);

    setSaving(true);
    try {
      if (editingId) {
        await slideService.update(editingId, fd);
        toast.success('Slide updated');
      } else {
        await slideService.create(fd);
        toast.success('Slide added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save slide');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await slideService.remove(deleteId);
      toast.success('Slide deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete slide');
    }
  };

  // ── Drag to reorder ──────────────────────────────────────────
  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (index) => {
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    setSlides(reordered);
    setDragIndex(null);

    const order = reordered.map((s, i) => ({ id: s._id, order: i }));
    try {
      await slideService.reorder(order);
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
      load();
    }
  };

  return (
    <div>
      <AdminHeader title="Hero Slides" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-5">
        <div className="bg-white border border-[#E2DFD8] rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit Slide' : 'Add New Slide'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader
              onFiles={(files) => setFile(files[0])}
              previewUrl={editingId ? slides.find((s) => s._id === editingId)?.imageUrl : null}
              label="JPG, PNG, WebP — max 5MB"
            />
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Slide Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Admission Open 2025"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Enroll in your dream course today"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Link URL</label>
              <input name="linkUrl" value={form.linkUrl} onChange={handleChange} placeholder="/courses or /enquiry"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-teal w-4 h-4" />
              Active
            </label>
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors flex-1">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors flex-1">
                {saving ? 'Saving...' : editingId ? 'Update Slide' : 'Add Slide'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Slides (drag to reorder)</h3>
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
          ) : slides.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No slides added yet.</p>
          ) : (
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="bg-[#F8F7F4] border border-[#E2DFD8] rounded-lg p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical size={16} className="text-gray-400 flex-shrink-0" />
                  <img src={slide.imageUrl} alt={slide.title} className="w-20 h-12 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{slide.title || 'Untitled'}</div>
                    <div className="text-xs text-gray-400 truncate">{slide.subtitle}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium flex-shrink-0 ${slide.isActive ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-500'}`}>
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleEdit(slide)} className="w-7 h-7 border border-[#E2DFD8] rounded-md bg-white flex items-center justify-center hover:border-navy">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteId(slide._id)} className="w-7 h-7 border border-[#E2DFD8] rounded-md bg-white flex items-center justify-center hover:border-red-400 hover:bg-red-50">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Slide"
        message="Are you sure you want to delete this slide? The image will be permanently removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
