import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ImageUploader from '../../components/admin/ImageUploader';
import { universityService } from '../../services/contentService';

const emptyForm = { name: '', shortName: '', location: '', website: '', affiliationType: 'Private', programs: '' };

export default function ManageUniversities() {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    universityService.getAllAdmin()
      .then((res) => setUniversities(res.data || []))
      .catch(() => toast.error('Failed to load universities'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({
      name: u.name, shortName: u.shortName || '', location: u.location || '',
      website: u.website || '', affiliationType: u.affiliationType,
      programs: (u.programs || []).join(', '),
    });
    setLogo(null);
  };

  const resetForm = () => { setForm(emptyForm); setLogo(null); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('University name is required');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logo) fd.append('logo', logo);

    setSaving(true);
    try {
      if (editingId) {
        await universityService.update(editingId, fd);
        toast.success('University updated');
      } else {
        await universityService.create(fd);
        toast.success('University added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save university');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await universityService.remove(deleteId);
      toast.success('University deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete university');
    }
  };

  const badgeColors = {
    Private: 'bg-navy/8 text-navy', State: 'bg-gold/10 text-gold',
    Central: 'bg-navy/8 text-navy', Deemed: 'bg-purple-50 text-purple-600', Autonomous: 'bg-teal/10 text-teal',
  };

  return (
    <div>
      <AdminHeader title="Universities" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-5">
        <div className="bg-white border border-[#E2DFD8] rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit University' : 'Add University'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader
              onFiles={(files) => setLogo(files[0])}
              previewUrl={editingId ? universities.find((u) => u._id === editingId)?.logoUrl : null}
              label="Logo — JPG, PNG, SVG, max 2MB"
            />
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Swami Vivekanand Subharti University"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Short Name</label>
              <input name="shortName" value={form.shortName} onChange={handleChange} placeholder="SVSU"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Meerut, Uttar Pradesh"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Affiliation Type</label>
              <select name="affiliationType" value={form.affiliationType} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white">
                <option>Private</option><option>State</option><option>Central</option><option>Deemed</option><option>Autonomous</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Programs (comma-separated)</label>
              <input name="programs" value={form.programs} onChange={handleChange} placeholder="MBA, BBA, BCA, MCA"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors flex-1">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors flex-1">
                {saving ? 'Saving...' : editingId ? 'Update University' : 'Add University'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8]">
            <h3 className="text-sm font-semibold">Universities ({universities.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E2DFD8]">
                  <th className="px-4 py-2.5">Logo</th>
                  <th className="px-4 py-2.5">Name</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Location</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                ) : universities.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No universities added yet.</td></tr>
                ) : (
                  universities.map((u) => (
                    <tr key={u._id} className="border-b border-[#E2DFD8] last:border-0 hover:bg-[#F8F7F4]">
                      <td className="px-4 py-2.5">
                        {u.logoUrl ? (
                          <img src={u.logoUrl} alt={u.shortName} className="w-8 h-8 rounded-md object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-navy flex items-center justify-center text-gold-light text-[10px] font-bold">
                            {u.shortName || u.name?.slice(0, 2)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{u.name}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${badgeColors[u.affiliationType] || 'bg-gray-100 text-gray-500'}`}>
                          {u.affiliationType}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">{u.location || '—'}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(u)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-navy">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(u._id)} className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-red-400 hover:bg-red-50">
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
        title="Delete University"
        message="Are you sure you want to delete this university? Its logo will also be removed."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
