"""Data fetcher module for querying and formatting weather and station data.

This module contains functions that interact with the database to fetch and
format data related to weather conditions and station availabilities. It handles
exceptions by logging them and returning default empty structures (either
dictionaries or lists) depending on the function.

Functions:
    get_latest_weather_data:
        Fetches and returns the latest weather data in a formatted dictionary.

    get_stations_data:
        Fetches and returns a list of dictionaries, each containing data for a
        single station.
"""

import logging
from typing import Any

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload

from app.models.station import Station
from app.models.weather import Weather


def get_latest_weather_data() -> dict[str, Any]:
    """Fetches the latest weather data from the database.

    This function queries the database for the most recent weather data entry,
    formats it into a dictionary, and returns it. If an error occurs during the
    database query, it logs the exception and returns an empty dictionary.

    Returns:
        dict[str, Any]: A dictionary containing the latest weather data if
        successful, otherwise an empty dictionary.
    """
    try:
        # Eager loading to optimise query performance by reducing the number of
        # database hits.
        # Order by timestamp in descending order to get the most recent weather
        # data.
        latest_weather = Weather.query.order_by(Weather.Timestamp.desc()).first()
    except SQLAlchemyError:
        # Log the exception for debugging and maintenance.
        logging.exception("Error fetching latest weather data")
        return {}
    else:
        if latest_weather:
            # Seperate the general weather info from more specific details for
            # better readability and organisation.
            return {
                "weather_info": {
                    "Temperature": latest_weather.Temperature,
                    "FeelsLike": latest_weather.FeelsLike,
                    "Condition": latest_weather.WeatherCondition,
                    "Description": latest_weather.WeatherDescription,
                },
                "details": {
                    "Humidity": latest_weather.Humidity,
                    "WindSpeed": latest_weather.WindSpeed,
                    "Visibility": latest_weather.Visibility,
                },
            }
        return {}


def get_stations_data() -> list[dict[str, Any]]:
    """Fetches data for all stations from the database.

    This function queries the database for all station entries, including their
    latest availability information. It formats each station's data into a
    dictionary and returns a list of these dictionaries. If an error occurs
    during the database query, it logs the exception and returns an empty list.

    Returns:
        list[dict[str, Any]]: A list of dictionaries, each containing data for a
        single station, if successful. Otherwise, an empty list.
    """
    try:
        # Eager loading to optimise query performance by reducing the number of
        # database hits.
        # Join the Station and Availability tables to get the latest
        # availability data for each station.
        stations = Station.query.options(joinedload(Station.availabilities)).all()  # type: ignore
    except SQLAlchemyError:
        # Log the exception for debugging and maintenance.
        logging.exception("Error fetching station data")
        return []
    else:
        stations_data = []
        for station in stations:
            # Determine the most recent availability data for accurate,
            # up-to-date information.
            # Use the max function with a default value
            # to handle the case where there is no availability data for a
            # station.
            latest_availability = max(
                station.availabilities, key=lambda a: a.last_update, default=None
            )
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
                    "available_bikes": latest_availability.available_bikes
                    if latest_availability
                    else "N/A",
                    "available_bike_stands": latest_availability.available_bike_stands
                    if latest_availability
                    else "N/A",
                    "status": latest_availability.status
                    if latest_availability
                    else "N/A",
                    # Formatting the last update time for readability
                    "last_update": latest_availability.last_update.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                    if latest_availability
                    else "N/A",
                },
            }
            stations_data.append(station_data)
        return stations_data
