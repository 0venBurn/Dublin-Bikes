"""
This module initialises and configures the Flask application.

It performs several key functions as part of the application setup process:

- Configures the application based on the environment (development, production, etc.).
- Initialises database connections using SQLAlchemy.
- Registers blueprints for organising the application structure.
- Creates database tables if they do not already exist, ensuring the application's data structure is prepared.

Functions:
    create_app(): Initialises and returns a Flask application instance configured based on the environment.
"""

import os

from flask import Flask

from app.configs.base import Config
from app.configs.development import DevelopmentConfig
from app.configs.production import ProductionConfig

from .extensions import db
from .main import main as main_blueprint


def create_app():
    """
    Initialises and configures the Flask application.

    Determines the configuration to use based on the FLASK_CONFIG environment variable, initialises the database, and registers application blueprints.

    Returns:
        Flask: The initialized Flask application.
    """
    # Create a new Flask application instance.
    app = Flask(__name__)

    # Determine which configuration to use based on the FLASK_ENV environment variable.
    # This allows for flexible application behavior depending on the environment it's running in.
    env = os.getenv("FLASK_CONFIG")
    if env == "production":
        # Use production settings for deployment.
        app.config.from_object(ProductionConfig)
    elif env == "development":
        # Use development settings for debugging and local development.
        app.config.from_object(DevelopmentConfig)
    else:
        # Default to base configuration if no environment is specified.
        app.config.from_object(Config)

    # Initialise the database connection with the Flask application.
    db.init_app(app)
    # Register the main blueprint for routing.
    app.register_blueprint(main_blueprint)

    return app
