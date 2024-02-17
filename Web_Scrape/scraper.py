"""
Web scraping API, Creates Database and then writes to Database in intervals

This script fetches data from an API, validates it against a JSON schema,
and writes the data to a MySQL database. It consists of several functions
that handle different tasks such as fetching data, creating a database connection,
creating database tables, and writing data to the tables.

Functions:
- get_data(): Fetches data from an API and validates it against a JSON schema.
- create_connection(): Creates a connection to the MySQL database.
- create_tables(engine): Creates station and availability tables in the database.
- write_to_station_table(session, station_table, data): Writes data to the station table in the database.
- write_to_availability_table(session, availability_table, data): Writes availability data to the specified availability table in the database.
"""

import requests
import os
import json
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from datetime import datetime
from dotenv import load_dotenv
import sqlalchemy
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    MetaData,
    Table,
    Float,
)
from sqlalchemy.dialects.mysql import INTEGER as MySQLInteger
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

# Load .env
load_dotenv()

# Set Keys
api_key = os.getenv("URL")
if api_key is None:
    raise Exception("Api key not set in .env")
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db = os.getenv("DB")
host = os.getenv("HOST")

# Load .env
load_dotenv()

# Set Keys
api_key = os.getenv("URL")
if api_key is None:
    raise Exception("Api key not set in .env")
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db = os.getenv("DB")
host = os.getenv("HOST")


def get_data():
    """
    Fetches data from an API and validates it against a JSON schema.

    Returns:
        dict: The fetched data if successful, None otherwise.
    """
    response = requests.get(str(api_key))
    if response.status_code != 200:
        raise Exception(f"API request failed: {response.status_code}")
    try:
        data = json.loads(response.text)

        schema = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "number": {"type": "integer"},
                    "contract_name": {"type": "string"},
                    "name": {"type": "string"},
                    "address": {"type": "string"},
                    "position": {
                        "type": "object",
                        "properties": {
                            "lat": {"type": "number"},
                            "lng": {"type": "number"},
                        },
                        "required": ["lat", "lng"],
                    },
                    "banking": {"type": "boolean"},
                    "bonus": {"type": "boolean"},
                    "bike_stands": {"type": "integer"},
                    "available_bike_stands": {"type": "integer"},
                    "available_bikes": {"type": "integer"},
                    "status": {"type": "string"},
                    "last_update": {"type": "integer"},
                },
                "required": [
                    "number",
                    "contract_name",
                    "name",
                    "address",
                    "position",
                    "banking",
                    "bonus",
                    "bike_stands",
                    "available_bike_stands",
                    "available_bikes",
                    "status",
                    "last_update",
                ],
            },
        }
        validate(instance=data, schema=schema)

        return data

    except json.JSONDecodeError:
        print("Invalid Error")
        return None
    except ValidationError as e:
        print(f"Json validation error as {e}")
        return None
    except Exception as e:
        print(f"Error fetching data {e}")
        return None


def create_connection():
    """
    Creates a connection to the MySQL database.

    Returns:
        engine (sqlalchemy.engine.Engine): The SQLAlchemy engine object representing the database connection.
        None: If there is an error connecting to the database.
    """
    connection_string = (
        f"mysql+mysqlconnector://{db_username}:{db_password}@{host}/{db}"
    )
    try:
        engine = create_engine(connection_string)
        return engine
    except sqlalchemy.exc.OperationalError as e:
        print(f"Error connecting to database: {e}")
        return None


def create_tables(engine):
    """
    Creates station and availability tables in the database.

    Args:
        engine (sqlalchemy.engine.Engine): The SQLAlchemy engine object.

    Returns:
        tuple: A tuple containing the station table and availability table objects.

    """
    # Set MetaData()
    meta_data = MetaData()

    # Create station table
    station_table = Table(
        "station",
        meta_data,
        Column("number", Integer, primary_key=True),
        Column("address", String(128)),
        Column("banking", Integer),
        Column("bike_stands", Integer),
        Column("name", String(128)),
        Column("position_lat", Float),
        Column("position_lng", Float),
    )

    # Create Dynamic Table
    availability_table = Table(
        "availability",
        meta_data,
        Column("number", MySQLInteger, primary_key=True, nullable=False),
        Column("last_update", DateTime, primary_key=True, nullable=False),
        Column("available_bikes", Integer),
        Column("available_bike_stands", Integer),
        Column("status", String(128)),
    )

    meta_data.create_all(engine)
    return station_table, availability_table


def write_to_station_table(session, station_table, data):
    """
    Writes data to the station table in the database.

    Args:
        session (Session): The database session.
        station_table (Table): The table object representing the station table.
        data (list): A list of dictionaries containing the data to be written.

    Returns:
        None
    """
    try:
        for point in data:
            # Check if the record already exists
            existing_station = (
                session.query(station_table).filter_by(number=point["number"]).first()
            )

            if existing_station is None:
                station = station_table.insert().values(
                    number=point["number"],
                    address=point["address"],
                    banking=int(point["banking"]),  # Convert boolean to integer
                    bike_stands=point["bike_stands"],
                    name=point["name"],
                    position_lat=point["position"]["lat"],
                    position_lng=point["position"]["lng"],
                )
                session.execute(station)
                session.commit()
            else:
                print(f"Record with number {point['number']} already exists")
    except IntegrityError as e:
        session.rollback()
        print(f"Error: {e}")


def write_to_availability_table(session, availability_table, data):
    """
    Writes availability data to the specified availability table in the database.

    Args:
        session (Session): The database session.
        availability_table (Table): The availability table in the database.
        data (list): A list of availability data points to be written.

    Returns:
        None
    """
    try:
        for point in data:
            # Check if the record already exists
            existing_availability = (
                session.query(availability_table)
                .filter_by(
                    number=point["number"],
                    last_update=datetime.fromtimestamp(point["last_update"] / 1000),
                )
                .first()
            )

            if existing_availability is None:
                availability = availability_table.insert().values(
                    number=point["number"],
                    last_update=datetime.fromtimestamp(
                        point["last_update"] / 1000
                    ),  # Convert from milliseconds
                    available_bikes=point["available_bikes"],
                    available_bike_stands=point["available_bike_stands"],
                    status=point["status"],
                )
                session.execute(availability)
                session.commit()
            else:
                print(
                    f"Record with number {point['number']} and last_update {point['last_update']} already exists"
                )
    except IntegrityError as e:
        session.rollback()
        print(f"Error: {e}")


data = get_data()
engine = create_connection()
if engine:
    station_table, availability_table = create_tables(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    if data:
        write_to_station_table(session, station_table, data)
        write_to_availability_table(session, availability_table, data)
