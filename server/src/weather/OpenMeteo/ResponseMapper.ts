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
                hour: new Date(date).getHours(),
                data: {
                    temp: res.hourly.temperature_2m[index],
                    feelsLike: res.hourly.apparent_temperature[index],
                    humidity: res.hourly.relative_humidity_2m[index],
                    uvi: res.hourly.uv_index[index],
                    clouds: res.hourly.cloud_cover[index],
                    visibility: res.hourly.visibility[index],
                    wind: res.hourly.wind_speed_10m[index],
                    rain: res.hourly.rain[index],
                    snow: res.hourly.snowfall[index],
                },
            })),
        }
    }

    mapFromDailyResponse(res: DailyOpenMeteoResponse<DailyVariables>): DailyResponse {
        return {
            days: res.daily.time.map((date, index) => ({
                day: new Date(date),
                data: {
                    temp: res.daily.temperature_2m_max[index],
                    feelsLike: res.daily.apparent_temperature_max[index],
                    humidity: res.daily.relative_humidity_2m_mean[index],
                    uvi: res.daily.uv_index_max[index],
                    clouds: res.daily.cloud_cover_mean[index],
                    visibility: res.daily.visibility_mean[index],
                    wind: res.daily.wind_speed_10m_max[index],
                    rain: res.daily.precipitation_sum[index],
                    snow: res.daily.snowfall_sum[index],
                },
            })),
        }
    }
}