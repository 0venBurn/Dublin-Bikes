"""Development-specific configurations for the Flask application."""

import logging
from typing import Any, ClassVar

from .base import Config


class DevelopmentConfig(Config):
    """Configuration class for development environment."""

    DEBUG: bool = True

    # Intentionally set to 0.0.0.0 to allow all IP addresses while in development.
    HOST: str = "0.0.0.0"
    PORT: int = 5000

    LOGGING_CONFIG: ClassVar[dict[str, Any]] = {
        "level": logging.DEBUG,
        "format": "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        "datefmt": "%Y-%m-%d %H:%M:%S",
    }
