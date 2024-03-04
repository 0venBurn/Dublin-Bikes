"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

import os

from flask import Blueprint, render_template

from .routes.data_fetcher import get_latest_weather_data, get_stations_data

# Create a Blueprint instance for the main module.
main = Blueprint("main", __name__)


@main.route("/")
def index():
    """Renders the main page."""
    # Fetch the latest weather data from the database.
    weather_data = get_latest_weather_data()
    # Fetch stations and their latest availability using the relationship
    stations_data = get_stations_data()
    # Fetch the Google Maps API key from environment variables
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API", "")

    return render_template(
        "index.html",
        weather=weather_data,
        stations=stations_data,
        google_maps_api_key=google_maps_api_key,
    )
