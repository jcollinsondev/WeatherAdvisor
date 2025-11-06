import { OpenMeteoService } from "@OpenMeteo";
import { GeocodingService } from "@Geocoding";
import { OllamaService } from "@Ollama";
import { AddLocationRequest, LocationsTable } from "@location";
import { AskQuestionRequest, PromptGenerator } from "@llm";
import { DbService } from "@db";

import { Router } from "./router.ts"

const port = Deno.env.get("PORT") ?? "8080";

const router = new Router();

router.get("/location/search", async ({ searchParams }) => {
    const name = searchParams.get("name");
    if (!name) return new Response("name missing.", { status: 400 });

    const geocoding = new GeocodingService();
    const [response, error] = await geocoding.search(name);

    if (error) return new Response(error.message, { status: error.code });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
});

router.get("/weather/current", async ({ searchParams }) => {
    const lat = searchParams.get("lat");
    if (!lat) return new Response("lat missing.", { status: 400 });
    if (isNaN(+lat)) return new Response("lat has to be a number.", { status: 400 });

    const lon = searchParams.get("lon");
    if (!lon) return new Response("lon missing.", { status: 400 });
    if (isNaN(+lon)) return new Response("lon has to be a number.", { status: 400 });

    const timezone = searchParams.get("lon");
    if (!timezone) return new Response("timezone missing.", { status: 400 });

    const openMeteo = new OpenMeteoService();
    const [response, error] = await openMeteo.getCurrent({
        location: {
            lat: +lat,
            lon: +lon,
            timezone,
        },
    });

    if (error) return new Response(error.message, { status: error.code });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
});

router.post("/location/save", async ({ request }) => {
    let body: AddLocationRequest;
    try {
        body = await request.json();
    } catch {
        return new Response("Invalid JSON body.", { status: 400 });
    }

    const db = new DbService();
    const locations = new LocationsTable(db);

    const error = await locations.add(body);

    if (error) return new Response(error.message, { status: error.code });
    return new Response(null, { status: 200 });
});

router.get("/location/list", async () => {
    const db = new DbService();
    const locations = new LocationsTable(db);

    const [response, error] = await locations.list();

    if (error) return new Response(error.message, { status: error.code });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
});

router.post("/llm/ask", async ({ request }) => {
    let body: AskQuestionRequest;
    try {
        body = await request.json();
    } catch {
        return new Response("Invalid JSON body.", { status: 400 });
    }

    const openMeteo = new OpenMeteoService();
    const promptGenerator = new PromptGenerator(body.question);
    const ollama = new OllamaService("tinyllama");

    const [weatherData, weatherDataError] = body.dataType === "hourly" ? await openMeteo.getHourly(body) : await openMeteo.getDaily(body);
    if (weatherDataError) return new Response(weatherDataError.message, { status: weatherDataError.code });

    promptGenerator.setWeatherData(body.dataType, weatherData);
    const [prompt, promptError] = promptGenerator.generate();
    if (promptError) return new Response(promptError.message, { status: promptError.code });
    
    const [stream, error] = await ollama.ask(prompt);
    if (error) return new Response(error.message, { status: error.code });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
        status: 200,
        headers: {
            "content-type": "application/x-ndjson; charset=utf-8",
        },
    });
});

Deno.serve({ port: +port }, router.handler.bind(router));