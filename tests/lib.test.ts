import { Prisma, PrismaClient } from "@prisma/client";
import { prismaExclude, withExclude } from "../src";
import { ExcludeError, PrismaExclude } from "../src/types";

describe("test library", () => {
  let prisma: PrismaClient;
  let exclude: ReturnType<PrismaExclude>;

  beforeAll(() => {
    prisma = new PrismaClient();
    exclude = prismaExclude(prisma);
  });

  describe("prismaExclude", () => {
    it("should throw if no client is provided", () => {
      // @ts-ignore
      expect(prismaExclude()).toThrow(ExcludeError.noClient);
    });

    it("should throw if an invalid client is provided", () => {
      expect(prismaExclude({} as any)).toThrow(ExcludeError.badClient);
    });

    it("should throw if no model is provided", () => {
      // @ts-ignore
      expect(() => exclude()).toThrow(ExcludeError.noModel);
    });

    it("should throw if an invalid model is provided", () => {
      // @ts-ignore
      expect(() => exclude("nope")).toThrow(ExcludeError.modelMismatch);
    });

    it("should return all keys if no keys to exclude are provided", () => {
      let validKeys = {} as { [K: string]: true };
      for (const key in Prisma.UserScalarFieldEnum) {
        validKeys[key] = true;
      }

      expect(exclude("user", [])).toStrictEqual(validKeys);
    });

    it("should exclude a key", () => {
      let validKeys = {} as { [K: string]: true };
      for (const key in Prisma.UserScalarFieldEnum) {
        if (key !== "password") {
          validKeys[key] = true;
        }
      }

      expect(exclude("user", ["password"])).toStrictEqual(validKeys);
    });

    it("should exclude multiple keys", () => {
      let validKeys = {} as { [K: string]: true };
      for (const key in Prisma.UserScalarFieldEnum) {
        if (!["password", "email"].includes(key)) {
          validKeys[key] = true;
        }
      }

      expect(exclude("user", ["password", "email"])).toStrictEqual(validKeys);
    });

    it("should ignore unknown keys", () => {
      let validKeys = {} as { [K: string]: true };
      for (const key in Prisma.UserScalarFieldEnum) {
        if (key !== "password") {
          validKeys[key] = true;
        }
      }

      // @ts-ignore
      expect(exclude("user", ["password", "nope"])).toStrictEqual(validKeys);
    });
  });

  describe("withExclude", () => {
    it("should throw if no client is provided", () => {
      // @ts-ignore
      expect(() => withExclude()).toThrow(ExcludeError.noClient);
    });

    it("should throw if an invalid client is provided", () => {
      expect(() => withExclude({} as any)).toThrow(ExcludeError.badClient);
    });

    it("should have the $exclude method", () => {
      const client = withExclude(prisma);
      expect(client).toHaveProperty("$exclude");
    });

    it("should have a working $exclude method", () => {
      const client = withExclude(prisma);
      let validKeys = {} as { [K: string]: true };
      for (const key in Prisma.UserScalarFieldEnum) {
        if (key !== "password") {
          validKeys[key] = true;
        }
      }

      expect(client.$exclude("user", ["password"])).toStrictEqual(validKeys);
    });
  });
});
