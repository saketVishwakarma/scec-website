import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { settingsService } from '../../services/contentService';

export default function Contact() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsService.get().then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-navy/8 text-navy rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin size={20} />
            </div>
            <h3 className="font-semibold text-navy mb-1">Address</h3>
            <p className="text-sm text-gray-500">{settings?.address || 'Prayagraj, Uttar Pradesh, India'}</p>
          </div>
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone size={20} />
            </div>
            <h3 className="font-semibold text-navy mb-1">Phone</h3>
            <p className="text-sm text-gray-500">{settings?.phone || 'Not configured'}</p>
          </div>
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail size={20} />
            </div>
            <h3 className="font-semibold text-navy mb-1">Email</h3>
            <p className="text-sm text-gray-500">{settings?.email || 'Not configured'}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2DFD8] rounded-xl p-6 flex items-start gap-3 max-w-2xl mx-auto">
          <Clock size={18} className="text-navy mt-0.5" />
          <div className="text-sm text-gray-600">
            <strong className="text-navy">Office Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM.
            For admission enquiries, please use the{' '}
            <a href="/enquiry" className="text-teal underline">enquiry form</a> and our team will respond within 24–48 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
