"""
This module defines the development-specific configurations for the Flask application.

It inherits from the base configuration and overrides or extends it as necessary for development.
"""

from .base import Config


class DevelopmentConfig(Config):
    """Development-specific configuration variables."""

    # Example: Enable debug mode in development.
    DEBUG = True
