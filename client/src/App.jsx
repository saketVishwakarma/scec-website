import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout  from './layouts/PublicLayout';
import AdminLayout   from './layouts/AdminLayout';

// Public pages
import Home          from './pages/public/Home';
import About         from './pages/public/About';
import Courses       from './pages/public/Courses';
import Universities  from './pages/public/Universities';
import Gallery       from './pages/public/Gallery';
import Centers       from './pages/public/Centers';
import Enquiry       from './pages/public/Enquiry';
import Contact       from './pages/public/Contact';
import Verification  from './pages/public/Verification';

// Admin pages
import AdminLogin       from './pages/admin/AdminLogin';
import AdminDashboard   from './pages/admin/AdminDashboard';
import ManageNotices    from './pages/admin/ManageNotices';
import ManageSlides     from './pages/admin/ManageSlides';
import ManageCourses    from './pages/admin/ManageCourses';
import ManageUniversities from './pages/admin/ManageUniversities';
import ManageCenters    from './pages/admin/ManageCenters';
import ManageGallery    from './pages/admin/ManageGallery';
import ManageEnquiries  from './pages/admin/ManageEnquiries';
import ManageUsers      from './pages/admin/ManageUsers';
import SiteSettings     from './pages/admin/SiteSettings';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ──────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/"              element={<Home />} />
        <Route path="/about"         element={<About />} />
        <Route path="/courses"       element={<Courses />} />
        <Route path="/universities"  element={<Universities />} />
        <Route path="/gallery"       element={<Gallery />} />
        <Route path="/centers"       element={<Centers />} />
        <Route path="/enquiry"       element={<Enquiry />} />
        <Route path="/contact"       element={<Contact />} />
        <Route path="/verification"  element={<Verification />} />
      </Route>

      {/* ── Admin login (no layout) ─────────────────────────── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin routes (protected) ────────────────────────── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index                  element={<AdminDashboard />} />
        <Route path="notices"         element={<ManageNotices />} />
        <Route path="slides"          element={<ManageSlides />} />
        <Route path="courses"         element={<ManageCourses />} />
        <Route path="universities"    element={<ManageUniversities />} />
        <Route path="centers"         element={<ManageCenters />} />
        <Route path="gallery"         element={<ManageGallery />} />
        <Route path="enquiries"       element={<ManageEnquiries />} />
        <Route path="users"           element={<ManageUsers />} />
        <Route path="settings"        element={<SiteSettings />} />
      </Route>

      {/* ── Catch-all ───────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
