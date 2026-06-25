import { formatDate, getWeatherIconUrl } from '../utils/weatherUtils';

/**
 * ForecastCard
 * Renders the 5-day forecast as a responsive grid of glassmorphism cards.
 * Receives pre-grouped daily data (see weatherUtils.groupForecastByDay).
 */
const ForecastCard = ({ forecastDays }) => {
  if (!forecastDays || forecastDays.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 animate-slide-up">
      <h3 className="text-white/90 dark:text-white/70 text-sm font-semibold uppercase tracking-wider mb-3 px-1">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {forecastDays.map((day, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white/15 dark:bg-black/20 backdrop-blur-xl border border-white/25 dark:border-white/10 p-4 flex flex-col items-center gap-1.5 shadow-lg transition-all duration-300 hover:bg-white/25 dark:hover:bg-black/30 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="text-white/80 text-sm font-semibold">
              {formatDate(day.date)}
            </span>
            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              className="w-14 h-14 my-1"
              loading="lazy"
            />
            <span className="text-white/70 text-xs capitalize text-center leading-tight">
              {day.description}
            </span>
            <div className="flex items-center gap-2 text-sm mt-1">
              <span className="text-white font-bold">{Math.round(day.maxTemp)}°</span>
              <span className="text-white/60">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
