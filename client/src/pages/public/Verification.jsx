import { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

export default function Verification() {
  const [certNumber, setCertNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!certNumber.trim()) return;
    setLoading(true);
    // Placeholder — wire up to a real verification endpoint when available
    setTimeout(() => {
      setResult({ found: false, certNumber });
      setLoading(false);
    }, 600);
  };

  return (
    <div>
      <PageHeader title="Certificate Verification" subtitle="Verify the authenticity of certificates issued by SCEC Allahabad" />

      <div className="max-w-xl mx-auto px-4 py-12">
        <form onSubmit={handleSearch} className="bg-white border border-[#E2DFD8] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Certificate / Roll Number
            </label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                placeholder="Enter certificate number"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy-light disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Certificate'}
          </button>
        </form>

        {result && (
          <div className={`mt-5 rounded-xl p-5 flex items-start gap-3 border ${
            result.found ? 'bg-teal/5 border-teal/20' : 'bg-red-50 border-red-100'
          }`}>
            {result.found ? <ShieldCheck size={22} className="text-teal mt-0.5" /> : <ShieldAlert size={22} className="text-red-500 mt-0.5" />}
            <div className="text-sm">
              {result.found ? (
                <p className="text-gray-700">Certificate <strong>{result.certNumber}</strong> is verified and authentic.</p>
              ) : (
                <p className="text-gray-700">
                  We could not find a certificate matching <strong>{result.certNumber}</strong>.
                  Please double-check the number, or contact us at{' '}
                  <a href="/contact" className="text-navy underline">our contact page</a> for assistance.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
