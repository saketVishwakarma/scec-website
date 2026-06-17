import { useEffect, useState } from 'react';
import { Pencil, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import { galleryService } from '../../services/contentService';

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('General');
  const [caption, setCaption] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    const params = filter !== 'All' ? { category: filter } : {};
    galleryService.getAll(params)
      .then((res) => setImages(res.data || []))
      .catch(() => toast.error('Failed to load gallery'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);
  useEffect(() => {
    galleryService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    fd.append('category', category || 'General');
    fd.append('caption', caption);

    setUploading(true);
    try {
      const res = await galleryService.upload(fd);
      toast.success(`${res.count} image(s) uploaded`);
      setCaption('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const selectAll = () => setSelected(images.map((i) => i._id));
  const clearSelection = () => setSelected([]);

  const confirmBulkDelete = async () => {
    try {
      await galleryService.bulkDelete(selected);
      toast.success(`${selected.length} image(s) deleted`);
      setSelected([]);
      setBulkDeleteOpen(false);
      load();
    } catch {
      toast.error('Failed to delete images');
    }
  };

  const confirmSingleDelete = async () => {
    try {
      await galleryService.remove(singleDeleteId);
      toast.success('Image deleted');
      setSingleDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const handleSaveCaption = async (id, newCaption, newCategory) => {
    try {
      await galleryService.update(id, { caption: newCaption, category: newCategory });
      toast.success('Updated');
      setEditing(null);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <AdminHeader title="Gallery" />
      <div className="p-6">
        <div className="bg-white border border-[#E2DFD8] rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4">Upload New Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Events, Campus, Convocation..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Caption (optional, applied to all uploaded)</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Annual Convocation 2025"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
          </div>
          <ImageUploader onFiles={handleUpload} multiple label="JPG, PNG, WebP — up to 10 files, 5MB each" />
          {uploading && <p className="text-xs text-navy mt-2">Uploading...</p>}
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold">Gallery ({images.length} photos)</h3>
            <div className="flex items-center gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="text-xs border border-[#E2DFD8] rounded-md px-2 py-1.5 bg-[#F8F7F4]">
                <option value="All">All</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {selected.length > 0 ? (
                <>
                  <button onClick={clearSelection} className="text-xs px-3 py-1.5 rounded-md bg-[#F8F7F4] hover:bg-[#E2DFD8]">
                    Clear ({selected.length})
                  </button>
                  <button onClick={() => setBulkDeleteOpen(true)} className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-100">
                    Delete Selected
                  </button>
                </>
              ) : (
                images.length > 0 && (
                  <button onClick={selectAll} className="text-xs px-3 py-1.5 rounded-md bg-[#F8F7F4] hover:bg-[#E2DFD8]">
                    Select All
                  </button>
                )
              )}
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-[#F8F7F4] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : images.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No photos uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div key={img._id} className="relative group rounded-lg overflow-hidden aspect-[4/3] bg-navy">
                    <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleSelect(img._id)}
                      className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selected.includes(img._id) ? 'bg-navy border-navy' : 'bg-white/80 border-white'
                      }`}
                    >
                      {selected.includes(img._id) && <Check size={12} className="text-white" />}
                    </button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button onClick={() => setEditing(img)} className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setSingleDeleteId(img._id)} className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                        <Trash2 size={13} className="text-red-500" />
                      </button>
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                        <span className="text-white text-[11px] truncate block">{img.caption}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <EditCaptionModal
          image={editing}
          onSave={handleSaveCaption}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmModal
        open={bulkDeleteOpen}
        title="Delete Selected Images"
        message={`Are you sure you want to delete ${selected.length} image(s)? This cannot be undone.`}
        onConfirm={confirmBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
      <ConfirmModal
        open={!!singleDeleteId}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        onConfirm={confirmSingleDelete}
        onCancel={() => setSingleDeleteId(null)}
      />
    </div>
  );
}

function EditCaptionModal({ image, onSave, onClose }) {
  const [caption, setCaption] = useState(image.caption || '');
  const [category, setCategory] = useState(image.category || 'General');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl">
        <h3 className="text-[15px] font-semibold mb-4">Edit Image Details</h3>
        <img src={image.imageUrl} alt={caption} className="w-full h-32 object-cover rounded-lg mb-4" />
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Caption</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm bg-[#F8F7F4] hover:bg-[#E2DFD8]">Cancel</button>
          <button onClick={() => onSave(image._id, caption, category)} className="px-4 py-2 rounded-lg text-sm bg-navy text-white hover:bg-navy-light">Save</button>
        </div>
      </div>
    </div>
  );
}
