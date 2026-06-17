import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { centerService } from '../../services/contentService';

const emptyForm = { name: '', address: '', city: '', phone: '', email: '', mapEmbedUrl: '', isActive: true };

export default function ManageCenters() {
  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    centerService.getAllAdmin()
      .then((res) => setCenters(res.data || []))
      .catch(() => toast.error('Failed to load centers'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setForm({
      name: c.name, address: c.address, city: c.city || '', phone: c.phone || '',
      email: c.email || '', mapEmbedUrl: c.mapEmbedUrl || '', isActive: c.isActive,
    });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      toast.error('Name and address are required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await centerService.update(editingId, form);
        toast.success('Center updated');
      } else {
        await centerService.create(form);
        toast.success('Center added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save center');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await centerService.remove(deleteId);
      toast.success('Center deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete center');
    }
  };

  return (
    <div>
      <AdminHeader title="Centers" />
      <div className="p-6">
        <form onSubmit={handleSubmit} className="bg-white border border-[#E2DFD8] rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit Center' : 'Add New Center'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Center Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="SCEC Allahabad — Main Campus"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">City</label>
              <input name="city" value={form.city} onChange={handleChange} placeholder="Prayagraj"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Civil Lines, Prayagraj, Uttar Pradesh"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91-XXXXXXXXXX"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="info@scecallahabad.com"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Google Maps Embed URL</label>
              <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
              <p className="text-[11px] text-gray-400 mt-1">Get this from Google Maps → Share → Embed a map → copy the src URL from the iframe code.</p>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-teal w-4 h-4" />
                Active
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
              {saving ? 'Saving...' : editingId ? 'Update Center' : 'Add Center'}
            </button>
          </div>
        </form>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8]">
            <h3 className="text-sm font-semibold">All Centers ({centers.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E2DFD8]">
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">City</th>
                  <th className="px-4 py-2.5">Phone</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                ) : centers.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No centers added yet.</td></tr>
                ) : (
                  centers.map((c) => (
                    <tr key={c._id} className="border-b border-[#E2DFD8] last:border-0 hover:bg-[#F8F7F4]">
                      <td className="px-4 py-2.5 font-medium">{c.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{c.city || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{c.phone || '—'}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${c.isActive ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-500'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(c)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-navy">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(c._id)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-red-400 hover:bg-red-50">
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
        title="Delete Center"
        message="Are you sure you want to delete this center?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
