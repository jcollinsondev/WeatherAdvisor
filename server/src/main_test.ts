import { assertEquals } from "assert/mod.ts";

Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});