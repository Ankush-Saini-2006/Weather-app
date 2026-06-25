/**
 * weatherUtils.js
 * Pure helper functions for formatting weather data, mapping conditions
 * to backgrounds/icons, and generating weather-based recommendations.
 * Keeping these as pure functions (no side effects) makes them easy to
 * test and reuse across components.
 */

/**
 * Maps OpenWeather's main condition string to a Tailwind gradient class.
 * Falls back to a neutral gradient for unknown/unmapped conditions.
 */
export const getBackgroundGradient = (condition, isDark) => {
  const key = (condition || '').toLowerCase();

  const lightGradients = {
    clear: 'from-amber-300 via-orange-300 to-sky-400',
    clouds: 'from-slate-300 via-gray-300 to-slate-400',
    rain: 'from-blue-400 via-sky-500 to-blue-600',
    drizzle: 'from-sky-300 via-blue-400 to-slate-500',
    thunderstorm: 'from-slate-700 via-purple-800 to-gray-900',
    snow: 'from-slate-100 via-blue-100 to-cyan-200',
    mist: 'from-gray-300 via-slate-300 to-gray-400',
    fog: 'from-gray-300 via-slate-300 to-gray-400',
    haze: 'from-gray-300 via-slate-300 to-gray-400',
  };

  const darkGradients = {
    clear: 'from-indigo-900 via-purple-900 to-slate-900',
    clouds: 'from-gray-700 via-slate-800 to-gray-900',
    rain: 'from-slate-800 via-blue-900 to-gray-900',
    drizzle: 'from-slate-800 via-blue-900 to-gray-900',
    thunderstorm: 'from-gray-900 via-purple-950 to-black',
    snow: 'from-slate-700 via-blue-800 to-slate-900',
    mist: 'from-gray-800 via-slate-800 to-gray-900',
    fog: 'from-gray-800 via-slate-800 to-gray-900',
    haze: 'from-gray-800 via-slate-800 to-gray-900',
  };

  const gradients = isDark ? darkGradients : lightGradients;
  return gradients[key] || (isDark
    ? 'from-gray-800 via-slate-800 to-gray-900'
    : 'from-sky-300 via-blue-300 to-indigo-400');
};

/**
 * Returns an emoji-based icon for a given weather condition.
 * Used as a lightweight, dependency-free alternative to icon packs.
 */
export const getWeatherEmoji = (condition) => {
  const key = (condition || '').toLowerCase();
  const map = {
    clear: '☀️',
    clouds: '☁️',
    rain: '🌧️',
    drizzle: '🌦️',
    thunderstorm: '⛈️',
    snow: '❄️',
    mist: '🌫️',
    fog: '🌫️',
    haze: '🌫️',
    smoke: '🌫️',
    dust: '🌪️',
    sand: '🌪️',
    tornado: '🌪️',
  };
  return map[key] || '🌤️';
};

/** Converts OpenWeather's icon code to the official icon image URL. */
export const getWeatherIconUrl = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

/** Formats a Unix timestamp (seconds) into a localized time string e.g. "06:42 AM". */
export const formatTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  if (!unixSeconds) return '--:--';
  // Apply the city's timezone offset so sunrise/sunset reflect local time
  const utcMs = (unixSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(utcMs);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
};

