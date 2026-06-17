import { useEffect, useState } from 'react';
import { Target, Eye, Building2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { settingsService, universityService } from '../../services/contentService';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    settingsService.get().then((res) => setSettings(res.data)).catch(() => {});
    universityService.getAll().then((res) => setUniversities(res.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader
        title="About SCEC Allahabad"
        subtitle="Empowering students through quality education since 2009"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mb-12">
          <h2 className="font-serif-display text-2xl font-bold text-navy mb-3">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            {settings?.siteName || 'SCEC Allahabad'} is a unit of Prayagraj
            Educom Pvt. Ltd., established on {settings?.established || 'May 8, 2009'} under the{' '}
            {settings?.companyAct || 'Companies Act 1956, Government of India'}. Over more than a
            decade, PIM has guided thousands of students towards quality education and meaningful
            careers across Management, Computer Science, Law, Education, Medical and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-3">
              <Target size={20} />
            </div>
            <h3 className="font-semibold text-navy mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {settings?.mission || 'Educated, Empowered, Employed YOUTH to Provide LEADERSHIP'}
            </p>
          </div>
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-6">
            <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-3">
              <Eye size={20} />
            </div>
            <h3 className="font-semibold text-navy mb-2">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {settings?.vision || 'To be a unified, well focused Institute, universally acknowledged as the leader in education and training contributing to the sustainable development of the youth, community and region.'}
            </p>
          </div>
        </div>

        {settings?.directorMessage && (
          <div className="bg-gradient-to-br from-navy to-navy-lighter rounded-2xl p-8 md:p-10 mb-12">
            <div className="font-semibold text-gold-light mb-0.5">{settings.directorName || 'Director'}</div>
            <div className="text-xs text-white/50 mb-3">{settings.directorRole}</div>
            <p className="text-white/75 text-sm leading-relaxed max-w-2xl">{settings.directorMessage}</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={20} className="text-navy" />
            <h2 className="font-serif-display text-2xl font-bold text-navy">Affiliated Universities & Boards</h2>
          </div>
          <div className="w-12 h-[3px] bg-gold rounded-full mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {universities.map((u) => (
              <div key={u._id} className="bg-white border border-[#E2DFD8] rounded-xl p-4 flex items-center gap-3">
                {u.logoUrl ? (
                  <img src={u.logoUrl} alt={u.shortName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-gold-light text-xs font-bold flex-shrink-0">
                    {u.shortName || u.name?.slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-navy">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.affiliationType} · {u.location}</div>
                </div>
              </div>
            ))}
            {universities.length === 0 && (
              <p className="text-sm text-gray-400 col-span-2">University information coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
