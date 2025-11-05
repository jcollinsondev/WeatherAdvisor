import { Location } from "@location";

export type WeatherType = 
    | "sunny"
    | "clear-night"
    | "cloudy"
    | "partly-cloudy"
    | "cloudy-clear"
    | "partly-cloudy-night"
    | "cloudy-clear-night"
    | "fog"
    | "heavy-rain"
    | "scatterad-showers"
    | "scatterad-showers-night"
    | "rain"
    | "rain-sun"
    | "rain-night"
    | "drizzle"
    | "drizzle-sun"
    | "drizzle-night"
    | "sever-thunderstorm"
    | "scatterad-thunderstorm"
    | "rain-thunderstorm"
    | "blizzard"
    | "sleet"
    | "snow"
    | "wind"
    | "hail"

export interface DisplayWeather {
    weatherType: WeatherType;
    description: string;
    temp: number;
    humidity: number;
    wind: number;
}

export interface WeatherData {
    temp: number;
    feelsLike: number;
    humidity: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind: number;
    rain: number;
    snow: number;
}

export interface HourlyResponse {
    hours: HourlyData[];
}

export interface DailyResponse {
    days: DailyData[];
}

export interface HourlyData {
    hour: number;
    data: WeatherData;
}

export interface DailyData {
    day: Date;
    data: WeatherData;
}

export interface WeatherServiceRequest {
    location: Pick<Location, "lat" | "lon" | "timezone">;
    timeframe: Timeframe;
}

export interface Timeframe {
    from: string;
    to: string;
}