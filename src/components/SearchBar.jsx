import { useState } from 'react';

/**
 * SearchBar
 * Controlled input for city search with Enter-to-search support, plus a
 * "Use My Location" button that triggers geolocation lookup in the parent.
 */
const SearchBar = ({ onSearch, onUseLocation, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-3"
    >
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 dark:text-white/50 text-lg">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city... e.g. London, Tokyo, New York"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/25 dark:bg-black/25 backdrop-blur-xl border border-white/40 dark:border-white/10 text-white placeholder-white/60 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 dark:focus:ring-sky-400/60 transition-all duration-300 shadow-lg"
          disabled={loading}
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onUseLocation}
          disabled={loading}
          title="Use my current location"
          className="flex-1 sm:flex-none px-4 py-3.5 rounded-2xl bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 text-white font-medium shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <span>📍</span>
          <span className="hidden sm:inline">My Location</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
