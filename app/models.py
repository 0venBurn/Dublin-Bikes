"""Models for the app."""

from __future__ import annotations

from .extensions import db


class Station(db.Model):  # type: ignore
    """Model for a station."""

    __tablename__ = "station"

    number = db.Column(db.Integer, primary_key=True, autoincrement=False)
    address = db.Column(db.String(128))
    banking = db.Column(db.Integer)
    bike_stands = db.Column(db.Integer)
    name = db.Column(db.String(128))
    position_lat = db.Column(db.Float)
    position_lng = db.Column(db.Float)
    # Create a relationship with the availability table
    availabilities = db.relationship("Availability", backref="station", lazy=True)


class Availability(db.Model):  # type: ignore
    """Model for a station's availability."""

    __tablename__ = "availability"

    number = db.Column(
        db.Integer,
        db.ForeignKey("station.number"),
        primary_key=True,
        autoincrement=False,
    )
    last_update = db.Column(db.DateTime, primary_key=True, autoincrement=False)
    available_bikes = db.Column(db.Integer)
    available_bike_stands = db.Column(db.Integer)
    status = db.Column(db.String(128))


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
