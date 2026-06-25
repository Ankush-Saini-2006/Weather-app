import { useState, useEffect, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import RecentSearches from './components/RecentSearches';
import ThemeToggle from './components/ThemeToggle';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import useWeather from './hooks/useWeather';
import { getBackgroundGradient, groupForecastByDay } from './utils/weatherUtils';

const RECENT_SEARCHES_KEY = 'weatherapp_recent_searches';
const THEME_KEY = 'weatherapp_theme';
const MAX_RECENT = 5;

function App() {
  const {
    weather,
    forecast,
    hourly,
    airQuality,
    uvIndex,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoords,
    clearError,
  } = useWeather();

  const [isDark, setIsDark] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  // ---- Theme: load preference on mount, apply to <html> for Tailwind dark mode ----
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(shouldUseDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // ---- Recent searches: load on mount ----
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
      setRecentSearches(stored);
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const saveRecentSearch = useCallback((cityLabel) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== cityLabel.toLowerCase()
      );
      const updated = [cityLabel, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    async (city) => {
      setHasSearchedOnce(true);
      try {
        const data = await fetchWeatherByCity(city);
        if (data) {
          saveRecentSearch(`${data.name}, ${data.sys.country}`);
        }
      } catch {
        // Error state is already handled inside useWeather; nothing further needed here.
      }
    },
    [fetchWeatherByCity, saveRecentSearch]
  );

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setHasSearchedOnce(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await fetchWeatherByCoords(latitude, longitude);
          if (data) {
            saveRecentSearch(`${data.name}, ${data.sys.country}`);
          }
        } finally {
          setGeoLoading(false);
        }
      },
      () => {
        setGeoLoading(false);
        alert('Unable to retrieve your location. Please allow location access and try again.');
      }
    );
  }, [fetchWeatherByCoords, saveRecentSearch]);

  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // ---- Dynamic background based on current weather condition ----
  const currentCondition = weather?.weather?.[0]?.main;
  const gradient = getBackgroundGradient(currentCondition, isDark);
  const isBusy = loading || geoLoading;
  const forecastDays = forecast.length > 0 ? groupForecastByDay(forecast) : [];

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${gradient} transition-all duration-700 ease-in-out`}
    >
      {/* Decorative floating blobs for visual depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="w-full max-w-2xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌤️</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm tracking-tight">
              SkyCast
            </h1>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
        </header>

        {/* Search */}
        <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} loading={isBusy} />

        {/* Recent searches */}
        <RecentSearches
          cities={recentSearches}
          onSelect={handleSearch}
          onClear={handleClearRecent}
        />

        {/* Error */}
        <ErrorMessage message={error} onDismiss={clearError} />

        {/* Content area */}
        <main className="mt-8">
          {isBusy && <Loader variant="skeleton" />}

          {!isBusy && weather && (
            <>
              <WeatherCard
                weather={weather}
                airQuality={airQuality}
                uvIndex={uvIndex}
                hourly={hourly}
              />
              <ForecastCard forecastDays={forecastDays} />
            </>
          )}

          {!isBusy && !weather && !error && (
            <div className="text-center mt-12 animate-fade-in">
              <span className="text-6xl block mb-4 animate-float">🌎</span>
              <p className="text-white/80 dark:text-white/60 text-lg font-medium">
                {hasSearchedOnce
                  ? 'No weather data to show yet.'
                  : 'Search for a city or use your location to get started.'}
              </p>
            </div>
          )}
        </main>

        <footer className="text-center mt-12 text-white/50 dark:text-white/30 text-xs">
          Powered by OpenWeather API · Built with React &amp; Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default App;
