"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

from flask import Blueprint, render_template

from .models.availability import Availability
from .models.station import Station
from .models.weather import Weather

# Create a Blueprint instance for the main module.
main = Blueprint("main", __name__)


@main.route("/")
def index():
    """Renders the main page.

    Returns:
        A rendered template of the main page.
    """
    return render_template("index.html")


@main.route("/stations")
def stations():
    """Renders the stations page with updated availability information.

    Fetches all stations from the database, updates each station's latest availability,
    and renders the stations page with this information.

    Returns:
        A rendered template of the stations page including stations data.
    """
    # Fetch all station records from the database to be displayed on the stations page.
    # This provides users with a comprehensive list of stations.
    stations = Station.query.all()

    for station in stations:
        # Update each station's latest availability information before rendering.
        # This loop ensures that users are presented with the most recent availability data for each station.
        station.latest_availability = (
            Availability.query.filter_by(number=station.number)
            .order_by(Availability.last_update.desc())
            .first()
        )
    # Render the stations page with the updated stations data to provide users with real-time availability information.
    return render_template("stations.html", stations=stations)


@main.route("/weather")
def weather():
    """Renders the weather page with weather data.

    Fetches all weather data from the database and renders the weather page with this information.

    Returns:
        A rendered template of the weather page including weather data.
    """
    # Fetch all weather data records from the database to be displayed on the weather page.
    # This allows users to view current weather conditions.
    weather_data = Weather.query.all()
    # Render the weather page with the fetched weather data to provide users with up-to-date weather information.
    return render_template("weather.html", weather_data=weather_data)
