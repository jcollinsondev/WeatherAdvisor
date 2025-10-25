import { PossibleError } from "@utils";
import { DailyResponse, DisplayWeather, HourlyResponse, IWeatherService, WeatherServiceRequest } from "@weather";

import { RequestMapper } from "./RequestMapper.ts"
import { CurrentVariables, DailyVariables, HourlyVariables, ResponseMapper } from "./ResponseMapper.ts";
import { ApiCaller } from "./ApiCaller.ts";
import { CurrentOpenMeteoResponse, DailyOpenMeteoResponse, HourlyOpenMeteoResponse } from "./types.ts";

export class OpenMeteoService implements IWeatherService {
    async getCurrent(req: WeatherServiceRequest): Promise<PossibleError<DisplayWeather>> {
        const requestMapper = new RequestMapper(req);
        const api = new ApiCaller<CurrentOpenMeteoResponse<CurrentVariables>>(requestMapper.mapToCurrentRequest());

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromCurrentResponse(response);
        return [mappedResponse, undefined];
    }
    
    async getHourly(req: WeatherServiceRequest): Promise<PossibleError<HourlyResponse>> {
        const requestMapper = new RequestMapper(req);
        const api = new ApiCaller<HourlyOpenMeteoResponse<HourlyVariables>>(requestMapper.mapToHourlyRequest());

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromHourlyResponse(response);
        return [mappedResponse, undefined];
    }

    async getDaily(req: WeatherServiceRequest): Promise<PossibleError<DailyResponse>> {
        const requestMapper = new RequestMapper(req);
        const api = new ApiCaller<DailyOpenMeteoResponse<DailyVariables>>(requestMapper.mapToDailyRequest());

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromDailyResponse(response);
        return [mappedResponse, undefined];
    }
}