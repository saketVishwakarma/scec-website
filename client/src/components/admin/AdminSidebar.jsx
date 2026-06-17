import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bell, Image, BookOpen, Building2, GalleryHorizontalEnd,
  Mail, Users, Settings, MapPin, LogOut, GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const navItems = [
  { section: 'Overview', items: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  ]},
  { section: 'Content', items: [
    { to: '/admin/notices', label: 'Notices', icon: Bell },
    { to: '/admin/slides', label: 'Hero Slides', icon: Image },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/universities', label: 'Universities', icon: Building2 },
    { to: '/admin/centers', label: 'Centers', icon: MapPin },
    { to: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
  ]},
  { section: 'Manage', items: [
    { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
    { to: '/admin/users', label: 'Users', icon: Users, superAdminOnly: true },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ]},
];

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <aside className="w-[220px] bg-navy text-white flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="px-4 pt-5 pb-3 border-b border-white/10">
        <h2 className="text-[15px] font-bold text-gold-light tracking-wide flex items-center gap-2">
          <GraduationCap size={18} /> SCEC Admin
        </h2>
        <p className="text-[10px] text-white/40 mt-0.5">SCEC Allahabad</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="px-4 pt-3 pb-1 text-[9px] uppercase tracking-wider text-white/30 font-medium">
              {group.section}
            </div>
            {group.items
              .filter((item) => !item.superAdminOnly || user?.role === 'superadmin')
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 mx-2 my-0.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                      isActive ? 'bg-gold/15 text-gold-light' : 'text-white/70 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={15} />
                  {item.label}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>

      <div className="px-2 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-[12px] font-medium text-white truncate">{user?.name}</p>
          <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 mx-1 px-3 py-2 rounded-md text-[13px] text-white/50 hover:bg-white/8 hover:text-white transition-colors w-[calc(100%-8px)]"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
