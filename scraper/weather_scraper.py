"""
This module contains functions to scrape weather data from an API and insert it into a MySQL database.

Functions:
- get_weather_data: Fetches weather data from the API.
- connect_to_database: Connects to the MySQL database.
- create_and_insert_weather_data: Creates a table in the database and inserts the weather data.

"""

from __future__ import annotations

import os
from datetime import datetime

import requests
import sqlalchemy
from dotenv import load_dotenv
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    MetaData,
    Numeric,
    String,
    Table,
    create_engine,
    insert,
)
from sqlalchemy.orm import Session

load_dotenv()

api_key = os.getenv("WEATHER_API")
url = str(os.getenv("WEATHER_URL"))
if api_key is None:
    msg = "Api key not set in .env"
    raise Exception(msg)  # noqa: TRY002
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db = os.getenv("DB")
host = os.getenv("HOST")
SUCCESS_STATUS_CODE = 200


# JSON schema for weather data
weather_data_schema = {
    "type": "object",
    "properties": {
        "coord": {
            "type": "object",
            "properties": {"lon": {"type": "number"}, "lat": {"type": "number"}},
            "required": ["lon", "lat"],
        },
        "weather": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "main": {"type": "string"},
                    "description": {"type": "string"},
                    "icon": {"type": "string"},
                },
                "required": ["id", "main", "description", "icon"],
            },
        },
        "base": {"type": "string"},
        "main": {
            "type": "object",
            "properties": {
                "temp": {"type": "number"},
                "feels_like": {"type": "number"},
                "temp_min": {"type": "number"},
                "temp_max": {"type": "number"},
                "pressure": {"type": "number"},
                "humidity": {"type": "number"},
            },
            "required": [
                "temp",
                "feels_like",
                "temp_min",
                "temp_max",
                "pressure",
                "humidity",
            ],
        },
        "visibility": {"type": "integer"},
        "wind": {
            "type": "object",
            "properties": {"speed": {"type": "number"}, "deg": {"type": "integer"}},
            "required": ["speed", "deg"],
        },
        "clouds": {
            "type": "object",
            "properties": {"all": {"type": "integer"}},
            "required": ["all"],
        },
        "dt": {"type": "integer"},
        "sys": {
            "type": "object",
            "properties": {
                "type": {"type": "integer"},
                "id": {"type": "integer"},
                "country": {"type": "string"},
                "sunrise": {"type": "integer"},
                "sunset": {"type": "integer"},
            },
            "required": ["type", "id", "country", "sunrise", "sunset"],
        },
        "timezone": {"type": "integer"},
        "id": {"type": "integer"},
        "name": {"type": "string"},
        "cod": {"type": "integer"},
    },
    "required": [
        "coord",
        "weather",
        "base",
        "main",
        "visibility",
        "wind",
        "clouds",
        "dt",
        "sys",
        "timezone",
        "id",
        "name",
        "cod",
    ],
}


def get_weather_data() -> dict | None:
    """
    Fetches weather data from the API.

    Returns:
        dict | None: The weather data as a dictionary, or None if there was an error.
    """
    params = {
        "lat": 53.3498,  # Latitude for Dublin
        "lon": -6.2603,  # Longitude for Dublin
        "exclude": "minutely,hourly,daily,alerts",  # Exclude unnecessary data
        "units": "metric",  # Use metric units
        "appid": api_key,  # Your API key
    }

    response = requests.get(url, params=params, timeout=5)  # Add timeout parameter

    if response.status_code == SUCCESS_STATUS_CODE:
        weather_data = response.json()
        try:
            validate(instance=weather_data, schema=weather_data_schema)
            return weather_data  # noqa: TRY300
        except ValidationError as e:
            print(f"Error validating weather data: {e}")
    else:
        print(f"Error: {response.status_code}")
    return None


def connect_to_database() -> sqlalchemy.engine.base.Engine | None:
    """
    Connects to the MySQL database.

    Returns:
        sqlalchemy.engine.base.Engine | None: The database engine if the connection is successful,
        None otherwise.
    """
    connection_string = (
        f"mysql+mysqlconnector://{db_username}:{db_password}@{host}/{db}"
    )
    try:
        return create_engine(connection_string)
    except sqlalchemy.exc.OperationalError as e:
        print(f"Error connecting to database: {e}")
    return None  # type: ignore  # noqa: PGH003


def create_and_insert_weather_data(
    engine: sqlalchemy.engine.base.Engine, data: dict
) -> None:
    """
    Creates a table in the database and inserts the weather data.

    Args:
        engine (sqlalchemy.engine.base.Engine): The database engine.
        data (dict): The weather data to insert.

    Returns:
        None
    """
    metadata = MetaData()

    weather = Table(
        "weather",
        metadata,
        Column("WeatherID", Integer, primary_key=True, autoincrement=True),
        Column("Timestamp", DateTime),
        Column("Temperature", Numeric(precision=5, scale=2)),
        Column("FeelsLike", Numeric(precision=5, scale=2)),
        Column("TempMin", Numeric(precision=5, scale=2)),
        Column("TempMax", Numeric(precision=5, scale=2)),
        Column("Pressure", Integer),
        Column("Humidity", Integer),
        Column("Visibility", Integer),
        Column("WindSpeed", Numeric(precision=5, scale=2)),
        Column("WindDeg", Integer),
        Column("Cloudiness", Integer),
        Column("WeatherCondition", String(255)),
        Column("WeatherDescription", String(255)),
    )

    metadata.create_all(engine)

    timestamp = datetime.now()

    insert_data = {
        "Timestamp": timestamp,
        "Temperature": data["main"]["temp"],
        "FeelsLike": data["main"]["feels_like"],
        "TempMin": data["main"]["temp_min"],
        "TempMax": data["main"]["temp_max"],
        "Pressure": data["main"]["pressure"],
        "Humidity": data["main"]["humidity"],
        "Visibility": data["visibility"],
        "WindSpeed": data["wind"]["speed"],
        "WindDeg": data["wind"]["deg"],
        "Cloudiness": data["clouds"]["all"],
        "WeatherCondition": data["weather"][0]["main"],
        "WeatherDescription": data["weather"][0]["description"],
    }

    session = Session(engine)
    stmt = insert(weather).values(insert_data)
    session.execute(stmt)
    session.commit()
    session.close()


# Final script
data = get_weather_data()
if data:
    engine = connect_to_database()
    if engine:
        create_and_insert_weather_data(engine, data)
