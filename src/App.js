import React, { useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTitleCase = (str) => {
    return /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(str.trim());
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(`https://wttr.in/${encodeURIComponent(trimmedCity)}?format=j1`);
      if (!response.ok) throw new Error('City not found');
      
      const data = await response.json();
      const current = data.current_condition[0];
      const area = data.nearest_area[0];
      const astronomy = data.weather[0].astronomy[0];
      
      const displayCityName = isTitleCase(trimmedCity) 
        ? trimmedCity 
        : area.areaName[0].value;

      const formattedData = {
        cityName: displayCityName,
        country: area.country[0].value,
        tempC: current.temp_C,
        feelsLike: current.FeelsLikeC,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        windDir: current.winddir16Point,
        pressure: current.pressure,
        visibility: current.visibility,
        uvIndex: current.uvIndex,
        condition: current.weatherDesc[0].value,
        observationTime: current.observation_time,
        sunrise: astronomy.sunrise,
        sunset: astronomy.sunset
      };

      setWeather(formattedData);
    } catch (err) {
      setError('Could not fetch weather data. Please check the city name and try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Global Weather Analytics 🌤️</h1>
        <p style={styles.subtitle}>Advanced climate tracking and meteorological data dashboard.</p>

        <form onSubmit={fetchWeather} style={styles.form}>
          <input
            type="text"
            placeholder="Enter city (e.g., Cairo for main, cairo for station)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Fetching Live Data...' : 'Search Weather'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {weather && (
          <div style={styles.weatherCard}>
            <div style={styles.locationHeader}>
              <h2>{weather.cityName}, {weather.country}</h2>
              <span style={styles.timeBadge}>Live Data Feed</span>
            </div>

            <div style={styles.mainTempSection}>
              <div style={styles.tempDisplay}>{weather.tempC}°C</div>
              <div style={styles.conditionText}>
                <h3>{weather.condition}</h3>
                <p>Feels like: {weather.feelsLike}°C</p>
              </div>
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span>💧 Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>
              <div style={styles.detailItem}>
                <span>💨 Wind Speed</span>
                <strong>{weather.windSpeed} km/h ({weather.windDir})</strong>
              </div>
              <div style={styles.detailItem}>
                <span>⏱️ Pressure</span>
                <strong>{weather.pressure} hPa</strong>
              </div>
              <div style={styles.detailItem}>
                <span>👁️ Visibility</span>
                <strong>{weather.visibility} km</strong>
              </div>
              <div style={styles.detailItem}>
                <span>☀️ UV Index</span>
                <strong>{weather.uvIndex}</strong>
              </div>
              <div style={styles.detailItem}>
                <span>🌅 Sunrise / Sunset</span>
                <strong style={{ fontSize: '13px' }}>{weather.sunrise} / {weather.sunset}</strong>
              </div>
              <div style={styles.detailItem}>
                <span>🕒 Last Checked</span>
                <strong>{weather.observationTime}</strong>
              </div>
              <div style={styles.detailItem}>
                <span>🌍 System Status</span>
                <strong style={{ color: '#10b981' }}>Connected (Live)</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    color: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Inter, sans-serif'
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(12px)',
    padding: '35px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '680px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#38bdf8'
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '25px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: '10px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  },
  button: {
    padding: '14px 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  error: {
    padding: '12px',
    backgroundColor: 'rgba(127, 29, 29, 0.5)',
    color: '#fca5a5',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '15px'
  },
  weatherCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '14px',
    padding: '25px',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    marginTop: '20px'
  },
  locationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #334155',
    paddingBottom: '12px'
  },
  timeBadge: {
    backgroundColor: '#0369a1',
    color: '#e0f2fe',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  mainTempSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginBottom: '25px'
  },
  tempDisplay: {
    fontSize: '54px',
    fontWeight: 'bold',
    color: '#38bdf8'
  },
  conditionText: {
    fontSize: '18px'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  detailItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: '12px 15px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px'
  }
};

export default App;