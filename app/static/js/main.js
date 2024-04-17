let stationsData; //stationsData needed to be created to later be assigned to
let startMarkers = []; //markers for searchbox to place them in
let endMarkers = [];
let directionsService1;
let directionsRenderer1;
let directionsService2;
let directionsRenderer2;
let directionsService3;
let directionsRenderer3;
let stationsDataList = [];




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
      },
    });
    const data = await response.json();
    stationsData = data; //data from station api is assigned to the stationsData variable
    console.log("Station Data", data);


    stationsDataList = data.map(station => ({
    number: station.station_info.number,
    latitude: station.station_info.latitude,
    longitude: station.station_info.longitude,
    name: station.station_info.name,
    availability: station.availability,
    address: station.station_info.address,

    }));
    const stationDropdown = document.getElementById('station');
     stationsDataList.forEach(station => {
            const option = document.createElement('option');
            option.value = station.number; // Set value to station name 
            option.textContent = station.address; // Display text as station name
            stationDropdown.appendChild(option);
        });

    // Call initMap after stationsData is populated
    initMap();
  } catch (error) {
    console.error("Error fetching station data:", error);
  }
}

const dateDropdown = document.getElementById('date');
let currentDate = new Date();
for (let i = 0; i < 5; i++) {
  let dateString = currentDate.toISOString().split('T')[0];
  let option = new Option(dateString, dateString);
  dateDropdown.add(option);
  currentDate.setDate(currentDate.getDate() + 1);
}
// Get the select element
const timeSelect = document.getElementById('time');

// Iterate over the hours from 5 to 24
for (let hour = 5; hour <= 24; hour++) {
  // Create a new option element
  const option = document.createElement('option');
  option.value = hour; // Set the value to the hour

  // Format the hour as a string and set it as the text
  if (hour < 12) {
    option.textContent = `${hour} AM`;
  } else if (hour === 12) {
    option.textContent = `${hour} PM`;
  } else if (hour === 24) {
    option.textContent = `12 AM`;
  } else {
    option.textContent = `${hour - 12} PM`;
  }

  // Append the option to the select
  timeSelect.appendChild(option);
}
document.getElementById('prediction-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('resultsText').innerText = "Prediction " + data.prediction;
        document.getElementById('resultsBox').style.display = 'block'; // Show the results box
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultsText').innerText = 'Failed to load prediction: ' + error.message;
        document.getElementById('resultsBox').style.display = 'block'; // Show error in results box
    });
});



// Fetch station data initially
fetchStationData();
fetchWeatherData();
// Set interval to fetch station data every 5 minutes (300,000 milliseconds)
//setInterval(fetchStationData, 300000); // Fetch station data every 5 minutes (300,000 milliseconds)
setInterval(fetchWeatherData, 1800000); // Fetch weather data every 30 minutes (1,800,000 milliseconds)

/* eslint-disable no-console */
/* global google, weatherData, stationsData */

document.addEventListener('DOMContentLoaded', () => {
    // create search boxes for start and end location outside of initMap so they stay after refresh
    const start_input = document.getElementById('start-input');
    const startSearchBox = new google.maps.places.SearchBox(start_input);

    const end_input = document.getElementById('end-input');
    const endSearchBox = new google.maps.places.SearchBox(end_input);


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
      opacity: 0.75
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
      tempDiv.innerHTML = `Temperature: ${roundedTemp}Â°C<br>Condition: ${weatherData.weather_info.Condition}`;
    });
  }

  /**
   * Initialises the Google Maps map and adds markers for each station.
   */
  window.initMap = function initMap() {
    // Ensure the Google Maps API is loaded before attempting to initialize the map.
    if (typeof google === 'undefined') {
      console.error('Google Maps API is not loaded.');
      return;
    }

    // Central location of Dublin to centre the map on.
    const location = { lat: 53.349804, lng: -6.26031 };
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: ZOOM_LEVEL,
      center: location,
    });

  directionsService1 = new google.maps.DirectionsService();
  directionsRenderer1 = new google.maps.DirectionsRenderer({
    markerOptions: {
      icon: {
        // Set custom icon for both A and B markers
        url: 'https://i.ibb.co/5x0f0Sw/markerA.png',
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0), //origin point of the icon, 0,0 is the top-left corner
        anchor: new google.maps.Point(16, 32), //anchor point of the icon, 16,32 is centre of the icon
        interactive: false
      }
    }
  });
  directionsRenderer1.setMap(map);

  directionsService2 = new google.maps.DirectionsService();
  directionsRenderer2 = new google.maps.DirectionsRenderer({
    markerOptions: {
      icon: {
        // Set custom icon for both A and B markers
        url: 'https://i.ibb.co/5x0f0Sw/markerA.png',
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32),
        interactive: false
      }
    }
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
        interactive: false
      }
    }
  });
  directionsRenderer3.setMap(map);


    let usableArea = new google.maps.Polygon({
    paths: [
        {lat:53.3726786, lng:-6.1668567},
        {lat:53.3882428, lng:-6.2465650},
        {lat:53.3775942, lng:-6.3386417},
        {lat:53.3521908, lng:-6.3716244},
        {lat:53.3218507, lng:-6.3262732},
        {lat:53.3169287, lng:-6.2472521},
        {lat:53.3275924, lng:-6.1716667},
        {lat:53.3726786, lng:-6.1668567},
    ],
    strokeColor: '#FF0000',
    strokeOpacity: 0,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0,
    map: map
    });


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', () => {
      startSearchBox.setBounds(map.getBounds());
      endSearchBox.setBounds(map.getBounds());
    });

