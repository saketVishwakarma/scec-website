import { useEffect, useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import { enquiryService, courseService } from '../../services/contentService';

export default function Enquiry() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: '', message: '' });
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    courseService.getAll().then((res) => setCourses(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await enquiryService.submit(form);
      setSubmitted(true);
      toast.success('Enquiry submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <PageHeader title="Enquiry Form" subtitle="Get in touch with our admissions team" />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <CheckCircle2 size={56} className="text-teal mx-auto mb-4" />
          <h2 className="font-serif-display text-2xl font-bold text-navy mb-2">Thank you, {form.name}!</h2>
          <p className="text-gray-500 text-sm mb-6">
            We have received your enquiry. Our admissions team will contact you within 24–48 hours.
            A confirmation email has been sent to {form.email}.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', course: '', message: '' }); }}
            className="text-navy text-sm font-medium underline"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Enquiry Form" subtitle="Get in touch with our admissions team — we typically respond within 24–48 hours" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit} className="bg-white border border-[#E2DFD8] rounded-2xl p-6 md:p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Full Name *
              </label>
              <input
                name="name" value={form.name} onChange={handleChange} required
                placeholder="John Doe"
                className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Phone Number *
              </label>
              <input
                name="phone" value={form.phone} onChange={handleChange} required
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Email Address *
            </label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="john@example.com"
              className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Course of Interest
            </label>
            <select
              name="course" value={form.course} onChange={handleChange}
              className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
            >
              <option value="">Select a course (optional)</option>
              {courses.map((c) => (
                <option key={c._id} value={c.name}>{c.name} ({c.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Message
            </label>
            <textarea
              name="message" value={form.message} onChange={handleChange} rows={4}
              placeholder="Tell us about your educational background and what you're looking for..."
              className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-light disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {submitting ? 'Submitting...' : <>Submit Enquiry <Send size={15} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
