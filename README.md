Frontend component for web app contained in a Flask application.

Basic Flask directory structure with the index.html stored inside of the templates folder and the JavaScript and CSS files inside of the static folder.

Main JavaScript is running the Google Maps and OpenWeather APIs and feeding the data into divs within the HTML index file.

Station data is currently being accessed locally within the JavaScript, all stations are inside of an array. Will eventually be altered to feed directly from the database on RDS.

Page loads the weather on load and station data is fed into the table on the left once a user clicks one of the station markers with their mouse cursor.