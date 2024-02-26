"""Routes for main page."""

from __future__ import annotations

from flask import Blueprint, render_template

main = Blueprint("main", __name__)


@main.route("/")
def index():
    """Render the main page."""
    return render_template("index.html")
