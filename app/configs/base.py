"""This module defines the base configuration for the application."""

import os


class Config:
    """Configuration class to set up environment variables and database URI."""

    # Environment variables are used for configuration to enhance security and flexibility.
    USERNAME = os.getenv("DB_USERNAME")
    PASSWORD = os.getenv("DB_PASSWORD")
    DATABASE = os.getenv("DB")
    HOST = os.getenv("HOST")
    LOCAL_PORT = os.getenv("LOCAL_PORT")

    # This URI contains the database connection information required by SQLAlchemy.
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{USERNAME}:{PASSWORD}@localhost:{LOCAL_PORT}/{DATABASE}"
    )

    # Disable the SQLAlchemy event system, which can lead to significant overhead if not needed.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
