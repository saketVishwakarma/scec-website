import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { galleryService } from '../../services/contentService';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    galleryService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    galleryService.getAll(params)
      .then((res) => setImages(res.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () => setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setLightboxIndex((i) => (i + 1) % images.length);

  return (
    <div>
      <PageHeader title="Photo Gallery" subtitle="Campus life, events, and memorable moments" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
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
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white border border-[#E2DFD8] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={img._id}
                onClick={() => setLightboxIndex(i)}
                className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E2DFD8] group relative"
              >
                <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2 text-left">
                    <span className="text-white text-xs">{img.caption}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center px-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/70 hover:text-white">
            <X size={28} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <img
            src={images[lightboxIndex].imageUrl}
            alt={images[lightboxIndex].caption}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}
