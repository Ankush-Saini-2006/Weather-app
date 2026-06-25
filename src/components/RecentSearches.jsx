/**
 * RecentSearches
 * Renders up to 5 recently searched cities as clickable chips.
 * Persistence (localStorage read/write) is handled in App.jsx; this
 * component just renders the list it's given.
 */
const RecentSearches = ({ cities, onSelect, onClear }) => {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-white/80 dark:text-white/60 text-xs font-medium uppercase tracking-wider">
          Recent Searches
        </span>
        <button
          onClick={onClear}
          className="text-white/60 dark:text-white/40 text-xs hover:text-white dark:hover:text-white/80 transition-colors duration-200"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cities.map((city, idx) => (
          <button
            key={`${city}-${idx}`}
            onClick={() => onSelect(city)}
            className="px-4 py-1.5 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 text-white text-sm font-medium hover:bg-white/35 dark:hover:bg-black/35 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
