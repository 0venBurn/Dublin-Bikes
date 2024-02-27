"""Routes for main page."""

from __future__ import annotations

from flask import Blueprint, render_template

from .models import Availability, Station, Weather

main = Blueprint("main", __name__)


@main.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")


@main.route("/stations")
def stations():
    """Render the stations page."""
    stations = Station.query.all()
    for station in stations:
        station.latest_availability = (
            Availability.query.filter_by(number=station.number)
            .order_by(Availability.last_update.desc())
            .first()
        )
    return render_template("stations.html", stations=stations)


@main.route("/weather")
def weather():
    """Render the weather page."""
    weather_data = Weather.query.all()
    return render_template("weather.html", weather_data=weather_data)
