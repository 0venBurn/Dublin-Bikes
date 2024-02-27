# Scrapers

## `scraper` Module

- Scrapes data on bike stations in Dublin, Ireland from the JCDecaux API.
- Adds the data to a MySQL database running on an AWS RDS instance.
- The data is used to populate the `station` and `availability` tables in the database.
- The `station` table contains static data on the bike stations.
- The `availability` table contains dynamic data on the number of bikes and stands available at each station.
- The `scraper` module is run as a cron job on an AWS EC2 instance.
- It creates the database tables if they do not already exist.
- The `scraper` module is run every 5 minutes.

### `station` Table

- **`number`**: The unique number of the station.
    - Integer.
    - Primary key.
    - Autoincrement is set to `False` to ensure that the station numbers are not changed.
- **`address`**: The address of the station.
    - String.
- **`banking`**: Whether the station has a banking service.
    - Integer.
    - `1` if the station has a banking service.
    - `0` if the station does not have a banking service.
- **`bike_stands`**: The number of bike stands at the station.
    - Integer.
- **`name`**: The name of the station.
    - String.
- **`position_lat`**: The latitude of the station.
    - Float.
- **`position_lng`**: The longitude of the station.
    - Float.

### `availability` Table

- **`number`**: The unique number of the station.
    - Integer.
    - Primary key.
    - Composite key with the `last_update` column.
    - Foreign key to the `number` column in the `station` table.
    - Autoincrement is set to `False` to ensure that the station numbers are not changed.
- **`last_update`**: The date and time of the last update to the availability data.
    - DateTime.
    - Primary key.
    - Composite key with the `number` column.
    - Foreign key to the `last_update` column in the `station` table.
    - Autoincrement is set to `False` to ensure that the last update times are not changed.
    - The date and time are in the format `YYYY-MM-DD HH:MM:SS`.
- **`available_bikes`**: The number of bikes available at the station.
    - Integer.
- **`available_bike_stands`**: The number of bike stands available at the station.
    - Integer.
- **`status`**: The status of the station.
    - String.
    - The status is set to `OPEN` if the station is open.
    - The status is set to `CLOSED` if the station is closed.

## `weather_scraper` Module

- Scrapes data on the weather in Dublin, Ireland from the OpenWeatherMap API.
- Adds the data to a MySQL database running on an AWS RDS instance.
- The data is used to populate the `weather` table in the database.
- The `weather` table contains dynamic data on the weather in Dublin, Ireland.
- The `weather_scraper` module is run as a cron job on an AWS EC2 instance.
- It creates the database table if it does not already exist.
- The `weather_scraper` module is run every 10 minutes.

### `weather` Table

- **`WeatherID`**: The unique ID of the weather data.
    - Integer.
    - Primary key.
    - Autoincrement is set to `True` to ensure that the weather IDs are unique.
- **`Timestamp`**: The date and time of the weather data.
    - DateTime.
    - The date and time are in the format `YYYY-MM-DD HH:MM:SS`.
- **`Temperature`**: The temperature in Dublin, Ireland.
    - Numeric.
    - The temperature is in degrees Celsius.
    - TODO: Precision and scale.
- **`FeelsLike`**: The temperature that it feels like in Dublin, Ireland.
    - Numeric.
    - The temperature is in degrees Celsius.
    - TODO: Precision and scale.
- **`TempMin`**: The minimum temperature in Dublin, Ireland.
    - Numeric.
    - The temperature is in degrees Celsius.
    - TODO: Precision and scale.
- **`TempMax`**: The maximum temperature in Dublin, Ireland.
    - Numeric.
    - The temperature is in degrees Celsius.
    - TODO: Precision and scale.
- **`Pressure`**: The atmospheric pressure in Dublin, Ireland.
    - Integer.
    - The pressure is in hPa.
- **`Humidity`**: The humidity in Dublin, Ireland.
    - Integer.
    - The humidity is in percentage.
- **`Visibility`**: The visibility in Dublin, Ireland.
    - Integer.
    - TODO: Units.
- **`WindSpeed`**: The wind speed in Dublin, Ireland.
    - Numeric.
    - TODO: Units.
- **`WindDeg`**: The wind direction in Dublin, Ireland.
    - Integer.
    - TODO: Units.
- **`Cloudiness`**: The cloudiness in Dublin, Ireland.
    - Integer.
    - TODO: Units.
- **`WeatherCondition`**: The weather condition in Dublin, Ireland.
    - String.
    - TODO: Differentiate between weather condition and weather description.
- **`WeatherDescription`**: The weather description in Dublin, Ireland.
    - String.
    - TODO: Differentiate between weather condition and weather description.
