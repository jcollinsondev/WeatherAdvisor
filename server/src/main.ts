import { Router } from "./router.ts"

const port = Deno.env.get("PORT") ?? "8080";

const router = new Router();

router.get("/hello", () => {
    return new Promise((resolve) => {
        resolve(new Response("Hello World!"))
    });
});

Deno.serve({ port: +port }, router.handler.bind(router));