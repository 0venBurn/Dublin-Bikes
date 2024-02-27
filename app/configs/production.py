"""
This module defines the production-specific configurations for the Flask application.

It inherits from the base configuration and overrides or extends it as necessary.
"""

from .base import Config


class ProductionConfig(Config):
    """Production-specific configuration variables."""

    # Example: Enable strict transport security in production.
    # STRICT_TRANSPORT_SECURITY = True
