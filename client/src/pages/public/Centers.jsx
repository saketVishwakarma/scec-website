import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { centerService } from '../../services/contentService';

export default function Centers() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    centerService.getAll()
      .then((res) => setCenters(res.data || []))
      .catch(() => setCenters([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Our Centers" subtitle="Visit us at any of our campus locations" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 bg-white border border-[#E2DFD8] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : centers.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">Center information coming soon.</p>
        ) : (
          <div className="space-y-6">
            {centers.map((c) => (
              <div key={c._id} className="bg-white border border-[#E2DFD8] rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="p-6">
                  <h3 className="font-serif-display text-xl font-bold text-navy mb-3">{c.name}</h3>
                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 text-teal flex-shrink-0" />
                      {c.address}
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-teal" />
                        {c.phone}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-teal" />
                        {c.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 min-h-[200px]">
                  {c.mapEmbedUrl ? (
                    <iframe
                      src={c.mapEmbedUrl}
                      title={c.name}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Map not configured
                    </div>
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
