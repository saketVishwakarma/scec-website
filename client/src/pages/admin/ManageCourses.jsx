import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { courseService } from '../../services/contentService';

const emptyForm = { name: '', category: 'Other', duration: '', level: '', university: '', description: '', isActive: true };

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('All');

  const load = () => {
    setLoading(true);
    courseService.getAllAdmin()
      .then((res) => setCourses(res.data || []))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    courseService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      name: course.name, category: course.category, duration: course.duration || '',
      level: course.level || '', university: course.university || '',
      description: course.description || '', isActive: course.isActive,
    });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error('Course name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await courseService.update(editingId, form);
        toast.success('Course updated');
      } else {
        await courseService.create(form);
        toast.success('Course added');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await courseService.remove(deleteId);
      toast.success('Course deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const filtered = filter === 'All' ? courses : courses.filter((c) => c.category === filter);

  return (
    <div>
      <AdminHeader title="Courses" />
      <div className="p-6">
        <form onSubmit={handleSubmit} className="bg-white border border-[#E2DFD8] rounded-xl p-5 mb-5">
          <h3 className="text-sm font-semibold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Course Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. BCA"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Duration</label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 3 Years"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Level</label>
              <input name="level" value={form.level} onChange={handleChange} placeholder="e.g. Bachelor, Diploma"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">University / Affiliation</label>
              <input name="university" value={form.university} onChange={handleChange} placeholder="e.g. Subharti University"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="accent-teal w-4 h-4" />
                Active
              </label>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Brief course description..."
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : editingId ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between">
            <h3 className="text-sm font-semibold">All Courses ({filtered.length})</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="text-xs border border-[#E2DFD8] rounded-md px-2 py-1.5 bg-[#F8F7F4]">
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E2DFD8]">
                  <th className="px-4 py-2.5">Course Name</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5">Duration</th>
                  <th className="px-4 py-2.5">University</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No courses found.</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c._id} className="border-b border-[#E2DFD8] last:border-0 hover:bg-[#F8F7F4]">
                      <td className="px-4 py-2.5 font-medium">{c.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{c.category}</td>
                      <td className="px-4 py-2.5 text-gray-500">{c.duration || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500">{c.university || '—'}</td>
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
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
