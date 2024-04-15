"""Initialise the models package."""

# Import Availability first to ensure the relationship with Station is defined.
from .availability import Availability  # noqa: F401
from .station import Station  # noqa: F401
