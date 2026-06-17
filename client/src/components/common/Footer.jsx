import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, MapPin, Phone, Mail, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { settingsService } from '../../services/contentService';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsService.get().then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-navy text-white/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-serif-display text-lg font-bold text-gold-light mb-3">
            <GraduationCap size={22} />
            SCEC Allahabad
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            {settings?.siteName || 'SCEC Allahabad'} — A unit of Prayagraj Educom Pvt. Ltd.
            Established {settings?.established || '2009'}.
          </p>
          <div className="flex gap-3 mt-4">
            {settings?.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="hover:text-gold-light"><Facebook size={18} /></a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="hover:text-gold-light"><Instagram size={18} /></a>
            )}
            {settings?.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="hover:text-gold-light"><Youtube size={18} /></a>
            )}
            {settings?.twitter && (
              <a href={settings.twitter} target="_blank" rel="noreferrer" className="hover:text-gold-light"><Twitter size={18} /></a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold-light">About Us</Link></li>
            <li><Link to="/courses" className="hover:text-gold-light">Courses</Link></li>
            <li><Link to="/universities" className="hover:text-gold-light">Universities</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-light">Gallery</Link></li>
            <li><Link to="/verification" className="hover:text-gold-light">Certificate Verification</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Programmes</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Management (MBA, BBA)</li>
            <li>Computer Science (BCA, MCA, O Level)</li>
            <li>Law (LLB, LLM)</li>
            <li>Education (B.Ed, D.El.Ed)</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 flex-shrink-0" /> {settings?.address || 'Prayagraj, Uttar Pradesh, India'}</li>
            {settings?.phone && <li className="flex items-center gap-2"><Phone size={16} /> {settings.phone}</li>}
            {settings?.email && <li className="flex items-center gap-2"><Mail size={16} /> {settings.email}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} SCEC Allahabad. All rights reserved.
      </div>
      <a href="/admin/login" className="hover:text-white/30 transition-colors">
    Admin
  </a>
    </footer>
  );
}
