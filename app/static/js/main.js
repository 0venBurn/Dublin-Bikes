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

    stationsData.forEach((station) => {
      const marker = createMarker(station, map);
      addMarkerClickListener(marker, station);
    });
  };
});
