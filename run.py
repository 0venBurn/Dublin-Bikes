"""Run the application."""

from __future__ import annotations

from dotenv import load_dotenv

load_dotenv()

from app import create_app

app = create_app()  # type: ignore

if __name__ == "__main__":
    app.run(debug=True)
