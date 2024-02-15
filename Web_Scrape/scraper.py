"""
Web scraping API, Creates Database and then writes to Database in intervals
"""

# Import Packages
import requests
import json
import os
from dotenv import load_dotenv
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


# Load .env
load_dotenv()

# Set Keys
api_key = os.getenv("URL")
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")


# Get data from api and load in json
def get_data():
    response = requests.get(str(api_key))
    data = json.loads(response.text)
    return data


# test
# data = get_data()
# print(data)

# Create connection
connection_string = (
    f"mysql+mysqlconnector://{db_username}:{db_password}@localhost/test2"
)
engine = create_engine(connection_string)

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

# Testing to write to static table

Session = sessionmaker(bind=engine)
session = Session()

new_station = {
    'number': 1,
    'address': '123 Example Street',
    'banking': 1,
    'bike_stands': 15,
    'name': 'First Station',
    'position_lat': 40.7128,
    'position_lng': -74.0060
}

insert_stmt = station_table.insert().values(**new_station)
session.execute(insert_stmt)

session.commit()

inserted_station = session.query(station_table).filter_by(number=1).first()
print(inserted_station)