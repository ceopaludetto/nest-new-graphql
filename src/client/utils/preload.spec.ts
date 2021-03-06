import { routes } from "@/client/providers/routes";

import { findRoute, preload, findRouteByName, removeDuplicate } from "./preload";

describe("preload", () => {
  describe("findRoute", () => {
    it("should find one or more route per path", () => {
      const finded = findRoute("/", routes, []);

      expect(Array.isArray(finded)).toBe(true);
      expect(finded.length).toBe(2);
      expect(finded[0].name).toBe("@MAIN");
    });

    it("should return empty array if no route are found", () => {
      const finded = findRoute("/blablabla", routes, []);

      expect(finded).toEqual([]);
      expect(finded.length).toBe(0);
    });
  });

  describe("preload", () => {
    it("should preload route", async () => {
      const client: Record<string, any> = { query: jest.fn(() => Promise.resolve()) };

      const components = await preload("/", { client: client as any });

      expect(Array.isArray(components)).toBe(true);
      expect(typeof components[0]).toBe("function");
      expect(components.length).toBe(2);

      expect(client.query).toBeCalledTimes(0);

      await preload("/app/blocks", { client: client as any });

      expect(client.query).toBeCalledTimes(1);
    });

    it("should preload component", async () => {
      const client: Record<string, any> = { query: jest.fn(() => Promise.resolve()) };
      const route = findRouteByName("@APP:BLOCKS:LIST", routes);

      if (route?.component) {
        const component = await preload(route?.component, { client: client as any });

        expect(typeof component).toBe("function");

        expect(client.query).toBeCalledTimes(1);
      }
    });
  });

  describe("findRouteByName", () => {
    it("should find route by name", () => {
      const route = findRouteByName("@MAIN", routes);

      expect(route).toBeDefined();
      expect(route?.name).toBe("@MAIN");
    });

    it("should find route by cache", () => {
      findRouteByName("@MAIN", routes);
      const route = findRouteByName("@MAIN", routes);

      expect(route).toBeDefined();
      expect(route?.name).toBe("@MAIN");
    });

    it("should find children route by name", () => {
      const route = findRouteByName("@APP:SETTINGS:APPEARANCE", routes);

      expect(route).toBeDefined();
      expect(route?.name).toBe("@APP:SETTINGS:APPEARANCE");
    });
  });

  describe("removeDuplicate", () => {
    it("should remove duplicated routes", () => {
      const route = findRoute("/");

      expect(route.length).toBe(2);
      expect(removeDuplicate(route).length).toBe(1);
    });
  });
});
