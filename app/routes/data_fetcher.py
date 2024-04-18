"""Module for fetching data from the database.

This module contains functions for fetching weather and station data from the database.
It includes functionality to serialize datetime objects for JSON responses and to
optimize database queries for performance.
"""

import json
import logging
from typing import Any

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import aliased, load_only
from sqlalchemy.sql import func

from app.extensions import db
from app.models.availability import Availability
from app.models.station import Station
from app.models.weather import Weather


def serialize_datetime(dt: Any) -> Any:
    """Serialises datetime objects to a JSON - friendly format.

    Args:
        dt(datetime.datetime): The datetime object to serialise.

    Returns:
        str: A string representation of the datetime in "%Y-%m-%d %H:%M:%S" format,
             or None if dt is None.
    """
    return dt.strftime("%Y-%m-%d %H:%M:%S")


def get_latest_weather_data():
    """Fetches the latest weather data from the database.

    Queries the database for the most recent weather data entry, formats it into a
    dictionary, and returns it. If an error occurs during the database query, it logs
    the exception and returns an empty dictionary.

    Returns:
        dict: A dictionary containing the latest weather data if successful,
              otherwise an empty dictionary.
    """
    try:
        # Use load_only to optimise performance by loading only the necessary
        # fields.
        latest_weather = (
            Weather.query.options(
                load_only(
                    Weather.Temperature,
                    Weather.FeelsLike,
                    Weather.WeatherCondition,
                    Weather.WeatherDescription,
                    Weather.Humidity,
                    Weather.WindSpeed,
                    Weather.Visibility,
                )
            )
            .order_by(Weather.Timestamp.desc())
            .first()
        )
    except SQLAlchemyError:
        # Log the exception for debugging and maintenance.
        logging.exception("Error fetching latest weather data.")
        return {}
    else:
        if latest_weather:
            # Separate the general weather info from more specific details for
            # better readability and organization.
            if latest_weather:
                return json.dumps({
                    "weather_info": {
                        "Temperature": float(latest_weather.Temperature),
                        "FeelsLike": float(latest_weather.FeelsLike),
                        "Condition": latest_weather.WeatherCondition,
                        "Description": latest_weather.WeatherDescription,
                    },
                    "details": {
                        "Humidity": float(latest_weather.Humidity),
                        "WindSpeed": float(latest_weather.WindSpeed),
                        "Visibility": float(latest_weather.Visibility),
                    },
                })
            return json.dumps({})


def get_stations_data():
    """Fetches data for all stations from the database.

    Queries the database for all station entries, including their latest availability
    information. It formats each station's data into a dictionary and returns a list
    of these dictionaries. If an error occurs during the database query, it logs the
    exception and returns an empty list.

    Returns:
        list: A list of dictionaries, each containing data for a
        single station, if successful. Otherwise, an empty list.
    """
    try:
        # Use an alias to avoid conflicts in the subquery.
        latest_availability_alias = aliased(Availability)

        # Subquery to get the latest availability for each station.
        # Used to join with the stations query to get the latest availability
        # for each station.
        # Subquery is used to avoid using a GROUP BY clause in the main query,
        # which can be slow.
        latest_availability_subquery = (
            db.session.query(
                latest_availability_alias.number,
                func.max(latest_availability_alias.last_update).label("latest_update"),
            )
            .group_by(latest_availability_alias.number)
            .subquery()
        )

        # Joining on the subquery ensures we only get the latest availability
        # for each station, optimizing query time.
        stations_query = (
            db.session.query(Station, Availability)
            .join(Availability, Station.number == Availability.number)
            .join(
                latest_availability_subquery,
                (Station.number == latest_availability_subquery.c.number)
                & (
                    Availability.last_update
                    == latest_availability_subquery.c.latest_update
                ),
            )
        )

    except SQLAlchemyError:
        # Log the exception for debugging and maintenance.
        logging.exception("Error fetching stations data.")
        return []

    else:
        stations_with_latest_availability = []
        for station, availability in stations_query.all():
            station_data = {
                "station_info": {
                    "number": station.number,
                    "name": station.name,
                    "address": station.address,
                    "latitude": station.position_lat,
                    "longitude": station.position_lng,
                    "banking": station.banking,
                    "bike_stands": station.bike_stands,
                },
                "availability": {
                    "available_bikes": availability.available_bikes,
                    "available_bike_stands": availability.available_bike_stands,
                    "status": availability.status,
                    "last_update": serialize_datetime(availability.last_update),
                },
            }
            stations_with_latest_availability.append(station_data)

        return json.dumps(stations_with_latest_availability)
