
// Function to fetch weather data
async function fetchWeatherData() {
  try {
    const response = await fetch('/api/weather', {});
    const data = await response.json();
    console.log("Weather Data", data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchStationData() {
  try {
    const response = await fetch('/api/stations', {
      headers: {
        'Content-Type': 'application/json',
        // Additional headers here
      }
    });
    const data = await response.json();
    console.log("Station Data", data);
  } catch (error) {
    console.error("Error fetching station data:", error);
  }
}

// Fetch station data initially
fetchStationData();
fetchWeatherData();
// Set interval to fetch station data every 5 minutes (300,000 milliseconds)
setInterval(fetchStationData, 300000); // Fetch station data every 5 minutes (300,000 milliseconds)
setInterval(fetchWeatherData, 1800000); // Fetch weather data every 30 minutes (1,800,000 milliseconds)

