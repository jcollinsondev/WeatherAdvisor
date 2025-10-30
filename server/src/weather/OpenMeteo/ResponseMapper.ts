import { DailyResponse, DisplayWeather, HourlyResponse } from "@weather";

import { CurrentOpenMeteoResponse, DailyOpenMeteoResponse, HourlyOpenMeteoResponse } from "./types.ts";
import { weatherCodeMap, weatherTypeMapNight, weatherTypeMapDay } from "./codes.ts";
import { CurrentWeatherVariable, DailyWeatherVariable, HourlyWeatherVariable } from "./variables.ts";

export const currentVariables = [
    "temperature_2m", 
    "weather_code",
    "relative_humidity_2m",
    "wind_speed_10m",
    "is_day",
] satisfies CurrentWeatherVariable[];
export type CurrentVariables = typeof currentVariables;

export const hourlyVariables = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "wind_speed_10m",
    "uv_index",
    "cloud_cover",
    "rain",
    "visibility",
    "snowfall",
] satisfies HourlyWeatherVariable[];
export type HourlyVariables = typeof hourlyVariables;

export const dailyVariables = [
    "temperature_2m_max",
    "temperature_2m_min",
    "apparent_temperature_max",
    "apparent_temperature_min",
    "relative_humidity_2m_mean",
    "wind_speed_10m_max",
    "uv_index_max",
    "cloud_cover_mean",
    "precipitation_sum",
    "visibility_mean",
    "snowfall_sum",
] satisfies DailyWeatherVariable[];
export type DailyVariables = typeof dailyVariables;

export class ResponseMapper {
    mapFromCurrentResponse(res: CurrentOpenMeteoResponse<CurrentVariables>): DisplayWeather {
        return {
            weatherType: res.current.is_day ? weatherTypeMapDay[res.current.weather_code] : weatherTypeMapNight[res.current.weather_code],
            description: weatherCodeMap[res.current.weather_code],
            temp: res.current.temperature_2m,
            humidity: res.current.relative_humidity_2m,
            wind: res.current.wind_speed_10m,
        }
    }

    mapFromHourlyResponse(res: HourlyOpenMeteoResponse<HourlyVariables>): HourlyResponse {
        return {
            hours: res.hourly.time.map((date, index) => ({
                hour: date.getHours(),
                data: {
                    temp: res.temperature_2m[index],
                    feelsLike: res.apparent_temperature[index],
                    humidity: res.relative_humidity_2m[index],
                    uvi: res.uv_index[index],
                    clouds: res.cloud_cover[index],
                    visibility: res.visibility[index],
                    wind: res.wind_speed_10m[index],
                    rain: res.rain[index],
                    snow: res.snowfall[index],
                },
            })),
        }
    }

    mapFromDailyResponse(res: DailyOpenMeteoResponse<DailyVariables>): DailyResponse {
        return {
            days: res.daily.time.map((date, index) => ({
                day: date,
                data: {
                    temp: res.temperature_2m_max[index],
                    feelsLike: res.apparent_temperature_max[index],
                    humidity: res.relative_humidity_2m_mean[index],
                    uvi: res.uv_index_max[index],
                    clouds: res.cloud_cover_mean[index],
                    visibility: res.visibility_mean[index],
                    wind: res.wind_speed_10m_max[index],
                    rain: res.precipitation_sum[index],
                    snow: res.snowfall_sum[index],
                },
            })),
        }
    }
}