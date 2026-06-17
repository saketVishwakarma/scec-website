import { useEffect, useState } from 'react';
import { noticeService } from '../../services/contentService';

export default function NoticeBoard({ variant = 'full' }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticeService.getAll()
      .then((res) => setNotices(res.data || []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  if (variant === 'ticker') {
    if (loading || notices.length === 0) return null;
    const text = notices.map((n) => n.title).join('     •     ');
    return (
      <div className="bg-navy text-white/90 py-2.5 px-5 rounded-xl mb-6 flex items-center gap-3 overflow-hidden">
        <span className="bg-gold text-navy text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wide flex-shrink-0">
          Notice
        </span>
        <div className="overflow-hidden whitespace-nowrap relative flex-1">
          <div className="inline-block animate-marquee text-xs">{text}</div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee { animation: marquee 30s linear infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden">
      {loading ? (
        <div className="p-4 text-sm text-gray-400">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="p-4 text-sm text-gray-400">No active notices.</div>
      ) : (
        notices.map((n) => (
          <div key={n._id} className="px-4 py-3 border-b border-[#E2DFD8] last:border-b-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-teal mb-1">
              {n.category}
            </div>
            <div className="text-sm font-medium leading-relaxed">{n.title}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
