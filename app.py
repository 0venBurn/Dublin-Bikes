"""This module initialises the Flask application.

It is responsible for loading environment variables, initialising the Flask application with its configurations
and starting the Flask server with options based on the  configuration settings.
"""

from dotenv import load_dotenv

# Load environment variables from the `.env` file into the system's environment variables.
load_dotenv()

# Import the create_app function from the app package. This function creates and configures the Flask application.
from app import create_app

# Create an instance of the Flask application.
app = create_app()

if __name__ == "__main__":
    # Start the Flask application with configuration settings for host and port.
    app.run(debug=app.config["DEBUG"], host=app.config["HOST"], port=app.config["PORT"])
