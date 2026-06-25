import {
  formatTime,
  getWeatherIconUrl,
  msToKmh,
  metersToKm,
  getAqiInfo,
  getUvInfo,
  getRecommendations,
  getHourlyForecast,
  formatHour,
} from '../utils/weatherUtils';

/**
 * StatTile
 * Small reusable glassmorphism tile for a single metric (humidity, wind, etc).
 */
const StatTile = ({ icon, label, value }) => (
  <div className="rounded-xl bg-white/15 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 p-4 flex flex-col gap-1 transition-all duration-300 hover:bg-white/25 dark:hover:bg-black/30 hover:-translate-y-0.5">
    <div className="flex items-center gap-2 text-white/70 dark:text-white/50 text-xs font-medium uppercase tracking-wide">
      <span className="text-base">{icon}</span>
      {label}
    </div>
    <div className="text-white font-semibold text-lg">{value}</div>
  </div>
);

/**
 * WeatherCard
 * The centerpiece of the dashboard: current conditions, a metrics grid,
 * AQI + UV badges, an hourly forecast strip, and dynamic recommendations.
 */
const WeatherCard = ({ weather, airQuality, uvIndex, hourly }) => {
  if (!weather) return null;

  const {
    name,
    sys,
    main,
    weather: weatherArr,
    wind,
    visibility,
    timezone,
  } = weather;

  const condition = weatherArr[0];
  const aqiInfo = airQuality ? getAqiInfo(airQuality) : null;
  const uvInfo = getUvInfo(uvIndex);
  const recommendations = getRecommendations(weather, uvIndex);
  const hourlyData = hourly ? getHourlyForecast(hourly) : [];

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Main card */}
      <div className="rounded-3xl bg-white/20 dark:bg-black/25 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl p-6 sm:p-8 transition-all duration-500">
        {/* Header: location + icon */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
              {name}
            </h2>
            <p className="text-white/80 dark:text-white/60 font-medium">{sys.country}</p>
          </div>
          <div className="flex flex-col items-center animate-float">
            <img
              src={getWeatherIconUrl(condition.icon)}
              alt={condition.description}
              className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Temperature + condition */}
        <div className="mb-6">
          <div className="flex items-end gap-2">
            <span className="text-6xl sm:text-7xl font-bold text-white drop-shadow-md leading-none">
              {Math.round(main.temp)}°
            </span>
            <span className="text-xl text-white/80 mb-2">C</span>
          </div>
          <p className="text-white/90 dark:text-white/70 text-lg font-medium capitalize mt-1">
            {condition.description}
          </p>
          <p className="text-white/70 dark:text-white/50 text-sm">
            Feels like {Math.round(main.feels_like)}°C
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatTile icon="💧" label="Humidity" value={`${main.humidity}%`} />
          <StatTile icon="🌬️" label="Wind" value={`${msToKmh(wind.speed)} km/h`} />
          <StatTile icon="🎯" label="Pressure" value={`${main.pressure} hPa`} />
          <StatTile icon="👁️" label="Visibility" value={`${metersToKm(visibility)} km`} />
        </div>

        {/* Sunrise / Sunset */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatTile icon="🌅" label="Sunrise" value={formatTime(sys.sunrise, timezone)} />
          <StatTile icon="🌇" label="Sunset" value={formatTime(sys.sunset, timezone)} />
        </div>

        {/* AQI + UV badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl bg-white/15 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 p-4">
            <div className="text-white/70 dark:text-white/50 text-xs font-medium uppercase tracking-wide mb-1.5">
              Air Quality
            </div>
            {aqiInfo ? (
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${aqiInfo.color}`} />
                <span className="text-white font-semibold">{aqiInfo.label}</span>
              </div>
            ) : (
              <span className="text-white/60 text-sm">Unavailable</span>
            )}
          </div>
          <div className="rounded-xl bg-white/15 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 p-4">
            <div className="text-white/70 dark:text-white/50 text-xs font-medium uppercase tracking-wide mb-1.5">
              UV Index
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${uvInfo.color}`} />
              <span className="text-white font-semibold">
                {uvIndex !== null ? `${uvIndex} · ${uvInfo.label}` : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Hourly forecast strip */}
        {hourlyData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white/80 dark:text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
              Hourly Forecast
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
              {hourlyData.map((h, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 flex flex-col items-center gap-1 rounded-xl bg-white/15 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/5 px-4 py-3 min-w-[72px] transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="text-white/70 text-xs font-medium">
                    {formatHour(h.dt)}
                  </span>
                  <img
                    src={getWeatherIconUrl(h.weather[0].icon)}
                    alt={h.weather[0].description}
                    className="w-9 h-9"
                    loading="lazy"
                  />
                  <span className="text-white font-semibold text-sm">
                    {Math.round(h.main.temp)}°
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-white/80 dark:text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
              Recommendations
            </h3>
            <div className="flex flex-col gap-2">
              {recommendations.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-xl bg-white/10 dark:bg-black/15 backdrop-blur-md border border-white/15 dark:border-white/5 px-4 py-2.5 transition-all duration-300 hover:bg-white/20"
                >
                  <span className="text-xl">{tip.icon}</span>
                  <span className="text-white/90 dark:text-white/80 text-sm font-medium">
                    {tip.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
