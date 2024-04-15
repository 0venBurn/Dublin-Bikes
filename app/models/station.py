"""
This module defines the Station model which represents the station data in the database.

Classes:
    Station: A database model representing a station with its details and availability information.
"""

from app.extensions import db


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
    # Create a relationship with the availability table.
    availabilities = db.relationship("Availability", backref="station", lazy=True)
