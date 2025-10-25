import { PossibleError } from "@utils";
import { DailyResponse, HourlyResponse } from "@weather";

interface PromptData {
    hourly?: HourlyResponse;
    daily?: DailyResponse;
}

export class PromptGenerator {
    private data: PromptData;

    constructor(private question: string) {
        this.data = {};
    }

    setWeatherData<T extends keyof PromptData>(type: T, data: PromptData[typeof type]): void {
       this.data[type] = data;
    }

    generate(): PossibleError<string> {
        if (this.data.hourly) {
            const prompt = this.generatePromptForHourlyData(this.data.hourly);
            return [prompt, undefined];
        }

        if (this.data.daily) {
            const prompt = this.generatePromptForDailyData(this.data.daily);
            return [prompt, undefined];
        }

        return [undefined, { code: 422, message: "The weather data is undefined." }];
    }

    private generatePromptForHourlyData(data: HourlyResponse): string {
        const dataStrings = data.hours.map(({ hour, data }) => `{
            time: between ${String(hour).padStart(2, '0')}:00 and ${String(hour + 1).padStart(2, '0')}:00,
            temperature: ${data.temp} °C,
            temperature feeling like: ${data.feelsLike} °C,
            humidity: ${data.humidity} %,
            uvi: ${data.uvi} (UV index),
            clouds: ${data.clouds} %,
            visibility: ${data.visibility} meters,
            wind: ${data.wind} meter/sec,
            rain: ${data.rain} mm/h,
            snow: ${data.snow} mm/h,
        }`);

        return `${this.question} Given the following weather data: [${dataStrings.join(",")}]. 
            Responde suggesting the best times of the day if there is at least one.`;
    }

    private generatePromptForDailyData(data: DailyResponse): string {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        const dataStrings = data.days.map(({ day, data }) => `{
            day: ${dayNames[day.getDay()]},
            temperature: ${data.temp} °C,
            temperature feeling like: ${data.feelsLike} °C,
            humidity: ${data.humidity} %,
            uvi: ${data.uvi} (UV index),
            clouds: ${data.clouds} %,
            visibility: ${data.visibility} meters,
            wind: ${data.wind} meter/sec,
            rain: ${data.rain} mm/h,
            snow: ${data.snow} mm/h,
        }`);

        return `${this.question} Given the following weather data: [${dataStrings.join(",")}]. 
            Responde suggesting the best days if there is at least one.`;
    }
}