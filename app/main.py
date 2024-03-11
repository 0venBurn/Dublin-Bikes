"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

import os

from flask import Blueprint, render_template
from flask_cors import CORS

from .routes.data_fetcher import get_latest_weather_data, get_stations_data

# Create a Blueprint instance for the main module.
main = Blueprint("main", __name__)
CORS(main)


@main.route("/")
def index():
    """Renders the main page."""
    # Fetch the Google Maps API key from environment variables
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API", "")

    return render_template(
        "index.html",
        google_maps_api_key=google_maps_api_key,
    )


@main.route("/api/weather")  # type: ignore
def weather_data():
    """Api Endpoint for fetching weather data from database."""
    return get_latest_weather_data()


@main.route("/api/stations")
def stations_data():
    """API endpoint for fetching recent station data from database."""
    return get_stations_data()
