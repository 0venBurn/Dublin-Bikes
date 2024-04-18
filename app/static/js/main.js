/* eslint-disable prefer-const */
/* global google */
let stationsData;
let startMarkers = [];
let endMarkers = [];
let directionsService1;
let directionsRenderer1;
let directionsService2;
let directionsRenderer2;
let directionsService3;
let directionsRenderer3;
let stationsDataList = [];
let weatherData;
let allMarkers = [];
let usableArea;
let currentDate = new Date();
const dateDropdown = document.getElementById('date');
const timeSelect = document.getElementById('time');

/**
 * Formats the station name to have each word start with an uppercase letter.
 * @param {string} name - The station name to format.
 * @returns {string} The formatted station name.
 */
function formatStationName(name) {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Displays an error message in the error container.
 * @param {string} errorMessage - The error message to display.
 */
function displayErrorMessage(errorMessage) {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.textContent = errorMessage;
    errorContainer.style.display = 'block';
  }
}

/**
 * Clears the error message from the error container.
 */
function clearErrorMessage() {
  const errorContainer = document.getElementById('error-container');
  if (errorContainer) {
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';
  }
}

/**
 * Fetches weather data from the server and updates the global weatherData variable.
 */
async function fetchWeatherData() {
  const response = await fetch('/api/weather', {});
  const data = await response.json();
  weatherData = data;
}

/**
 * Fetches station data from the server, processes it, and updates the UI accordingly.
 */
async function fetchStationData() {
  const response = await fetch('/api/stations', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  stationsData = data;

  stationsDataList = data.map((station) => ({
    number: station.station_info.number,
    latitude: station.station_info.latitude,
    longitude: station.station_info.longitude,
    name: station.station_info.name,
    availability: station.availability,
    address: station.station_info.address,
  }));

  const stationDropdown = document.getElementById('station');
  stationsDataList.forEach((station) => {
    const option = document.createElement('option');
    option.value = station.number;
    option.textContent = station.address;
    stationDropdown.appendChild(option);
  });

  if (typeof google !== 'undefined') {
    // eslint-disable-next-line no-undef
    initMap();
  }
}

/**
 * Populates the date dropdown with the next five days starting from the current date.
 */
for (let i = 0; i < 5; i += 1) {
  let formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let option = new Option(formattedDate, currentDate.toISOString().split('T')[0]);
  dateDropdown.add(option);
  currentDate.setDate(currentDate.getDate() + 1);
}

/**
 * Populates the time select dropdown with hours from 5 AM to 12 AM.
 */
for (let hour = 5; hour <= 24; hour += 1) {
  const option = document.createElement('option');
  option.value = hour;

  if (hour < 12) {
    option.textContent = `${hour} AM`;
  } else if (hour === 12) {
    option.textContent = `${hour} PM`;
  } else if (hour === 24) {
    option.textContent = `12 AM`;
  } else {
    option.textContent = `${hour - 12} PM`;
  }

  timeSelect.appendChild(option);
}

/**
 * Toggles the visibility of a section when the header is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
  const sections = [
    {
      toggleId: 'find-route-toggle',
      containerSelector: '.find-route-container .search-inputs-container',
      additionalSelector: '.best-station-container',
    },
    {
      toggleId: 'bike-prediction-toggle',
      containerSelector: '.search-prediction-form',
      additionalSelector: '.prediction-results-container',
    },
  ];

  sections.forEach((section) => {
    const header = document.getElementById(section.toggleId);
    const container = document.querySelector(section.containerSelector);
    const additionalContainer = section.additionalSelector
      ? document.querySelector(section.additionalSelector)
      : null;
    const indicator = header.querySelector('.toggle-indicator');

    header.addEventListener('click', () => {
      sections.forEach((sec) => {
        if (sec.toggleId !== section.toggleId) {
          const otherContainer = document.querySelector(sec.containerSelector);
          const otherIndicator = document
            .getElementById(sec.toggleId)
            .querySelector('.toggle-indicator');
          otherContainer.style.display = 'none';

          if (otherIndicator) {
            otherIndicator.textContent = '+';
          }

          if (sec.additionalSelector) {
            const otherAdditionalContainer = document.querySelector(sec.additionalSelector);
            if (otherAdditionalContainer) {
              otherAdditionalContainer.style.display = 'none';
            }
          }
        }
      });

      const isHidden = container.style.display === 'none' || !container.style.display;
      container.style.display = isHidden ? 'flex' : 'none';
      if (additionalContainer) {
        additionalContainer.style.display = isHidden ? 'flex' : 'none';
      }
      indicator.textContent = isHidden ? '-' : '+';
    });
  });
});

/**
 * Adds an event listener to the prediction form to handle its submission.
 * Prevents the default form submission, collects the form data, and sends it to the server.
 * Upon receiving a response, it updates the UI with the prediction result or an error message.
 */
document.getElementById('prediction-form').addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();
  const dateValue = document.getElementById('date').value;
  const date = new Date(dateValue);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time =
    document.getElementById('time').options[document.getElementById('time').selectedIndex].text;
  const station =
    document.getElementById('station').options[document.getElementById('station').selectedIndex]
      .text;
  const formData = new FormData(this);

  fetch('/predict', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('predictionText').innerHTML =
        `The predicted number of bikes available at ${station} on ${formattedDate} at ${time} is <strong>${data.prediction}</strong>.`;

      document.getElementById('resultsBox').style.display = 'block';
    })
    .catch(() => {
      displayErrorMessage(
        'There was an error while trying to predict the number of bikes available. Please try again later.',
      );
    });
});

