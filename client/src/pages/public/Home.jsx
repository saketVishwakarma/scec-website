import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Code2, Scale, HeartPulse, GraduationCap, Cog, ArrowRight, User } from 'lucide-react';
import HeroSlider from '../../components/common/HeroSlider';
import NoticeBoard from '../../components/common/NoticeBoard';
import { settingsService } from '../../services/contentService';

const admissionCategories = [
  { icon: Briefcase, name: 'Management', badge: 'MBA, BBA, PGDBM', color: 'bg-navy/8 text-navy' },
  { icon: Code2, name: 'Computer Science', badge: 'BCA, MCA, O Level', color: 'bg-teal/10 text-teal' },
  { icon: Scale, name: 'Law', badge: 'LLB, LLM, BA-LLB', color: 'bg-gold/10 text-gold' },
  { icon: HeartPulse, name: 'Medical / Pharma', badge: 'D.Pharma, GNM, ANM', color: 'bg-red-50 text-red-600' },
  { icon: GraduationCap, name: 'Education', badge: 'B.Ed, M.Ed, NTT, PTT', color: 'bg-blue-50 text-blue-600' },
  { icon: Cog, name: 'Engineering', badge: 'B.Tech, M.Tech, ITI', color: 'bg-purple-50 text-purple-600' },
];

export default function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsService.get().then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <HeroSlider />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <NoticeBoard variant="ticker" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 mb-16">
        <div className="lg:col-span-2">
          <h2 className="font-serif-display text-2xl font-bold text-navy mb-1">Admissions Open</h2>
          <div className="w-12 h-[3px] bg-gold rounded-full mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {admissionCategories.map((cat) => (
              <Link
                key={cat.name}
                to="/courses"
                className="border border-[#E2DFD8] rounded-xl p-4 bg-white hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.color}`}>
                  <cat.icon size={18} />
                </div>
                <div className="text-sm font-semibold text-navy">{cat.name}</div>
                <span className="inline-block text-[11px] font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full w-fit">
                  {cat.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif-display text-2xl font-bold text-navy mb-1">Notices</h2>
          <div className="w-12 h-[3px] bg-gold rounded-full mb-5" />
          <NoticeBoard />
        </div>
      </div>

      {settings?.directorMessage && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-navy to-navy-lighter rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 rounded-full bg-gold-light/15 border-2 border-gold-light/30 flex items-center justify-center flex-shrink-0">
                <User size={28} className="text-gold-light" />
              </div>
              <div>
                <div className="font-semibold text-gold-light mb-0.5">{settings.directorName || 'Director'}</div>
                <div className="text-xs text-white/50 mb-3">{settings.directorRole || 'Director, SCEC Allahabad'}</div>
                <p className="text-white/75 text-sm leading-relaxed">{settings.directorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-[#E2DFD8] rounded-2xl p-8 md:p-10 text-center">
          <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-navy mb-3">
            Ready to start your journey?
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
            Submit an enquiry and our admissions team will get back to you within 24–48 hours
            with detailed information about courses, fees, and eligibility.
          </p>
          <Link
            to="/enquiry"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Submit Enquiry <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
