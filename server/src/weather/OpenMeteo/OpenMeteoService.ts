import { PossibleError } from "@utils";
import { DailyResponse, DisplayWeather, HourlyResponse, IWeatherService, WeatherServiceRequest } from "@weather";

import { RequestMapper } from "./RequestMapper.ts"
import { CurrentVariables, DailyVariables, HourlyVariables, ResponseMapper } from "./ResponseMapper.ts";
import { ApiCaller } from "./ApiCaller.ts";
import { CurrentOpenMeteoResponse, DailyOpenMeteoResponse, HourlyOpenMeteoResponse } from "./types.ts";

export class OpenMeteoService implements IWeatherService {
    async getCurrent(req: Pick<WeatherServiceRequest, "location">): Promise<PossibleError<DisplayWeather>> {
        // Map the request for the specific service
        const requestMapper = new RequestMapper();
        const api = new ApiCaller<CurrentOpenMeteoResponse<CurrentVariables>>(requestMapper.mapToCurrentRequest(req));

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        // Normalizing the response
        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromCurrentResponse(response);
        return [mappedResponse, undefined];
    }
    
    async getHourly(req: WeatherServiceRequest): Promise<PossibleError<HourlyResponse>> {
        // Map the request for the specific service
        const requestMapper = new RequestMapper();
        const api = new ApiCaller<HourlyOpenMeteoResponse<HourlyVariables>>(requestMapper.mapToHourlyRequest(req));

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        // Normalizing the response
        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromHourlyResponse(response);
        return [mappedResponse, undefined];
    }

    async getDaily(req: WeatherServiceRequest): Promise<PossibleError<DailyResponse>> {
        // Map the request for the specific service
        const requestMapper = new RequestMapper();
        const api = new ApiCaller<DailyOpenMeteoResponse<DailyVariables>>(requestMapper.mapToDailyRequest(req));

        const [response, error] = await api.call();
        if (error) return [undefined, error];

        // Normalizing the response
        const responseMapper = new ResponseMapper();
        const mappedResponse = responseMapper.mapFromDailyResponse(response);
        return [mappedResponse, undefined];
    }
}