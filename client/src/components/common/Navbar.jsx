import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

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
      isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-serif-display text-xl font-bold text-gold-light">
            <GraduationCap size={26} />
            SCEC Allahabad
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/enquiry"
              className="bg-gold hover:bg-gold-light hover:text-navy text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Apply Now
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

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
