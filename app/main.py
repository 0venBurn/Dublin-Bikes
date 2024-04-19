"""
This module defines the web routes and their corresponding view functions for the Flask application.

It handles the rendering of templates based on the route accessed, providing the
necessary data to the templates where required. This includes routes for the
main page, stations page with updated availability information, and the weather
page with current weather data.
"""

import os
import pickle  # noqa: S403
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import pytz
import requests
from dotenv import load_dotenv
from flask import Blueprint, jsonify, render_template, request
from flask_cors import CORS
from sklearn.preprocessing import OneHotEncoder
from tensorflow.keras.models import load_model  # type: ignore

from .routes.data_fetcher import get_latest_weather_data, get_stations_data

enc = OneHotEncoder(handle_unknown="ignore")


load_dotenv()

model = load_model("app/ml_model.h5", custom_objects={})
api_key = os.getenv("FIVE_DAY_URL")
if api_key is None:
    msg = "Api key not set in .env"
    raise Exception(msg)  # noqa: TRY002

# Create a Blueprint instance for the main module.
main = Blueprint("main", __name__)
# Enable CORS for the main module.
CORS(main)


@main.route("/")
def index():
    """Renders the main page.

    Fetches the Google Maps API key from environment variables and renders the main page template with it.

    Returns:
        A rendered template for the main page.
    """
    google_maps_api_key = os.getenv("GOOGLE_MAPS_API", "")

    return render_template(
        "index.html",
        google_maps_api_key=google_maps_api_key,
    )


@main.route("/api/weather")  # type:  ignore
def weather_data():
    """API Endpoint for fetching weather data from database.

    Returns:
        JSON: The latest weather data fetched from the database.
    """
    return get_latest_weather_data()


@main.route("/api/stations")
def stations_data():
    """API endpoint for fetching recent station data from database.

    Returns:
        JSON: The latest station data fetched from the database.
    """
    return get_stations_data()


@main.route("/predict", methods=["POST"])
def predict():  # noqa: PLR0914
    """Predicts the bike availability at a given station and time.

    Takes date, time, and station number from the POST request form, processes the input data,
    and uses a pre-trained machine learning model to predict bike availability.

    Returns:
        JSON: A JSON object containing the prediction result.
    """
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

    response = requests.get(str(api_key), timeout=5)
    weather_data = response.json()

    closest_forecast = min(weather_data["list"], key=lambda x: abs(x["dt"] - timestamp))

    temperature = closest_forecast["main"]["temp"]
    wind_speed = closest_forecast["wind"]["speed"]

    df_predict = pd.DataFrame({
        "number": [number],
        "Temperature": [temperature],
        "WindSpeed": [wind_speed],
        "year": [year],
        "month": [month],
        "day": [day],
        "hour": [hour],
    })
    df_predict = df_predict.astype({
        "number": "int64",
        "Temperature": "float64",
        "WindSpeed": "float64",
        "year": "int64",
        "month": "int64",
        "day": "int64",
        "hour": "int64",
    })

    numeric_features = ["Temperature", "WindSpeed", "day", "hour", "month", "year"]  # noqa: F841
    categorical_features = ["number"]  # noqa: F841

    with Path("app/preprocessor.pkl").open("rb") as f:
        preprocessor = pickle.load(f)  # noqa: S301

    x_new = preprocessor.transform(df_predict)
    prediction = model.predict(x_new)
    rounded_prediction = np.round(prediction)
    prediction_result = int(rounded_prediction[0][0])

    return jsonify({"prediction": prediction_result})
