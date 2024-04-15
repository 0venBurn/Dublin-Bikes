"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

import os
from dotenv import load_dotenv
from flask import Blueprint, render_template
import requests
from flask_cors import CORS
import tensorflow as tf
import pytz
from tensorflow.keras.models import load_model

from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import numpy as np
import pandas as pd
from datetime import datetime, timedelta


@tf.keras.utils.register_keras_serializable()
def mse(y_true, y_pred):
    return tf.keras.losses.mean_squared_error(y_true, y_pred)


load_dotenv()
from tensorflow.keras.models import load_model

model = load_model('app/ml_model.h5', custom_objects={})
api_key = os.getenv("FIVE_DAY_URL")
if api_key is None:
    msg = "Api key not set in .env"
    raise Exception(msg)  # noqa: TRY002


preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), ["Temperature", "WindSpeed", "day", "hour", "month"]),
        ("cat", OneHotEncoder(), ["number"]),
    ]
)
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

    dt = datetime.strptime(date + " " + time, "%Y-%m-%d %H:%M:%S")
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
            "Temperature": [temperature],
            "WindSpeed": [wind_speed],
            "day": [day],
            "hour": [hour],
            "month": [month],
            "number": [number],  # Assuming 'number' corresponds to the station
        }
    )
    # Apply preprocessing
    X_new = preprocessor.transform(df)
    prediction = model.predict(X_new)
    prediction_result = prediction[0][0]

    return jsonify({"prediction": prediction_result})


def prepare_input(number, WindSpeed, Temperature, month, day, hour):
    numeric_features = ["Temperature", "WindSpeed", "day", "hour", "month"]
    category_features = ["number"]
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(), category_features),
        ]
    )
