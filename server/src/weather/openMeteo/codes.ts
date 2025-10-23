import { WeatherType } from "@weather";

export const weatherCodeMap: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: light intensity",
    53: "Drizzle: moderate intensity",
    55: "Drizzle: dense intensity",
    56: "Freezing drizzle: light intensity",
    57: "Freezing drizzle: dense intensity",
    61: "Rain: slight intensity",
    63: "Rain: moderate intensity",
    65: "Rain: heavy intensity",
    66: "Freezing rain: light intensity",
    67: "Freezing rain: heavy intensity",
    71: "Snowfall: slight intensity",
    73: "Snowfall: moderate intensity",
    75: "Snowfall: heavy intensity",
    77: "Snow grains",
    80: "Rain showers: slight",
    81: "Rain showers: moderate",
    82: "Rain showers: violent",
    85: "Snow showers: slight",
    86: "Snow showers: heavy",
    95: "Thunderstorm: slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
};

export const weatherTypeMap: Record<number, WeatherType> = {
    0: "sunny",
    1: "partly-cloudy",
    2: "cloudy-clear",
    3: "cloudy",

    45: "fog",
    48: "fog",

    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "sleet",
    57: "sleet",

    61: "rain",
    63: "rain-sun",
    65: "heavy-rain",

    66: "sleet",
    67: "sleet",

    71: "snow",
    73: "snow",
    75: "blizzard",

    77: "snow",

    80: "scatterad-showers",
    81: "rain",
    82: "heavy-rain",

    85: "snow",
    86: "blizzard",

    95: "scatterad-thunderstorm",
    96: "rain-thunderstorm",
    99: "sever-thunderstorm",
};