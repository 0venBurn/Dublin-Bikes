"""
This module defines the production-specific configurations for the Flask application.

It inherits from the base configuration and overrides or extends it as necessary.
"""

from .base import Config


class ProductionConfig(Config):
    """Production-specific configuration variables."""

    # Disable debugging in production.
    DEBUG = False

    # Disable the Flask interactive debugger.
    USE_DEBUGGER = False
