#!/bin/bash

source ~/miniconda3/etc/profile.d/conda.sh

conda activate flask_dev

python ~/SWE_Flask_Project/scraper/weather_scraper.py
