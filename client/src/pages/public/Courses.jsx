import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { courseService } from '../../services/contentService';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (search) params.search = search;

    const timer = setTimeout(() => {
      courseService.getAll(params)
        .then((res) => setCourses(res.data || []))
        .catch(() => setCourses([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  return (
    <div>
      <PageHeader title="Our Courses" subtitle="Explore 60+ programmes across multiple disciplines" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === 'All' ? 'bg-navy text-white' : 'border border-[#E2DFD8] text-gray-500 hover:border-navy'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat ? 'bg-navy text-white' : 'border border-[#E2DFD8] text-gray-500 hover:border-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2DFD8] rounded-lg focus:outline-none focus:border-navy bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-white border border-[#E2DFD8] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-[#E2DFD8] rounded-xl p-4 hover:border-navy hover:shadow-md transition-all"
              >
                <div className="text-[10px] font-bold uppercase tracking-wide text-teal mb-1.5">
                  {course.category}
                </div>
                <div className="text-sm font-semibold text-navy mb-1">{course.name}</div>
                <div className="text-xs text-gray-400">
                  {course.duration}{course.level ? ` · ${course.level}` : ''}
                </div>
                {course.university && (
                  <div className="text-xs text-gray-400 mt-1">Affiliation: {course.university}</div>
                )}
                {course.description && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{course.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
