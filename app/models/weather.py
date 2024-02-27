"""
This module defines the Weather model which represents weather data in the database.

Classes:
    Weather: A database model representing the weather conditions for a specific date and station.
"""
# TODO: Update docstrings to match Evan's descriptions in the scraper files.

from app.extensions import db


class Weather(db.Model):  # type: ignore
    """Model for weather data."""

    __tablename__ = "weather"

    WeatherID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Timestamp = db.Column(db.DateTime)
    Temperature = db.Column(db.Numeric(precision=5, scale=2))
    FeelsLike = db.Column(db.Numeric(precision=5, scale=2))
    TempMin = db.Column(db.Numeric(precision=5, scale=2))
    TempMax = db.Column(db.Numeric(precision=5, scale=2))
    Pressure = db.Column(db.Integer)
    Humidity = db.Column(db.Integer)
    Visibility = db.Column(db.Integer)
    WindSpeed = db.Column(db.Numeric(precision=5, scale=2))
    WindDeg = db.Column(db.Integer)
    Cloudiness = db.Column(db.Integer)
    WeatherCondition = db.Column(db.String(255))
    WeatherDescription = db.Column(db.String(255))
