import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookOpen, Bell, Image, ArrowRight } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import {
  enquiryService, courseService, noticeService, galleryService,
} from '../../services/contentService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ enquiries: 0, unread: 0, courses: 0, notices: 0, gallery: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);

  useEffect(() => {
    enquiryService.getAll().then((res) => {
      setStats((s) => ({ ...s, enquiries: res.count || 0, unread: res.unreadCount || 0 }));
      setRecentEnquiries((res.data || []).slice(0, 5));
    }).catch(() => {});

    courseService.getAllAdmin().then((res) => setStats((s) => ({ ...s, courses: res.count || 0 }))).catch(() => {});

    noticeService.getAllAdmin().then((res) => {
      setStats((s) => ({ ...s, notices: res.count || 0 }));
      setRecentNotices((res.data || []).slice(0, 5));
    }).catch(() => {});

    galleryService.getAll().then((res) => setStats((s) => ({ ...s, gallery: res.count || 0 }))).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Enquiries', value: stats.enquiries, color: 'text-navy', icon: Mail, sub: `${stats.unread} unread` },
    { label: 'Active Courses', value: stats.courses, color: 'text-teal', icon: BookOpen, sub: 'In catalog' },
    { label: 'New Enquiries', value: stats.unread, color: 'text-red-500', icon: Mail, sub: 'Awaiting reply' },
    { label: 'Gallery Photos', value: stats.gallery, color: 'text-gold', icon: Image, sub: 'Total uploaded' },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" />
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-[#E2DFD8] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                <s.icon size={18} className="text-gray-300" />
              </div>
              <div className="text-xs text-gray-500">{s.label}</div>
              <div className="text-[11px] text-teal mt-1 font-medium">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Enquiries</h3>
              <Link to="/admin/enquiries" className="text-xs text-navy hover:text-gold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div>
              {recentEnquiries.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No enquiries yet.</p>
              ) : (
                recentEnquiries.map((e) => (
                  <div key={e._id} className="px-4 py-2.5 border-b border-[#E2DFD8] last:border-0 flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.status === 'new' ? 'bg-red-500' : 'bg-teal'}`} />
                    <span className="text-sm flex-1 truncate">
                      <strong>{e.name}</strong> — {e.course || 'General Enquiry'}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(e.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2DFD8] flex items-center justify-between">
              <h3 className="text-sm font-semibold">Recent Notices</h3>
              <Link to="/admin/notices" className="text-xs text-navy hover:text-gold flex items-center gap-1">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            <div>
              {recentNotices.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No notices yet.</p>
              ) : (
                recentNotices.map((n) => (
                  <div key={n._id} className="px-4 py-2.5 border-b border-[#E2DFD8] last:border-0 flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.isActive ? 'bg-gold' : 'bg-gray-300'}`} />
                    <span className="text-sm flex-1 truncate">{n.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl mt-4">
          <div className="px-4 py-3 border-b border-[#E2DFD8]">
            <h3 className="text-sm font-semibold">Quick Actions</h3>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { to: '/admin/notices', icon: Bell, label: 'Add Notice' },
              { to: '/admin/gallery', icon: Image, label: 'Upload Photos' },
              { to: '/admin/courses', icon: BookOpen, label: 'Add Course' },
              { to: '/admin/slides', icon: Image, label: 'Edit Slides' },
              { to: '/admin/settings', icon: Mail, label: 'Settings' },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="border border-[#E2DFD8] rounded-lg p-3.5 text-center hover:border-navy transition-colors">
                <a.icon size={22} className="mx-auto mb-1.5 text-navy/60" />
                <div className="text-xs font-medium">{a.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
