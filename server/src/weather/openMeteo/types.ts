// DOCS: https://open-meteo.com/en/docs
import { HourlyWeatherVariable, DailyWeatherVariable, CurrentWeatherVariable } from "./variables.ts";

export interface OpenMeteoRequest {
    latitude: number;
    longitude: number;
    elevation?: number;
    hourly?: HourlyWeatherVariable[];
    daily?: DailyWeatherVariable[];
    current?: CurrentWeatherVariable[];
    timezone?: string;
    forecast_days?: number;
    start_hour?: string;
    end_hour?: string;
    start_date?: string;
    end_date?: string;
}

export type CurrentOpenMeteoResponse<Variables extends readonly CurrentWeatherVariable[]> = OpenMeteoResponseBase & {
    current_units?: CurrentUnits<Variables>;
    current?: Current<Variables>;
}

export type HourlyOpenMeteoResponse<Variables extends readonly HourlyWeatherVariable[]> = OpenMeteoResponseBase & {
    hourly_units?: HourlyUnits<Variables>;
    hourly?: Times;
} & {
    [key in Variables[number]]?: number;
}

export type DailyOpenMeteoResponse<Variables extends readonly DailyWeatherVariable[]> = OpenMeteoResponseBase & {
    daily_units?: DailyUnits<Variables>;
    daily?: Times;
} & {
    [key in Variables[number]]?: number;
}

type OpenMeteoResponseBase = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
}

export interface OpenMeteoError {
    error: boolean;
    reason: string;
}

type Times = {
    time: [Date]
}

type CurrentUnits<Variables extends readonly CurrentWeatherVariable[]> = {
    time: string;
    interval: string;
} & {
    [key in Variables[number]]?: string;
}

type Current<Variables extends readonly CurrentWeatherVariable[]> = {
    time: Date;
    interval: number;
} & {
    [key in Variables[number]]?: number;
}

type HourlyUnits<Variables extends readonly HourlyWeatherVariable[]> = {
    time: string;
} & {
    [key in Variables[number]]?: string;
}

type DailyUnits<Variables extends readonly DailyWeatherVariable[]> = {
    time: string;
} & {
    [key in Variables[number]]?: string;
}