/** Formats a Unix timestamp into a readable date e.g. "Mon, 24 Jun". */
export const formatDate = (unixSeconds) => {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

/** Formats a Unix timestamp into an hour label e.g. "3 PM". */
export const formatHour = (unixSeconds) => {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric' });
};

/** Converts meters/second wind speed to km/h for more intuitive display. */
export const msToKmh = (ms) => (ms * 3.6).toFixed(1);

/** Converts visibility in meters to kilometers. */
export const metersToKm = (meters) => (meters / 1000).toFixed(1);

/**
 * Groups the 3-hour interval forecast list (40 entries / 5 days) from the
 * /forecast endpoint into one representative entry per day, using the
 * midday (12:00) reading when available, and computes min/max temps.
 */
export const groupForecastByDay = (list) => {
  const days = {};

  list.forEach((entry) => {
    const date = entry.dt_txt.split(' ')[0];
    if (!days[date]) {
      days[date] = {
        date,
        dt: entry.dt,
        temps: [],
        entries: [],
      };
    }
    days[date].temps.push(entry.main.temp);
    days[date].entries.push(entry);
  });

  return Object.values(days)
    .slice(0, 5)
    .map((day) => {
      // Prefer the midday entry for the representative icon/condition
      const middayEntry =
        day.entries.find((e) => e.dt_txt.includes('12:00:00')) || day.entries[Math.floor(day.entries.length / 2)];

      return {
        date: day.dt,
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        condition: middayEntry.weather[0].main,
        description: middayEntry.weather[0].description,
        icon: middayEntry.weather[0].icon,
      };
    });
};

/** Returns the first 8 entries (next 24 hours, 3-hour steps) for the hourly strip. */
export const getHourlyForecast = (list) => list.slice(0, 8);

/**
 * Maps a numeric AQI index (1-5, per OpenWeather Air Pollution API) to a
 * human label and a Tailwind color class for the badge.
 */
export const getAqiInfo = (aqi) => {
  const levels = {
    1: { label: 'Good', color: 'bg-green-500' },
    2: { label: 'Fair', color: 'bg-yellow-400' },
    3: { label: 'Moderate', color: 'bg-orange-400' },
    4: { label: 'Poor', color: 'bg-red-500' },
    5: { label: 'Very Poor', color: 'bg-purple-700' },
  };
  return levels[aqi] || { label: 'Unknown', color: 'bg-gray-400' };
};

/** Maps a UV index value to a risk label and color. */
export const getUvInfo = (uv) => {
  if (uv === null || uv === undefined) return { label: 'N/A', color: 'bg-gray-400' };
  if (uv < 3) return { label: 'Low', color: 'bg-green-500' };
  if (uv < 6) return { label: 'Moderate', color: 'bg-yellow-400' };
  if (uv < 8) return { label: 'High', color: 'bg-orange-500' };
  if (uv < 11) return { label: 'Very High', color: 'bg-red-500' };
  return { label: 'Extreme', color: 'bg-purple-700' };
};

/**
 * Generates plain-language, actionable recommendations based on the
 * current weather snapshot. This is the "resume-level" smart-suggestions
 * feature — pure rule-based logic, no extra API calls needed.
 */
export const getRecommendations = (weather, uvIndex) => {
  const tips = [];
  if (!weather) return tips;

  const condition = weather.weather[0].main.toLowerCase();
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;

  if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) {
    tips.push({ icon: '☔', text: 'Carry an umbrella — rain expected today.' });
  }
  if (condition === 'thunderstorm') {
    tips.push({ icon: '⚡', text: 'Avoid open areas; lightning risk is high.' });
  }
  if (temp >= 35) {
    tips.push({ icon: '💧', text: 'Stay hydrated — temperatures are very high.' });
  }
  if (temp <= 5) {
    tips.push({ icon: '🧥', text: 'Bundle up — it’s quite cold outside.' });
  }
  if (condition === 'snow') {
    tips.push({ icon: '🧤', text: 'Roads may be slippery — drive carefully.' });
  }
  if (humidity >= 80) {
    tips.push({ icon: '🌡️', text: 'High humidity may make it feel warmer.' });
  }
  if (windSpeed >= 10) {
    tips.push({ icon: '🌬️', text: 'Strong winds — secure loose outdoor items.' });
  }
  if (uvIndex !== null && uvIndex >= 6) {
    tips.push({ icon: '🧴', text: 'High UV — wear sunscreen if going outside.' });
  }
  if (tips.length === 0) {
    tips.push({ icon: '✅', text: 'Pleasant conditions — enjoy your day!' });
  }
  return tips;
};