//function to handle if location is inside the bounds of polygon
function handleLocationSelection(place, isStartLocation) {
  //check if inside polygon
  if (google.maps.geometry.poly.containsLocation(place.geometry.location, usableArea)) {
    //clear previous markers based on if start(true) or end (false)
    if (isStartLocation) {
      startMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      //startMarkers = [];
    } else {
      endMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      //endMarkers = [];
    }

      const markerIcon = {
      url: isStartLocation ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      scaledSize: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 32)
    };
    //create a marker at the selected place
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      icon: markerIcon
    });
    map.setCenter(place.geometry.location);


    if (isStartLocation) {
      startMarkers.push(marker);
    } else {
      endMarkers.push(marker);
    }
  } else {
    // If outside, show a message or take appropriate action
    alert('Location can only be set inside Dublin City.');
    return;
  }
}



    startSearchBox.addListener('places_changed', () => {
      const places = startSearchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
      handleLocationSelection(places[0], true);

    });


    endSearchBox.addListener('places_changed', () => {
      const places = endSearchBox.getPlaces();

      if (places.length == 0) {
        return;
      }
    handleLocationSelection(places[0], false);

    });

    // Render markers for existing stationsData
    stationsData.forEach((station) => {
      const marker = createMarker(station, map);
      addMarkerClickListener(marker, station);
    });
    //position the search boxes outside of the map div
    document.getElementById("page").appendChild(start_input);
    document.getElementById("page").appendChild(end_input);
  };

function calcRoute() {

  directionsRenderer1.setDirections({ routes: [] });
  directionsRenderer2.setDirections({ routes: [] });
  directionsRenderer3.setDirections({ routes: [] });
  // Get the coordinates of the start location and the best start station
  var startLocation = startSearchBox.getPlaces()[0].geometry.location;
  var endLocation = endSearchBox.getPlaces()[0].geometry.location;
  var bestStartStation = findClosestStation(startLocation);
  var bestEndStation = findClosestStation(endLocation);

  // Check if both startLocation and bestStartStation are available
  if (startLocation && bestStartStation && endLocation && bestEndStation) {
    // Create the request for the Directions Service
    var request1 = {
      origin: startLocation,
      destination: new google.maps.LatLng(bestStartStation.latitude, bestStartStation.longitude),
      travelMode: 'WALKING'
    };
    var request2 = {
    origin: endLocation,
    destination: new google.maps.LatLng(bestEndStation.latitude, bestEndStation.longitude),
    travelMode: 'WALKING'
    };

    directionsService1.route(request1, function(response1, status1) {
      if (status1 === 'OK') {
         directionsRenderer1.setDirections(response1);


        directionsService2.route(request2, function(response2, status2) {
          if (status2 === 'OK') {
             directionsRenderer2.setDirections(response2);


            var request3 = {
              origin: response1.routes[0].legs[0].start_location,
              destination: response2.routes[0].legs[0].end_location,
              travelMode: 'BICYCLING'
            };

            directionsService3.route(request3, function(response3, status3) {
              if (status3 === 'OK') {
                directionsRenderer3.setDirections(response3);
              } else {
                window.alert('Directions request failed due to ' + status3);
              }
            });
          } else {
            window.alert('Directions request failed due to ' + status2);
          }
        });
      } else {
        window.alert('Directions request failed due to ' + status1);
      }
    });
  } else {
    window.alert('Start location, end location, best start station, or best end station is not available.');
  }
}

      function findClosestStation(location) {
      let closestStation;
      let closestDistance = Infinity;

      stationsDataList.forEach(station => {
        const stationLocation = new google.maps.LatLng(station.latitude, station.longitude);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(location, stationLocation);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestStation = station;
        }
     });

      return closestStation;
      }

    const button = document.getElementById("go-button");
    button.onclick = calcRoute;
});
