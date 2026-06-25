import { useState, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * useWeather
 * Centralizes all OpenWeather API interactions: current weather, 5-day
 * forecast, air quality, and UV index. Exposes loading/error state so
 * UI components stay declarative.
 */
const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Internal helper: fetch air quality + UV using lat/lon. Fails silently
   *  (these are "bonus" data points — a failure here shouldn't block the
   *  core weather display). */
  const fetchExtras = useCallback(async (lat, lon) => {
    try {
      const aqiRes = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (aqiRes.ok) {
        const aqiData = await aqiRes.json();
        setAirQuality(aqiData.list?.[0]?.main?.aqi ?? null);
      }
    } catch {
      setAirQuality(null);
    }

    try {
      // OpenWeather's free-tier "onecall" UV data isn't always available,
      // so we use the dedicated UV index endpoint as a graceful fallback.
      const uvRes = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (uvRes.ok) {
        const uvData = await uvRes.json();
        setUvIndex(typeof uvData.value === 'number' ? uvData.value : null);
      } else {
        setUvIndex(null);
      }
    } catch {
      setUvIndex(null);
    }
  }, []);

  /** Fetches current weather + forecast by city name. */
  const fetchWeatherByCity = useCallback(async (city) => {
    if (!city || !city.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const weatherRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );

      if (!weatherRes.ok) {
        if (weatherRes.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        }
        if (weatherRes.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeather API key configuration.');
        }
        throw new Error('Something went wrong while fetching weather data. Please try again.');
      }

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const { lat, lon } = weatherData.coord;

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData.list);
        setHourly(forecastData.list);
      }

      await fetchExtras(lat, lon);

      return weatherData;
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeather(null);
      setForecast([]);
      setHourly([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExtras]);

  /** Fetches current weather + forecast by raw coordinates (geolocation). */
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const weatherRes = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!weatherRes.ok) {
        throw new Error('Unable to fetch weather for your location. Please try again.');
      }

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData.list);
        setHourly(forecastData.list);
      }

      await fetchExtras(lat, lon);

      return weatherData;
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeather(null);
      setForecast([]);
      setHourly([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExtras]);

  const clearError = useCallback(() => setError(null), []);

  return {
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
  };
};

export default useWeather;
