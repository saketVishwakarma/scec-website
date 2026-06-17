import { useEffect, useState } from 'react';
import { Pencil, Trash2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { userService } from '../../services/contentService';
import { useAuthStore } from '../../store/authStore';

const emptyForm = { name: '', email: '', password: '', role: 'admin' };

export default function ManageUsers() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers]     = useState([]);
  const [form, setForm]       = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [resetModal, setResetModal] = useState(null); // { id, name }
  const [newPass, setNewPass] = useState('');

  const load = () => {
    setLoading(true);
    userService.getAll()
      .then((res) => setUsers(res.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }
    if (!editingId && form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await userService.update(editingId, { name: form.name, role: form.role });
        toast.success('User updated');
      } else {
        await userService.create(form);
        toast.success('Admin user created');
      }
      resetForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await userService.remove(deleteId);
      toast.success('User deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async () => {
    if (newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await userService.resetPassword(resetModal.id, newPass);
      toast.success('Password reset successfully');
      setResetModal(null);
      setNewPass('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const roleBadge = (role) =>
    role === 'superadmin'
      ? 'bg-navy/8 text-navy'
      : 'bg-gold/10 text-gold';

  return (
    <div>
      <AdminHeader title="Admin Users" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">

        {/* ── Form ── */}
        <div className="bg-white border border-[#E2DFD8] rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">
            {editingId ? 'Edit User' : 'Add Admin User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <input
                name="name" value={form.name} onChange={handleChange} required
                placeholder="Admin Name"
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input
                name="email" value={form.email} onChange={handleChange} required
                type="email" placeholder="admin@scecallahabad.com"
                disabled={!!editingId}
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white disabled:opacity-50"
              />
            </div>
            {!editingId && (
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                <input
                  name="password" value={form.password} onChange={handleChange}
                  type="password" placeholder="Min. 8 characters"
                  className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Role</label>
              <select
                name="role" value={form.role} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white"
              >
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
            <div className="flex gap-2">
              {editingId && (
                <button type="button" onClick={resetForm}
                  className="flex-1 px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors">
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E2DFD8]">
            <h3 className="text-sm font-semibold">Admin Users ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E2DFD8]">
                  <th className="px-4 py-2.5">User</th>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Last Login</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b border-[#E2DFD8] last:border-0 hover:bg-[#F8F7F4]">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy text-gold-light flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {u.name?.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium truncate max-w-[100px]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${roleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">
                        {u.lastLogin
                          ? new Date(u.lastLogin).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : 'Never'}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${u.isActive ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-500'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(u)}
                            className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-navy"
                            title="Edit">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => { setResetModal({ id: u._id, name: u.name }); setNewPass(''); }}
                            className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-gold"
                            title="Reset Password">
                            <KeyRound size={13} className="text-gold" />
                          </button>
                          {currentUser?._id !== u._id && (
                            <button onClick={() => setDeleteId(u._id)}
                              className="w-7 h-7 border border-[#E2DFD8] rounded-md flex items-center justify-center hover:border-red-400 hover:bg-red-50"
                              title="Delete">
                              <Trash2 size={13} className="text-red-500" />
                            </button>
                          )}
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

      {/* ── Delete modal ── */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Admin User"
        message="Are you sure? This user will permanently lose access to the admin panel."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* ── Reset password modal ── */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl">
            <h3 className="text-[15px] font-semibold mb-1">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">Set a new password for <strong>{resetModal.name}</strong>.</p>
            <input
              type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
              placeholder="New password (min. 8 chars)"
              className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setResetModal(null)} className="px-4 py-2 rounded-lg text-sm bg-[#F8F7F4] hover:bg-[#E2DFD8]">
                Cancel
              </button>
              <button onClick={handleResetPassword} className="px-4 py-2 rounded-lg text-sm bg-navy text-white hover:bg-navy-light">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
