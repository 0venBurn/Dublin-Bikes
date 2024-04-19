"""
This module defines the Station model.

The Station model represents a physical station where bikes are available for rent. It includes
information such as the station number, address, availability of banking options, number of bike stands,
station name, and its geographical position (latitude and longitude).
"""

from app.extensions import db


class Station(db.Model):  # type: ignore
    """Represents a bike rental station."""

    __tablename__ = "station"

    number = db.Column(db.Integer, primary_key=True, autoincrement=False)
    address = db.Column(db.String(128))
    banking = db.Column(db.Integer)
    bike_stands = db.Column(db.Integer)
    name = db.Column(db.String(128))
    position_lat = db.Column(db.Float)
    position_lng = db.Column(db.Float)

    # Create a relationship with the availability table.
    availabilities = db.relationship("Availability", backref="station", lazy=True)
