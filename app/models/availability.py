"""
This module defines the Availability model which represents the availability data for stations in the database.

Classes:
    Availability: A database model representing the real-time availability information of bikes and stands at a station.
"""

from app.extensions import db


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
