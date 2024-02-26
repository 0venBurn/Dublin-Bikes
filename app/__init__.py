"""Initialise the Flask app."""

from __future__ import annotations

import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from .main import main as main_blueprint

app = Flask(__name__)

username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB")
host = os.getenv("HOST")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{username}:{password}@{host}/{database}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


def create_app():
    """Create the Flask app."""
    app = Flask(__name__)

    app.register_blueprint(main_blueprint)

    return app
