import os
from datetime import datetime

import requests
import sqlalchemy
from dotenv import load_dotenv
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

# Load .env
load_dotenv()

api_key = os.getenv("WEATHER_API")
url = str(os.getenv("WEATHER_URL"))
if api_key is None:
    raise Exception("Api key not set in .env")
db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db = os.getenv("DB")
host = os.getenv("HOST")

params = {
    "lat": 53.3498,  # Latitude for Dublin
    "lon": -6.2603,  # Longitude for Dublin
    "exclude": "minutely,hourly,daily,alerts",  # Exclude unnecessary data
    "units": "metric",  # Use metric units
    "appid": api_key,  # Your API key
}

response = requests.get(url, params=params)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")

connection_string = f"mysql+mysqlconnector://{db_username}:{db_password}@{host}/{db}"
try:
    engine = create_engine(connection_string)
except sqlalchemy.exc.OperationalError as e:
    print(f"Error connecting to database: {e}")

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

timestamp = datetime.fromtimestamp(data["dt"])

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
