"""Configuration class for production environment."""

from .base import Config


class ProductionConfig(Config):
    """Configuration class for production environment."""

    DEBUG: bool = False

    HOST: str = "0.0.0.0"  # Change this to the deployment server's IP address.
    PORT: int = 80  # Standard HTTP port.
