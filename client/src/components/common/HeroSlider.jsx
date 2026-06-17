import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slideService } from '../../services/contentService';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    slideService.getAll()
      .then((res) => setSlides(res.data || []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (slides.length ? (c + 1) % slides.length : 0));
  }, [slides.length]);

  const prev = () => setCurrent((c) => (slides.length ? (c - 1 + slides.length) % slides.length : 0));

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (loading) {
    return <div className="h-[320px] md:h-[420px] bg-navy rounded-2xl animate-pulse" />;
  }

  // Fallback slide if none configured yet
  if (slides.length === 0) {
    return (
      <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-navy via-navy-light to-navy-lighter flex flex-col items-center justify-center text-center px-6">
        <span className="inline-block bg-gold-light/15 border border-gold-light/30 text-gold-light text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide mb-4">
          Admissions Open 2025–26
        </span>
        <h1 className="font-serif-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
          Pune Institute of<br />Management, Allahabad
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-xl mb-6">
          A unit of Prayagraj Educom Pvt. Ltd. Offering 60+ programmes across Management, Law,
          Computer Science, Education and more.
        </p>
        <div className="flex gap-3">
          <Link to="/enquiry" className="bg-gold hover:bg-gold-light hover:text-navy text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">Apply Now</Link>
          <Link to="/courses" className="border border-white/30 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors">View Courses</Link>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="relative h-[320px] md:h-[420px] rounded-2xl overflow-hidden bg-navy group">
      <img
        src={slide.imageUrl}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/10" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        {slide.title && (
          <h1 className="font-serif-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-3xl">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="text-white/80 text-sm md:text-base max-w-xl mb-6">{slide.subtitle}</p>
        )}
        {slide.linkUrl && (
          <Link to={slide.linkUrl} className="bg-gold hover:bg-gold-light hover:text-navy text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Learn More
          </Link>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
