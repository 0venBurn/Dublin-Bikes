"""
This module defines the Availability model.

The Availability model represents the availability data for a station, including
the number of available bikes, bike stands, and the status of the station.
"""

from app.extensions import db


class Availability(db.Model):  # type: ignore
    """Represents a station's availability data."""

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
