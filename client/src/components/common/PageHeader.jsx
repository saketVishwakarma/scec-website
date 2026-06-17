export default function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-navy py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}
