import { capitalize } from "../src/utils";

describe("test utilities", () => {
  describe("capitalize", () => {
    it("should capitalize a string", () => {
      expect(capitalize("foo")).toEqual("Foo");
    });
  });
});
