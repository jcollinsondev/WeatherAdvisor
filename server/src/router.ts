export class Router {
    private handlers: Map<Request["method"], Map<URL["pathname"], RequestHandler>>;

    constructor() {
        this.handlers = new Map();
        this.handlers.set("GET", new Map());
        this.handlers.set("POST", new Map());
    }

    get(pathname: string, handler: RequestHandler): void {
        const getHandlers = this.handlers.get("GET");
        if (!getHandlers) return;
        getHandlers.set(pathname, handler);
    }

    post(pathname: string, handler: RequestHandler): void {
        const postHandlers = this.handlers.get("POST");
        if (!postHandlers) return;
        postHandlers.set(pathname, handler);
    }

    async handler(request: Request): Promise<Response> {
        const method = request.method;
        const url = new URL(request.url);
        const pathname = url.pathname;
        const handlerParam = { request, searchParams: url.searchParams };

        if (!this.handlers.has(method)) return await this.notFoundHandler(handlerParam);

        const methodHandlers = this.handlers.get(method);
        if (!methodHandlers || !methodHandlers.has(pathname)) return await this.notFoundHandler(handlerParam);

        const handler = methodHandlers.get(pathname);

        if (!handler) return await this.notFoundHandler(handlerParam);
        return await handler(handlerParam)
    }

    private notFoundHandler: RequestHandler = () => {
        const body = JSON.stringify({ message: "NOT FOUND" });
        const response = new Response(body, {
            status: 404,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        });

        return new Promise(resolve => resolve(response));
    }
}

type RequestHandler = ({ request, searchParams }: { request: Request, searchParams: URLSearchParams }) => Promise<Response>