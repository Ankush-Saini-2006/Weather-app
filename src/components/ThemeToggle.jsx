/**
 * ThemeToggle
 * A switch-style toggle button for dark/light mode. The actual theme
 * persistence lives in App.jsx (single source of truth in localStorage);
 * this component is purely presentational + the click handler.
 */
const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="relative flex items-center w-16 h-9 rounded-full px-1 bg-white/30 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/10 transition-colors duration-300 hover:bg-white/40 dark:hover:bg-black/50"
    >
      <span
        className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md transform transition-transform duration-300 ease-in-out ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
};

export default ThemeToggle;
