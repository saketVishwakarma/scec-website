import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import ImageUploader from '../../components/admin/ImageUploader';
import { settingsService } from '../../services/contentService';

const TABS = ['General', 'Contact & Social', 'Director\'s Message', 'Mission & Vision'];

export default function SiteSettings() {
  const [tab, setTab]         = useState(0);
  const [form, setForm]       = useState({});
  const [logo, setLogo]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    settingsService.get()
      .then((res) => setForm(res.data || {}))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== '_id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt' && v != null) {
          fd.append(k, v);
        }
      });
      if (logo) fd.append('logo', logo);
      const res = await settingsService.update(fd);
      setForm(res.data);
      setLogo(null);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors';
  const label = (text) => (
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">{text}</label>
  );

  if (loading) {
    return (
      <div>
        <AdminHeader title="Site Settings" />
        <div className="p-6 text-sm text-gray-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Site Settings"
        action={
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        }
      />
      <div className="p-6">
        {/* Tabs */}
        <div className="flex border-b border-[#E2DFD8] mb-6 gap-0.5 overflow-x-auto">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === i ? 'border-navy text-navy' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl p-6">

          {/* ── General ── */}
          {tab === 0 && (
            <div className="space-y-5">
              <div className="flex gap-6 items-start">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Site Logo</p>
                  <ImageUploader
                    onFiles={(files) => setLogo(files[0])}
                    previewUrl={form.logoUrl}
                    label="PNG, SVG, max 2MB"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    {label('Institute Full Name')}
                    <input name="siteName" value={form.siteName || ''} onChange={set} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {label('Tagline / Short Name')}
                      <input name="tagline" value={form.tagline || ''} onChange={set} className={inputClass} />
                    </div>
                    <div>
                      {label('Established')}
                      <input name="established" value={form.established || ''} onChange={set}
                        placeholder="08-May-2009" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {label('CIN Number')}
                      <input name="cinNumber" value={form.cinNumber || ''} onChange={set} className={inputClass} />
                    </div>
                    <div>
                      {label('Admission Banner Text')}
                      <input name="admissionBanner" value={form.admissionBanner || ''} onChange={set}
                        placeholder="Admissions Open 2025–26" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Contact & Social ── */}
          {tab === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {label('Phone')}
                  <input name="phone" value={form.phone || ''} onChange={set} placeholder="+91-XXXXXXXXXX" className={inputClass} />
                </div>
                <div>
                  {label('Email')}
                  <input name="email" value={form.email || ''} onChange={set} placeholder="info@scecallahabad.com" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  {label('Address')}
                  <textarea name="address" value={form.address || ''} onChange={set} rows={2}
                    className={`${inputClass} resize-none`} />
                </div>
              </div>
              <hr className="border-[#E2DFD8]" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Social Media Links</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['facebook', 'Facebook URL'],
                  ['instagram', 'Instagram URL'],
                  ['youtube', 'YouTube URL'],
                  ['twitter', 'Twitter / X URL'],
                ].map(([name, lbl]) => (
                  <div key={name}>
                    {label(lbl)}
                    <input name={name} value={form[name] || ''} onChange={set}
                      placeholder="https://..." className={inputClass} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Director's Message ── */}
          {tab === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {label('Director\'s Name')}
                  <input name="directorName" value={form.directorName || ''} onChange={set}
                    placeholder="Full Name" className={inputClass} />
                </div>
                <div>
                  {label('Role / Designation')}
                  <input name="directorRole" value={form.directorRole || ''} onChange={set}
                    placeholder="Director, SCEC Allahabad" className={inputClass} />
                </div>
              </div>
              <div>
                {label('Message')}
                <textarea name="directorMessage" value={form.directorMessage || ''} onChange={set} rows={8}
                  placeholder="Write the director's message here..."
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          {/* ── Mission & Vision ── */}
          {tab === 3 && (
            <div className="space-y-4">
              <div>
                {label('Mission Statement')}
                <textarea name="mission" value={form.mission || ''} onChange={set} rows={4}
                  placeholder="Our mission is to..."
                  className={`${inputClass} resize-none`} />
              </div>
              <div>
                {label('Vision Statement')}
                <textarea name="vision" value={form.vision || ''} onChange={set} rows={4}
                  placeholder="Our vision is to..."
                  className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 pt-5 border-t border-[#E2DFD8]">
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
