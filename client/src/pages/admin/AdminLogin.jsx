import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-lighter flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">

        {/* ── Logo ── */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="SCEC Allahabad"
            className="h-16 w-16 object-contain mb-3"
          />
          <h1 className="font-serif-display text-xl font-bold text-navy">
            SCEC Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in to manage the website
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@scecallahabad.com"
              className="w-full px-3 py-2.5 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 pr-10 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-[#F8F7F4] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-navy-light disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}