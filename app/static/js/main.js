let stationsData; //stationsData needed to be created to later be assigned to
let markers = []; //markers for searchbox to place them in


// Function to fetch weather data
async function fetchWeatherData() {
  try {
    const response = await fetch("/api/weather", {});
    const data = await response.json();
    console.log("Weather Data", data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchStationData() {
  try {
    const response = await fetch("/api/stations", {
      headers: {
        "Content-Type": "application/json",
        // Additional headers here
      },
    });
    const data = await response.json();
    stationsData = data; //data from station api is assigned to the stationsData variable
    console.log("Station Data", data);

    // Call initMap after stationsData is populated
    initMap();
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

/* eslint-disable no-console */
/* global google, weatherData, stationsData */

document.addEventListener('DOMContentLoaded', () => {
  // Set zoom level for map to ensure a city-wide view.
  const ZOOM_LEVEL = 13;

  /**
   * Creates a marker on the map for a given station.
   * @param {Object} station - The station data.
   * @param {Object} station.station_info - The information about the station.
   * @param {number} station.station_info.latitude - The latitude of the station.
   * @param {number} station.station_info.longitude - The longitude of the station.
   * @param {string} station.station_info.name - The name of the station.
   * @param {Object} map - The Google Maps map object.
   * @returns {Object} The created Google Maps Marker object.
   */
  function createMarker({ station_info: { latitude, longitude, name } }, map) {
    return new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: name,
    });
  }

  /**
   * Adds a click listener to a marker that updates the UI with station and weather information.
   * @param {Object} marker - The Google Maps Marker object.
   * @param {Object} station - The station data.
   * @param {Object} station.station_info - The information about the station.
   * @param {string} station.station_info.name - The name of the station.
   * @param {Object} station.availability - The availability data for the station.
   */
  function addMarkerClickListener(marker, { station_info: { name }, availability }) {
    const stationNameCell = document.getElementById('stationNameCell');
    const availabilityCell = document.getElementById('availabilityCell');
    const tempDiv = document.getElementById('temp-div');

    marker.addListener('click', () => {
      stationNameCell.innerHTML = name;
      availabilityCell.innerHTML = `Available stands: ${availability.available_bike_stands}<br>Available bikes: ${availability.available_bikes}`;
      const roundedTemp = Math.round(weatherData.weather_info.Temperature);
      tempDiv.innerHTML = `Temperature: ${roundedTemp}°C<br>Condition: ${weatherData.weather_info.Condition}`;
    });
  }

  /**
   * Initialises the Google Maps map and adds markers for each station.
   */
window.initMap = function initMap() {
    // Ensure the Google Maps API is loaded before attempting to initialise the map.
    if (typeof google === 'undefined') {
      console.error('Google Maps API is not loaded.');
      return;
    }
  
    // Central location of Dublin to center the map on.
    const location = { lat: 53.349804, lng: -6.26031 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: ZOOM_LEVEL,
      center: location,
    });

    // Create the search box and link it to the UI element.
    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    // Listen for the event when user selects prediction
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    stationsData.forEach((station) => {
      const marker = createMarker(station, map);
      addMarkerClickListener(marker, station);
    });
};
});