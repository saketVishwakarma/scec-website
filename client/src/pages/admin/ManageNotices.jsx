import { useEffect, useState } from 'react';
import { Pencil, Trash2, Pin } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { noticeService } from '../../services/contentService';

const emptyForm = { title: '', body: '', category: '', expiresAt: '', isActive: true, pinned: false };

export default function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    noticeService.getAllAdmin()
      .then((res) => setNotices(res.data || []))
      .catch(() => toast.error('Failed to load notices'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      body: notice.body,
      category: notice.category || '',
      expiresAt: notice.expiresAt ? notice.expiresAt.slice(0, 10) : '',
      isActive: notice.isActive,
      pinned: notice.pinned,
    });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) {
      toast.error('Title and body are required');
      return;
    }
    setSaving(true);
    const payload = { ...form, expiresAt: form.expiresAt || null };
    try {
      if (editingId) {
        await noticeService.update(editingId, payload);
        toast.success('Notice updated');
      } else {
        await noticeService.create(payload);
        toast.success('Notice created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save notice');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await noticeService.remove(deleteId);
      toast.success('Notice deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div>
      <AdminHeader title="Manage Notices" />
      <div className="p-6">
        <form onSubmit={handleSubmit} className="bg-white border border-[#E2DFD8] rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit Notice' : 'Add New Notice'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Notice Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Result declared — Subharti University"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Category / University</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. O Level, CCC, Subharti..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Notice Body</label>
              <textarea name="body" value={form.body} onChange={handleChange} rows={3} placeholder="Write the notice content here..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Expires On (optional)</label>
              <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="flex items-end gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-teal w-4 h-4" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="pinned" checked={form.pinned} onChange={handleChange} className="accent-gold w-4 h-4" />
                Pinned
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : editingId ? 'Update Notice' : 'Save Notice'}
            </button>
          </div>
        </form>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8]">
            <h3 className="text-sm font-semibold">All Notices ({notices.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E2DFD8]">
                  <th className="px-4 py-2.5">Title</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Pinned</th>
                  <th className="px-4 py-2.5">Expires</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                ) : notices.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No notices yet.</td></tr>
                ) : (
                  notices.map((n) => (
                    <tr key={n._id} className="border-b border-[#E2DFD8] last:border-0 hover:bg-[#F8F7F4]">
                      <td className="px-4 py-2.5 font-medium max-w-xs truncate">{n.title}</td>
                      <td className="px-4 py-2.5 text-gray-500">{n.category}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${n.isActive ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-500'}`}>
                          {n.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{n.pinned && <Pin size={14} className="text-gold" />}</td>
                      <td className="px-4 py-2.5 text-gray-400 text-xs">
                        {n.expiresAt ? new Date(n.expiresAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(n)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-navy">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(n._id)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-red-400 hover:bg-red-50">
                            <Trash2 size={13} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
