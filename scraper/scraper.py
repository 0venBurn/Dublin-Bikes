"""
Web scraping API, Creates Database and then writes to Database in intervals.

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


# Import necessary modules
from __future__ import annotations

import json
import os
from datetime import datetime
from typing import TYPE_CHECKING, Any

import requests
import sqlalchemy
from dotenv import load_dotenv
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    MetaData,
    String,
    Table,
    create_engine,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

if TYPE_CHECKING:
    from sqlalchemy.engine.base import Engine

# Load .env
load_dotenv()

# Set credentials and check for errors
api_key = os.getenv("URL")
if api_key is None:
    msg = "Api key not set in .env"
    raise Exception(msg)  # noqa: TRY002
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db = os.getenv("DB")
host = os.getenv("HOST")


def get_data() -> list[dict[str, Any]] | None:
    """
    Fetches data from an API and validates it against a JSON schema.

    Returns:
        data: The fetched data if successful, None otherwise.
    """
    response = requests.get(str(api_key), timeout=10)
    # Check if HTTP request is OK
    http_ok = 200

    if response.status_code != http_ok:
        msg = f"API request failed: {response.status_code}"
        raise Exception(msg)  # noqa: TRY002
    try:
        data = json.loads(response.text)
        # json schema to validate loaded json
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
        # Validate json against the schema
        validate(instance=data, schema=schema)

        return data  # type: ignore  # noqa: TRY300, PGH003

    # Exception block for possible errors
    except json.JSONDecodeError:
        print("Invalid Error")
        return None
    except ValidationError as e:
        print(f"Json validation error as {e}")
        return None
    except Exception as e:  # noqa: BLE001
        print(f"Error fetching data {e}")
        return None


def create_connection() -> Engine | None:
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
        return create_engine(connection_string)
    except sqlalchemy.exc.OperationalError as e:
        print(f"Error connecting to database: {e}")
        return None


def create_tables(engine: Engine) -> tuple[Table, Table]:
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
        Column("number", Integer, primary_key=True, autoincrement=False),
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
        Column(
            "number", Integer, primary_key=True, nullable=False, autoincrement=False
        ),
        Column(
            "last_update",
            DateTime,
            primary_key=True,
            nullable=False,
            autoincrement=False,
        ),
        Column("available_bikes", Integer),
        Column("available_bike_stands", Integer),
        Column("status", String(128)),
    )
    # Use create_all method to create tables and return tables
    meta_data.create_all(engine)
    return station_table, availability_table


def write_to_station_table(
    session: Session, station_table: Table, data: list[dict[str, Any]]
) -> None:
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

            # If it doesn't exist write to data
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
                # Print if it exits
                print(f"Record with number {point['number']} already exists")
    # Make exception for integrity error and rollback session
    except IntegrityError as e:
        session.rollback()
        print(f"Error: {e}")


def write_to_availability_table(
    session: Session, availability_table: Table, data: list[dict[str, Any]]
) -> None:
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
        current_datetime = datetime.now()
        for point in data:
            # Check if the record already exists
            existing_availability = (
                session.query(availability_table)
                .filter_by(number=point["number"], last_update=current_datetime)
                .first()
            )
            # If it doesn't exist write to data
            if existing_availability is None:
                availability = availability_table.insert().values(
                    number=point["number"],
                    last_update=current_datetime,
                    available_bikes=point["available_bikes"],
                    available_bike_stands=point["available_bike_stands"],
                    status=point["status"],
                )
                session.execute(availability)
                session.commit()
            else:
                # Print if it exists
                print(
                    f"Record with number {point['number']} and last_update {current_datetime} already exists"
                )
    # Make exception for integrity error and rollback session
    except IntegrityError as e:
        session.rollback()
        print(f"Error: {e}")


# Get data from api
data = get_data()
# Create a connection
engine = create_connection()
# If connection is successful create the tables and create session
if engine:
    station_table, availability_table = create_tables(engine)
    session_maker = sessionmaker(bind=engine)  # type: ignore  # noqa: PGH003
    session = session_maker()
    # If there is data, write it to the station and availability table in db
    if data:
        write_to_station_table(session, station_table, data)
        write_to_availability_table(session, availability_table, data)
