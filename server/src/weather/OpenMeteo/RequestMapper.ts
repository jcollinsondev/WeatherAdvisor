import { WeatherServiceRequest } from "@weather";

import { OpenMeteoRequest } from "./types.ts";
import { currentVariables, hourlyVariables } from "./ResponseMapper.ts";

export class RequestMapper {
    constructor() {}

    mapToCurrentRequest(req: Pick<WeatherServiceRequest, "location">): OpenMeteoRequest {
        return {
            latitude: req.location.lat,
            longitude: req.location.lon,
            current: currentVariables,
        }
    }

    mapToHourlyRequest(req: WeatherServiceRequest): OpenMeteoRequest {
        return {
            latitude: req.location.lat,
            longitude: req.location.lon,
            hourly: hourlyVariables,
            start_hour: req.timeframe.from.toISOString().slice(0, 16),
            end_hour: req.timeframe.to.toISOString().slice(0, 16),
            timezone: "GMT",
        }
    }

    mapToDailyRequest(req: WeatherServiceRequest): OpenMeteoRequest {
        return {
            latitude: req.location.lat,
            longitude: req.location.lon,
            daily: ["temperature_2m_max", "apparent_temperature_min"],
            start_date: req.timeframe.from.toISOString().slice(0, 10),
            end_date: req.timeframe.to.toISOString().slice(0, 10),
            timezone: "GMT",
        }
    }
}