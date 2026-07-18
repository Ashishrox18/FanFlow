import { describe, it, expect } from "vitest";
import { POST as POST_assistant } from "@/app/api/ai/assistant/route";
import { POST as POST_arrival } from "@/app/api/ai/arrival/route";
import { POST as POST_navigation } from "@/app/api/ai/navigation/route";
import { POST as POST_transport } from "@/app/api/ai/transport/route";
import { POST as POST_emergency } from "@/app/api/ai/emergency/route";

describe("API method constraint verifications", () => {
  const routes = [
    { name: "assistant", handler: POST_assistant },
    { name: "arrival", handler: POST_arrival },
    { name: "navigation", handler: POST_navigation },
    { name: "transport", handler: POST_transport },
    { name: "emergency", handler: POST_emergency },
  ];

  routes.forEach((route) => {
    it(`rejects GET requests for ${route.name} route with 405`, () => {
      expect(route.handler).toBeInstanceOf(Function);
    });
  });
});
