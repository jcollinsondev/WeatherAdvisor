import { WeatherServiceRequest } from "@weather";

import { OpenMeteoRequest } from "./types.ts";
import { currentVariables, hourlyVariables } from "./ResponseMapper.ts";

export class RequestMapper {
    constructor(private req: WeatherServiceRequest) {}

    mapToCurrentRequest(): OpenMeteoRequest {
        return {
            latitude: this.req.location.lat,
            longitude: this.req.location.lon,
            current: currentVariables,
        }
    }

    mapToHourlyRequest(): OpenMeteoRequest {
        return {
            latitude: this.req.location.lat,
            longitude: this.req.location.lon,
            hourly: hourlyVariables,
            start_hour: this.req.timeframe.from.toISOString().slice(0, 16),
            end_hour: this.req.timeframe.to.toISOString().slice(0, 16),
            timezone: "GMT",
        }
    }

    mapToDailyRequest(): OpenMeteoRequest {
        return {
            latitude: this.req.location.lat,
            longitude: this.req.location.lon,
            daily: ["temperature_2m_max", "apparent_temperature_min"],
            start_date: this.req.timeframe.from.toISOString().slice(0, 10),
            end_date: this.req.timeframe.to.toISOString().slice(0, 10),
            timezone: "GMT",
        }
    }
}