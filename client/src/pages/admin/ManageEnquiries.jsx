import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/admin/AdminHeader';
import { enquiryService } from '../../services/contentService';

const statusColors = {
  new: 'bg-red-500', read: 'bg-gold', replied: 'bg-teal', closed: 'bg-gray-300',
};

export default function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    const params = filter !== 'All' ? { status: filter.toLowerCase() } : {};
    enquiryService.getAll(params)
      .then((res) => setEnquiries(res.data || []))
      .catch(() => toast.error('Failed to load enquiries'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const openEnquiry = async (e) => {
    setReply('');
    try {
      const res = await enquiryService.getOne(e._id);
      setSelected(res.data);
      // update local list status to 'read' if it was 'new'
      setEnquiries((list) => list.map((item) => (item._id === e._id ? { ...item, status: res.data.status } : item)));
    } catch {
      toast.error('Failed to load enquiry');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      const res = await enquiryService.update(selected._id, { status });
      setSelected(res.data);
      setEnquiries((list) => list.map((item) => (item._id === selected._id ? res.data : item)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast.error('Reply message cannot be empty');
      return;
    }
    setSending(true);
    try {
      const res = await enquiryService.update(selected._id, { reply, status: 'replied' });
      setSelected(res.data);
      setEnquiries((list) => list.map((item) => (item._id === selected._id ? res.data : item)));
      setReply('');
      toast.success('Reply sent via email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div>
      <AdminHeader
        title="Enquiries"
        action={
          <a href={enquiryService.exportCsvUrl()} className="text-xs px-3 py-1.5 rounded-md bg-[#F8F7F4] hover:bg-[#E2DFD8] flex items-center gap-1.5">
            <Download size={13} /> Export CSV
          </a>
        }
      />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-5" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between">
            <h3 className="text-sm font-semibold">Inbox</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="text-xs border border-[#E2DFD8] rounded-md px-2 py-1.5 bg-[#F8F7F4]">
              <option>All</option><option>New</option><option>Read</option><option>Replied</option><option>Closed</option>
            </select>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <p className="text-center text-gray-400 py-8 text-sm">Loading...</p>
            ) : enquiries.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No enquiries found.</p>
            ) : (
              enquiries.map((e) => (
                <div
                  key={e._id}
                  onClick={() => openEnquiry(e)}
                  className={`px-4 py-3 border-b border-[#E2DFD8] last:border-0 cursor-pointer flex items-center gap-3 transition-colors ${
                    selected?._id === e._id ? 'bg-[#F8F7F4]' : 'hover:bg-[#F8F7F4]'
                  } ${e.status === 'new' ? 'bg-navy/[0.02]' : ''}`}
                >
                  <div className="w-9 h-9 rounded-full bg-navy text-gold-light flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {initials(e.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${e.status === 'new' ? 'font-semibold' : ''}`}>
                      {e.name}
                      {e.status === 'new' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-navy ml-1.5" />}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{e.course || 'General Enquiry'}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(e.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
              Select an enquiry to view details
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy text-gold-light flex items-center justify-center text-xs font-bold">
                    {initials(selected.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{selected.name}</div>
                    <div className="text-xs text-gray-400">{selected.email} · {selected.phone}</div>
                  </div>
                </div>
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs border border-[#E2DFD8] rounded-md px-2 py-1.5 bg-[#F8F7F4]"
                >
                  <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <div className="bg-[#F8F7F4] border border-[#E2DFD8] rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wide text-gray-400">Course of Interest</span>
                      <div className="font-medium mt-0.5">{selected.course || 'General Enquiry'}</div>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wide text-gray-400">Submitted</span>
                      <div className="font-medium mt-0.5">
                        {new Date(selected.submittedAt).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wide text-gray-400">Message</span>
                    <p className="mt-1.5 text-sm leading-relaxed">{selected.message || '—'}</p>
                  </div>
                </div>

                {selected.reply && (
                  <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
                    <span className="text-[11px] uppercase tracking-wide text-teal font-semibold">Your Reply</span>
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">{selected.reply}</p>
                    {selected.repliedAt && (
                      <p className="text-xs text-gray-400 mt-2">Sent {new Date(selected.repliedAt).toLocaleString('en-IN')}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#E2DFD8]">
                <textarea
                  value={reply} onChange={(e) => setReply(e.target.value)} rows={3}
                  placeholder="Type your reply..."
                  className="w-full px-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white resize-none"
                />
                <div className="flex justify-end gap-2 mt-2.5">
                  <button onClick={() => handleStatusChange('closed')} className="px-4 py-2 text-sm rounded-lg bg-[#F8F7F4] hover:bg-[#E2DFD8]">
                    Mark as Closed
                  </button>
                  <button onClick={handleSendReply} disabled={sending} className="px-4 py-2 text-sm rounded-lg bg-navy text-white hover:bg-navy-light disabled:opacity-60">
                    {sending ? 'Sending...' : 'Send Reply via Email'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
