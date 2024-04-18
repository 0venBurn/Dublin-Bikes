"""Development-specific configurations for the Flask application."""

from .base import Config


class DevelopmentConfig(Config):
    """Configuration class for development environment."""

    DEBUG = True
