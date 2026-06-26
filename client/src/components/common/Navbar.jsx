import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/universities', label: 'Universities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/centers', label: 'Centers' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm transition-colors ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="SCEC Allahabad"
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <div className="font-serif-display text-lg font-bold text-white">
                SCEC
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider -mt-0.5">
                Allahabad
              </div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* ── CTA + mobile toggle ── */}
          <div className="flex items-center gap-3">
            <Link
              to="/enquiry"
              className="hidden md:block bg-gold hover:bg-gold-light hover:text-navy text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Apply Now
            </Link>
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/enquiry"
            onClick={() => setOpen(false)}
            className="block bg-gold text-white text-sm font-semibold px-4 py-2 rounded-lg text-center mt-2"
          >
            Apply Now
          </Link>
        </div>
      )}
    </header>
  );
}