import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { universityService } from '../../services/contentService';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityService.getAll()
      .then((res) => setUniversities(res.data || []))
      .catch(() => setUniversities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Affiliated Universities" subtitle="Our programmes are recognized and affiliated with these institutions" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white border border-[#E2DFD8] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : universities.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">University information coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {universities.map((u) => (
              <div key={u._id} className="bg-white border border-[#E2DFD8] rounded-xl p-5 flex items-start gap-4">
                {u.logoUrl ? (
                  <img src={u.logoUrl} alt={u.shortName} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-navy flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                    {u.shortName || u.name?.slice(0, 2)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm font-semibold text-navy mb-1">{u.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{u.affiliationType} · {u.location}</div>
                  {u.programs?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {u.programs.map((p) => (
                        <span key={p} className="text-[11px] bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                  {u.website && (
                    <a href={u.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-navy hover:text-gold font-medium">
                      Visit website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
