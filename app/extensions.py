"""
This module provides extensions that are used throughout the application.

It includes the creation and configuration of the 'db' instance, which is
used to interact with the database.
"""

from flask_sqlalchemy import SQLAlchemy

# The 'db' instance is created here and is not bound to any specific
# application.
# This prevents the need for the 'db' instance to be created in the
# __init__.py file, which would cause a circular import.
db = SQLAlchemy()
