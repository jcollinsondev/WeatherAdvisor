import { assertEquals } from "assert";

import { mock as weatherMock, WeatherServiceRequest } from "@weather";
import { PromptGenerator } from "@llm";

const mock_location = { 
    name: "town", 
    lat: 0, 
    lon: 0,
    elevation: 0,
    country: "country",
    timezone: "timezone",
};

const mock_timeframe = {
    from: new Date(), 
    to: new Date(),
};

Deno.test("Prompt generation hourly", async () => {
    const mockRequest: WeatherServiceRequest = { location: mock_location, timeframe: mock_timeframe };
    const [hourlyWeather] = await weatherMock.getHourly(mockRequest);
    
    const promptGenerator = new PromptGenerator("Should I dry my clothes outside today?");
    promptGenerator.setWeatherData("hourly", hourlyWeather);
    const [prompt, error] = promptGenerator.generate();

    assertEquals(error, undefined);
    assertEquals(prompt, `Should I dry my clothes outside today? Given the following weather data: [{
            time: between 12:00 and 13:00,
            temperature: 25 °C,
            temperature feeling like: 25 °C,
            humidity: 30 %,
            uvi: 0 (UV index),
            clouds: 0 %,
            visibility: 10000 meters,
            wind: 0 meter/sec,
            rain: 0 mm/h,
            snow: 0 mm/h,
        }]. 
            Responde suggesting the best times of the day if there is at least one.`);
});

Deno.test("Prompt generation daily", async () => {
    const mockRequest: WeatherServiceRequest = { location: mock_location, timeframe: mock_timeframe };
    const [dailyWeather] = await weatherMock.getDaily(mockRequest);
    
    const promptGenerator = new PromptGenerator("Should I dry my clothes outside this weekend?");
    promptGenerator.setWeatherData("daily", dailyWeather);
    const [prompt, error] = promptGenerator.generate();

    assertEquals(error, undefined);
    assertEquals(prompt, `Should I dry my clothes outside this weekend? Given the following weather data: [{
            day: Sunday,
            temperature: 25 °C,
            temperature feeling like: 25 °C,
            humidity: 30 %,
            uvi: 0 (UV index),
            clouds: 0 %,
            visibility: 10000 meters,
            wind: 0 meter/sec,
            rain: 0 mm/h,
            snow: 0 mm/h,
        }]. 
            Responde suggesting the best days if there is at least one.`);
});