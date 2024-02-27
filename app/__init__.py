"""
This module is responsible for initialising the Flask application.

It sets up the application configuration, initialises database connections,
registers blueprints for different parts of the application, and creates
the database tables if they do not already exist.
"""

import os

from flask import Flask

from .extensions import db
from .main import main as main_blueprint


def create_app():
    """
    Creates and configures an instance of a Flask application.

    Returns:
        Flask: The Flask application instance.
    """
    # Instatiate the Flask application.
    app = Flask(__name__)

    # Load the application configuration.
    # Environment variables are used for configuration to enhance security and flexibility.
    username = os.getenv("DB_USERNAME")
    password = os.getenv("DB_PASSWORD")
    database = os.getenv("DB")
    host = os.getenv("HOST")

    # Configure the database URI for SQLAlchemy.
    # This URI contains the database connection information required by SQLAlchemy.
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{username}:{password}@{host}/{database}"
    )
    # Disable the SQLAlchemy event system, which can lead to significant overhead if not needed.
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialise the SQLAlchemy extension with the Flask app context.
    db.init_app(app)

    # Register blueprints for different parts of the application.
    app.register_blueprint(main_blueprint)

    # Create database tables.
    # This is done within the application context to ensure all models are known.
    with app.app_context():
        db.create_all()

    return app
