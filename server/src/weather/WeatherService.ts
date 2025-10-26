import { PossibleError } from "@utils";

import { DailyResponse, DisplayWeather, HourlyResponse, WeatherServiceRequest } from "./types.ts";

export interface IWeatherService {
    getCurrent(req: Pick<WeatherServiceRequest, "location">): Promise<PossibleError<DisplayWeather>>
    getHourly(req: WeatherServiceRequest): Promise<PossibleError<HourlyResponse>>
    getDaily(req: WeatherServiceRequest): Promise<PossibleError<DailyResponse>>
}