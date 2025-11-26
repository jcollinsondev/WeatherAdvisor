import { assertEquals } from "assert";
import { assertSpyCalls, spy } from "mock";

import { Timeframe, mock as weatherMock, WeatherServiceRequest } from "@weather";
import { LlmStreamChunk, PromptGenerator, StreamReader } from "@llm";

//#region Prompt Generation Tests
const mock_location = { 
    name: "town", 
    lat: 0, 
    lon: 0,
    elevation: 0,
    country: "country",
    timezone: "timezone",
};

const mock_timeframe: Timeframe = {
    from: (new Date()).toISOString(), 
    to: (new Date()).toISOString(), 
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
            Responde suggesting the best times of the day if there is at least one. Keep the answer short.`);
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
            Responde suggesting the best days if there is at least one. Keep the answer short.`);
});
//#endregion

//#region Read Stream Tests
function createMockReader(chunks: (Uint8Array | null)[]): ReadableStreamDefaultReader<Uint8Array> {
    let index = 0;
    return {
        read: () => {
            const value = chunks[index++];
            if (value === null) return new Promise(resolve => resolve({ done: true, value: undefined }));
            return new Promise(resolve => resolve({ done: false, value }));
        },
        cancel: async () => { },
        releaseLock: async () => { },
        closed: new Promise(resolve => resolve(undefined)),
    };
}

const mockDecoder: TextDecoder = {
    decode: (value: Uint8Array) => new TextDecoder().decode(value),
    encoding: "",
    fatal: false,
    ignoreBOM: false
};

const mockMapper: (data: { foo: number }) => LlmStreamChunk = (json: { foo: number }) => ({
    createdAt: new Date(0),
    response: json.foo.toString(),
    done: false,
});

function createMockController(enqueued: string[]): ReadableStreamDefaultController<string> {
    return {
        enqueue: (v: string) => enqueued.push(v),
        close: () => enqueued.push("<closed>"),
        desiredSize: null,
        error: () => { },
    };
}

Deno.test("StreamReader reads, decodes, maps, and enqueues lines", async () => {
    const input = new TextEncoder().encode(
        JSON.stringify({ foo: 1 }) + "\n" +
        JSON.stringify({ foo: 2 }) + "\n"
    );

    const mockReader = createMockReader([input, null]);

    const enqueued: string[] = [];
    const controller = createMockController(enqueued);

    const reader = new StreamReader<{ foo: number }>(mockReader, mockDecoder, mockMapper);

    await reader.start(controller);

    assertEquals(enqueued.length, 2);
    assertEquals(enqueued[0], JSON.stringify({
        createdAt: new Date(0),
        response: "1",
        done: false,
    }) + "\n");
    assertEquals(enqueued[1], JSON.stringify({
        createdAt: new Date(0),
        response: "2",
        done: false,
    }) + "\n");
});

Deno.test("StreamReader skips blank lines", async () => {
    const input = new TextEncoder().encode("\n\n" + JSON.stringify({ foo: 1 }) + "\n");

    const mockReader = createMockReader([input, null]);

    const enqueued: string[] = [];
    const controller = createMockController(enqueued);

    const reader = new StreamReader<{ foo: number }>(mockReader, mockDecoder, mockMapper);

    await reader.pull(controller);

    assertEquals(enqueued.length, 1);
    assertEquals(enqueued[0], JSON.stringify({
        createdAt: new Date(0),
        response: "1",
        done: false,
    }) + "\n");
});

Deno.test("StreamReader.cancel calls underlying reader.cancel", async () => {
    const mockReader = createMockReader([null]);
    const cancelSpy = spy(mockReader, "cancel");

    const reader = new StreamReader(mockReader, mockDecoder, mockMapper);

    await reader.cancel();

    assertSpyCalls(cancelSpy, 1);
});

Deno.test("StreamReader.pull reads sequential chunks", async () => {
    const chunk1 = new TextEncoder().encode(JSON.stringify({ foo: 1 }) + "\n");
    const chunk2 = new TextEncoder().encode(JSON.stringify({ foo: 2 }) + "\n");

    const mockReader = createMockReader([chunk1, chunk2, null]);

    const enqueued: string[] = [];
    const controller = createMockController(enqueued);

    const reader = new StreamReader<{ foo: number }>(mockReader, mockDecoder, mockMapper);

    await reader.pull(controller);
    await reader.pull(controller);
    await reader.pull(controller);

    assertEquals(enqueued.length, 3);
    assertEquals(enqueued[0], JSON.stringify({
        createdAt: new Date(0),
        response: "1",
        done: false,
    }) + "\n");
    assertEquals(enqueued[1], JSON.stringify({
        createdAt: new Date(0),
        response: "2",
        done: false,
    }) + "\n");
    assertEquals(enqueued[2], "<closed>");
});
//#endregion