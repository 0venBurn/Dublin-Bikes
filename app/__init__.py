"""Initialise the Flask app."""

from __future__ import annotations

import os

from flask import Flask

from .extensions import db
from .main import main as main_blueprint


def create_app():
    """Create the Flask app."""
    app = Flask(__name__)

    # Load configuration
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB")
    host = os.getenv("HOST")

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{username}:{password}@{host}/{database}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(main_blueprint)

    with app.app_context():
        db.create_all()

    return app
