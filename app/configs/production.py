"""Configuration class for production environment."""

from .base import Config


class ProductionConfig(Config):
    """Configuration class for production environment."""

    # Disable debugging in production.
    DEBUG = False

    # Disable the Flask interactive debugger.
    USE_DEBUGGER = False
