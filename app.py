"""
This module serves as the entry point for the Flask application.

It is responsible for loading environment variables, initialising the Flask application with its configurations, and starting the Flask server in debug mode on a specified host and port.
"""

import logging

from dotenv import load_dotenv

# Load environment variables from the `.env` file into the system's environment variables.
load_dotenv()

# Configure basic logging without using external configurations
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


# Import the create_app function from the app package. This function creates and configures the Flask application.
from app import create_app

# Create an instance of the Flask application.
app = create_app()

# Check if the script is executed directly (not imported), then run the app.
if __name__ == "__main__":
    # Start the Flask application in debug mode on host `0.0.0.0` and port `5000`.
    # Debug mode allows for live reloading and better error reporting.
    app.run(debug=True, host="0.0.0.0", port=5000)  # noqa: S104
