let stationsData; //stationsData needed to be created to later be assigned to
let startMarkers = []; //markers for searchbox to place them in
let endMarkers = [];
let directionsService;
let directionsRenderer;


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

        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

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

    // Add search boxes to map controls, start and end have different functionality
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(start_input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(end_input);

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

    //create a marker at the selected place
    var marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map
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

    //assigned inside of initMap to get the map values
    //directionsRenderer = new google.maps.directionsRenderer();
    //directionsRenderer.setMap(map);

    

  };
  
    function calcRoute(){
      var source = startMarkers[0].getPosition(); //getPosition used because source and dest need long/lat values
      var dest = endMarkers[0].getPosition();
      //var source = {lat: 53.3498, lng: -6.2603};
      //var dest = {lat: 56.3498, lng: -6.2603};

      let request = {
        origin: source,
        destination: dest,
        travelMode: 'WALKING',
      }
    
      directionsService.route(request, function(result, status){
        if(status == "OK"){
          directionsRenderer.setDirections(result)
        } else {
            window.alert('Directions request failed');
        }
      });
      //best choice for start and end stations
      var bestStart = findClosestStation(source);
      var bestEnd = findClosestStation(dest);
    }

      function findClosestStation(location) {
      let closestStation;
      let closestDistance = Infinity;

    //function for finding closest station by iterating over StationsData (WIP)
      stationsData.forEach(station => {
          const stationLocation = new google.maps.LatLng(station.latitude, station.longitude);
          const distance = google.maps.geometry.spherical.calcDistanceBetween(location, stationLocation);
        
          if (distance < closestDistance) {
              closestDistance = distance;
              closestStation = station;
          }
      });

      return closestStation;
    }
    const button = document.getElementById("goButton");
    button.onclick = calcRoute;
});