fetchStationData();
fetchWeatherData();
setInterval(fetchWeatherData, 1800000);

/**
 * Initialises the application once the DOM content is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  const startInput = document.getElementById('start-input');
  const startSearchBox = new google.maps.places.SearchBox(startInput);

  const endInput = document.getElementById('end-input');
  const endSearchBox = new google.maps.places.SearchBox(endInput);

  const ZOOM_LEVEL = 13;

  /**
   * Creates a marker on the map for a given station.
   * @param {Object} station_info - The station information including latitude, longitude, and name.
   * @param {Object} map - The Google Maps map object where the marker will be added.
   * @returns {Object} The created Google Maps Marker object.
   */
  function createMarker({ station_info: { latitude, longitude, name } }, map) {
    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: name,
      opacity: 0.75,
    });

    allMarkers.push(marker);
    return marker;
  }

  /**
   * Adds a click event listener to a marker that updates the UI with station and weather information.
   * @param {Object} marker - The Google Maps Marker object to attach the listener to.
   * @param {Object} stationData - The station data including station information and availability.
   */
  function addMarkerClickListener(marker, { station_info: { name }, availability }) {
    const stationNameCell = document.getElementById('stationNameCell');
    const standAvailabilityCell = document.getElementById('standAvailabilityCell');
    const bikeAvailabilityCell = document.getElementById('bikeAvailabilityCell');
    const temperatureCell = document.getElementById('temperatureCell');
    const weatherConditionCell = document.getElementById('weatherConditionCell');

    marker.addListener('click', () => {
      stationNameCell.innerHTML = `<strong>Station Name:</strong> ${formatStationName(name)}`;
      standAvailabilityCell.innerHTML = `<strong>Available Stands:</strong> ${availability.available_bike_stands}`;
      bikeAvailabilityCell.innerHTML = `<strong>Available Bikes:</strong> ${availability.available_bikes}`;

      const roundedTemp = Math.round(weatherData.weather_info.Temperature);
      temperatureCell.innerHTML = `<strong>Temperature:</strong> ${roundedTemp}°C`;
      weatherConditionCell.innerHTML = `<strong>Condition:</strong> ${weatherData.weather_info.Condition}`;

      allMarkers.forEach((m) => {
        if (m === marker) {
          m.setOpacity(1.0);
        } else {
          m.setOpacity(0.5);
        }
      });
    });
  }

  /**
   * Initialises the Google Maps map, sets up directions services and renderers, and defines the usable area polygon.
   */
  window.initMap = function initMap() {
    if (typeof google === 'undefined') {
      return;
    }

    const location = { lat: 53.349804, lng: -6.26031 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: ZOOM_LEVEL,
      center: location,
    });

    directionsService1 = new google.maps.DirectionsService();
    directionsRenderer1 = new google.maps.DirectionsRenderer({
      markerOptions: {
        icon: {
          url: 'https://i.ibb.co/5x0f0Sw/markerA.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
          interactive: false,
        },
      },
    });

    directionsRenderer1.setMap(map);

    directionsService2 = new google.maps.DirectionsService();
    directionsRenderer2 = new google.maps.DirectionsRenderer({
      markerOptions: {
        icon: {
          url: 'https://i.ibb.co/5x0f0Sw/markerA.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
          interactive: false,
        },
      },
    });

    directionsRenderer2.setMap(map);

    directionsService3 = new google.maps.DirectionsService();
    directionsRenderer3 = new google.maps.DirectionsRenderer({
      markerOptions: {
        icon: {
          url: 'https://i.ibb.co/5x0f0Sw/markerA.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
          interactive: false,
        },
      },
    });
    directionsRenderer3.setMap(map);

    usableArea = new google.maps.Polygon({
      paths: [
        { lat: 53.3726786, lng: -6.1668567 },
        { lat: 53.3882428, lng: -6.246565 },
        { lat: 53.3775942, lng: -6.3386417 },
        { lat: 53.3521908, lng: -6.3716244 },
        { lat: 53.3218507, lng: -6.3262732 },
        { lat: 53.3169287, lng: -6.2472521 },
        { lat: 53.3275924, lng: -6.1716667 },
        { lat: 53.3726786, lng: -6.1668567 },
      ],
      strokeColor: '#FF0000',
      strokeOpacity: 0,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0,
      map,
    });

    map.addListener('bounds_changed', () => {
      startSearchBox.setBounds(map.getBounds());
      endSearchBox.setBounds(map.getBounds());
    });

    /**
     * Handles the selection of a location on the map, either as a start or end point.
     * It checks if the selected location is within a predefined area and updates the map accordingly.
     *
     * @param {Object} place - The place object returned by the Google Maps API.
     * @param {boolean} isStartLocation - Determines if the selected location is a start or end point.
     */
    function handleLocationSelection(place, isStartLocation) {
      if (google.maps.geometry.poly.containsLocation(place.geometry.location, usableArea)) {
        if (isStartLocation) {
          startMarkers.forEach((marker) => {
            marker.setMap(null);
          });
        } else {
          endMarkers.forEach((marker) => {
            marker.setMap(null);
          });
        }

        const markerIcon = {
          url: isStartLocation
            ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(16, 32),
        };

        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map,
          icon: markerIcon,
        });

        map.setCenter(place.geometry.location);

        if (isStartLocation) {
          startMarkers.push(marker);
        } else {
          endMarkers.push(marker);
        }
      } else {
        displayErrorMessage('Please select a location within Dublin city.');
      }
    }

    startSearchBox.addListener('places_changed', () => {
      const places = startSearchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      handleLocationSelection(places[0], true);
    });

    endSearchBox.addListener('places_changed', () => {
      const places = endSearchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      handleLocationSelection(places[0], false);
    });

    stationsData.forEach((station) => {
      const marker = createMarker(station, map);
      addMarkerClickListener(marker, station);
    });

    document.getElementById('page').appendChild(startInput);
    document.getElementById('page').appendChild(endInput);
  };

  /**
   * Finds the closest station to a given location.
   * @param {google.maps.LatLng} location - The location to find the closest station to.
   * @returns {Object} The closest station object.
   */
  function findClosestStation(location) {
    let closestStation;
    let closestDistance = Infinity;

    stationsDataList.forEach((station) => {
      const stationLocation = new google.maps.LatLng(station.latitude, station.longitude);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        location,
        stationLocation,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestStation = station;
      }
    });

    return closestStation;
  }

  /**
   * Clears all routes from the map and calculates a new route based on the selected start and end locations.
   * It first clears any existing error messages and routes on the map. Then, it retrieves the start and end locations
   * from the search boxes. If both locations are selected and within the defined usable area, it calculates the walking
   * route to the closest stations from the start and end locations, and the bicycling route between these two stations.
   * Finally, it updates the UI with the best start and end stations.
   */
  function calcRoute() {
    clearErrorMessage();

    directionsRenderer1.setDirections({ routes: [] });
    directionsRenderer2.setDirections({ routes: [] });
    directionsRenderer3.setDirections({ routes: [] });

    const startLocation = startSearchBox.getPlaces()[0].geometry.location;
    const endLocation = endSearchBox.getPlaces()[0].geometry.location;
    const bestStartStation = findClosestStation(startLocation);
    const bestEndStation = findClosestStation(endLocation);

    if (!startLocation || !endLocation) {
      displayErrorMessage('Please select both a start and end location.');
      return;
    }

    if (
      !google.maps.geometry.poly.containsLocation(startLocation, usableArea) ||
      !google.maps.geometry.poly.containsLocation(endLocation, usableArea)
    ) {
      displayErrorMessage('Please select locations within Dublin city.');
      return;
    }

    if (startLocation && bestStartStation && endLocation && bestEndStation) {
      const request1 = {
        origin: startLocation,
        destination: new google.maps.LatLng(bestStartStation.latitude, bestStartStation.longitude),
        travelMode: 'WALKING',
      };

      const request2 = {
        origin: endLocation,
        destination: new google.maps.LatLng(bestEndStation.latitude, bestEndStation.longitude),
        travelMode: 'WALKING',
      };

      directionsService1.route(request1, (response1, status1) => {
        if (status1 === 'OK') {
          directionsRenderer1.setDirections(response1);
          clearErrorMessage();

          directionsService2.route(request2, (response2, status2) => {
            if (status2 === 'OK') {
              directionsRenderer2.setDirections(response2);
              clearErrorMessage();

              const request3 = {
                origin: response1.routes[0].legs[0].start_location,
                destination: response2.routes[0].legs[0].end_location,
                travelMode: 'BICYCLING',
              };

              directionsService3.route(request3, (response3, status3) => {
                if (status3 === 'OK') {
                  directionsRenderer3.setDirections(response3);
                  clearErrorMessage();
                } else {
                  displayErrorMessage(
                    'There was an error while trying to calculate the route. Please try again later.',
                  );
                }
              });
            } else {
              displayErrorMessage(
                'There was an error while trying to calculate the route. Please try again later.',
              );
            }
          });
        } else {
          displayErrorMessage(
            'There was an error while trying to calculate the route. Please try again later.',
          );
        }
      });
      document.getElementById('bestStartStationCell').innerHTML =
        `<strong>Best Start Station:</strong> ${formatStationName(bestStartStation.name)}`;
      document.getElementById('bestEndStationCell').innerHTML =
        `<strong>Best End Station:</strong> ${formatStationName(bestEndStation.name)}`;
    } else {
      displayErrorMessage(
        'There was an error while trying to calculate the route. Please try again later.',
      );
    }
  }

  const button = document.getElementById('go-button');
  button.addEventListener('click', () => {
    calcRoute();
  });
});
