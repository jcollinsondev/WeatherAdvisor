import { OpenMeteoService } from "@OpenMeteo";
import { GeocodingService } from "@Geocoding";

import { Router } from "./router.ts"

const port = Deno.env.get("PORT") ?? "8080";

const router = new Router();

router.get("/location/search", async () => {
    const geocoding = new GeocodingService();
    const [response, error] = await geocoding.search("lenno");

    if (error) return new Response(error.message, { status: error.code });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
});

router.get("/current", async () => {
    const openMeteo = new OpenMeteoService();
    const [response, error] = await openMeteo.getCurrent({
        location: {
            name: "town",
            lat: 45.971952,
            lon: 9.186494,
        },
        timeframe: {
            from: new Date(),
            to: new Date(),
        }
    });

    if (error) return new Response(error.message, { status: error.code });
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    });
});

Deno.serve({ port: +port }, router.handler.bind(router));