import { PossibleError } from "@utils";

import { WeatherServiceRequest, DisplayWeather, HourlyResponse, DailyResponse } from "./types.ts";
import { IWeatherService } from "./weatherService.ts";

export const mock: IWeatherService = {
  getCurrent: function (_: WeatherServiceRequest): Promise<PossibleError<DisplayWeather>> {
    const response: DisplayWeather = {
        weatherType: "sunny",
        description: "sunny",
        temp: 25,
        humidity: 30,
        wind: 0,
    };

    return new Promise((resolve) => {
        resolve([response, undefined]);
    });
  },

  getHourly: function (_: WeatherServiceRequest): Promise<PossibleError<HourlyResponse>> {
    const response: HourlyResponse = {
        hours: [
            {
                hour: 12,
                data: {
                    temp: 25,
                    feelsLike: 25,
                    humidity: 30,
                    uvi: 0,
                    clouds: 0,
                    visibility: 10000,
                    wind: 0,
                    rain: 0,
                    snow: 0,
                },
            },
        ],
    };

    return new Promise((resolve) => {
        resolve([response, undefined]);
    });
  },

  getDaily: function (_: WeatherServiceRequest): Promise<PossibleError<DailyResponse>> {
    const response: DailyResponse = {
        days: [
            {
                day: new Date("1995-12-17T03:24:00"),
                data: {
                    temp: 25,
                    feelsLike: 25,
                    humidity: 30,
                    uvi: 0,
                    clouds: 0,
                    visibility: 10000,
                    wind: 0,
                    rain: 0,
                    snow: 0,
                },
            },
        ],
    };

    return new Promise((resolve) => {
        resolve([response, undefined]);
    });
  }
}