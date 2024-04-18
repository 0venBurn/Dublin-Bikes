"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

import os
import pickle
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import pytz
import requests
import tensorflow as tf
from dotenv import load_dotenv
from flask import Blueprint, jsonify, render_template, request
from flask_cors import CORS
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from tensorflow.keras.models import load_model

enc = OneHotEncoder(handle_unknown="ignore")


load_dotenv()
from tensorflow.keras.models import load_model

model = load_model("app/ml_model.h5", custom_objects={})
api_key = os.getenv("FIVE_DAY_URL")
if api_key is None:
    msg = "Api key not set in .env"
    raise Exception(msg)  # noqa: TRY002


from .routes.data_fetcher import get_latest_weather_data, get_stations_data

# Create a Blueprint instance for the main module.
main = Blueprint("main", __name__)
CORS(main)


@main.route("/")
def index():
    """Renders the main page."""
    # Fetch the Google Maps API key from environment variables
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API", "")

    return render_template(
        "index.html",
        google_maps_api_key=google_maps_api_key,
    )


@main.route("/api/weather")  # type:  ignore
def weather_data():
    """Api Endpoint for fetching weather data from database."""
    return get_latest_weather_data()


@main.route("/api/stations")
def stations_data():
    """API endpoint for fetching recent station data from database."""
    return get_stations_data()


@main.route("/predict", methods=["POST"])
def predict():
    date = request.form["date"]
    time = request.form["time"]
    number = request.form["station"]

    dt_string = date + " " + time
    dt = datetime.strptime(dt_string, "%Y-%m-%d %H")
    timestamp = int(dt.replace(tzinfo=pytz.UTC).timestamp())

    day = dt.day
    month = dt.month
    hour = dt.hour
    year = dt.year

    response = requests.get(str(api_key))
    weather_data = response.json()

    closest_forecast = min(weather_data["list"], key=lambda x: abs(x["dt"] - timestamp))

    temperature = closest_forecast["main"]["temp"]
    wind_speed = closest_forecast["wind"]["speed"]

    df = pd.DataFrame(
        {
            "number": [number],
            "Temperature": [temperature],
            "WindSpeed": [wind_speed],
            "year": [year],
            "month": [month],
            "day": [day],
            "hour": [hour],
        }
    )
    df = df.astype(int)

    numeric_features = ["Temperature", "WindSpeed", "day", "hour", "month", "year"]
    categorical_features = ["number"]
    print(df)
    with open("app/preprocessor.pkl", "rb") as f:
        preprocessor = pickle.load(f)
    X_new = preprocessor.transform(df)
    prediction = model.predict(X_new)
    rounded_prediction = np.round(prediction)
    prediction_result = int(rounded_prediction[0][0])
    print(prediction_result)

    return jsonify({"prediction": prediction_result})
