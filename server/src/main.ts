import { OpenMeteoService } from "@OpenMeteo";
import { GeocodingService } from "@Geocoding";

import { Router } from "./router.ts"

const port = Deno.env.get("PORT") ?? "8080";

const router = new Router();

router.get("/api/location/search", async ({ searchParams }) => {
    const name = searchParams.get("name");
    if (!name) return new Response("name missing.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });

    const geocoding = new GeocodingService();
    const [response, error] = await geocoding.search(name);

    if (error) return new Response(error.message, { status: error.code, headers: { "Access-Control-Allow-Origin": "*" } });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
        },
    });
});

router.get("/api/weather/current", async ({ searchParams }) => {
    const lat = searchParams.get("lat");
    if (!lat) return new Response("lat missing.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    if (isNaN(+lat)) return new Response("lat has to be a number.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });

    const lon = searchParams.get("lon");
    if (!lon) return new Response("lon missing.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    if (isNaN(+lon)) return new Response("lon has to be a number.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });

    const timezone = searchParams.get("lon");
    if (!timezone) return new Response("timezone missing.", { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });

    const openMeteo = new OpenMeteoService();
    const [response, error] = await openMeteo.getCurrent({
        location: {
            lat: +lat,
            lon: +lon,
            timezone,
        },
    });

    if (error) return new Response(error.message, { status: error.code, headers: { "Access-Control-Allow-Origin": "*" } });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
        },
    });
});

Deno.serve({ port: +port }, router.handler.bind(router));