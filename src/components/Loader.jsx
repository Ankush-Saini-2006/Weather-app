/**
 * Loader
 * Two variants: a centered spinner (for initial/global loading) and a
 * skeleton card (mimics the WeatherCard layout) for smoother perceived
 * performance while data is in flight.
 */
const Loader = ({ variant = 'spinner' }) => {
  if (variant === 'skeleton') {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-xl p-6 sm:p-8 animate-pulse border border-white/30 dark:border-white/10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3">
            <div className="h-6 w-40 bg-white/40 dark:bg-white/10 rounded-lg" />
            <div className="h-4 w-24 bg-white/30 dark:bg-white/10 rounded-lg" />
          </div>
          <div className="h-16 w-16 bg-white/30 dark:bg-white/10 rounded-full" />
        </div>
        <div className="h-16 w-32 bg-white/40 dark:bg-white/10 rounded-lg mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white/20 dark:bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-live="polite">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-white/30 dark:border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-white dark:border-t-sky-400 border-transparent animate-spin-slow" />
      </div>
      <p className="text-white/90 dark:text-white/80 text-sm font-medium animate-pulse">
        Fetching weather data...
      </p>
    </div>
  );
};

export default Loader;
