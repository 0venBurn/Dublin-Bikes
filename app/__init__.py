"""
Module for initialising and configuring the Flask application.

This module is responsible for setting up the Flask application instance, determining
the configuration to use based on the environment, and registering the application blueprints.
"""

import os

from flask import Flask
from flask_cors import CORS

from app.configs.base import Config
from app.configs.development import DevelopmentConfig
from app.configs.production import ProductionConfig

from .extensions import db
from .main import main as main_blueprint


def create_app():
    """Initialises and configures the Flask application.

    Determines the configuration to use based on the `FLASK_CONFIG` environment variable,
    initialises the database, and registers application blueprints.

    Returns:
        Flask: The initialised Flask application instance.

    Raises:
        KeyError: If an invalid configuration key is provided.
    """
    app = Flask(__name__)

    # Determine which configuration to use based on the FLASK_ENV environment variable.
    # This allows for flexible application behavior depending on the environment it's running in.
    env = os.getenv("FLASK_CONFIG")

    if env == "production":
        app.config.from_object(ProductionConfig)
    elif env == "development":
        app.config.from_object(DevelopmentConfig)
    else:
        app.config.from_object(ProductionConfig)

    # Enable CORS for the entire application.
    CORS(app)

    # Initialise the database connection with the Flask application.
    db.init_app(app)

    # Register the main blueprint for routing.
    app.register_blueprint(main_blueprint)

    return app
