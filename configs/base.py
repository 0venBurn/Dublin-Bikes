"""
This module defines the base configuration for the Flask application.

It includes configurations that are common across all environments.
"""

import os


class Config:
    """Base configuration variables."""

    # Environment variables are used for configuration to enhance security and flexibility.
    USERNAME = os.getenv("DB_USERNAME")
    PASSWORD = os.getenv("DB_PASSWORD")
    DATABASE = os.getenv("DB")
    HOST = os.getenv("HOST")

    # This URI contains the database connection information required by SQLAlchemy.
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}/{DATABASE}"

    # Disable the SQLAlchemy event system, which can lead to significant overhead if not needed.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
