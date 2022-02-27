import { PrismaClient } from "@prisma/client";
import { PrismaExcludeError } from "./PrismaExcludeError";
import { prismaExclude } from "./prismaExclude";
import { ExcludeError, WithExclude } from "./types";

/**
 * Wraps the PrismaClient by adding an `$exclude` method
 * that works the same as the `prismaExclude` function.
 *
 * ```js
 * // Define the instance
 * const prisma = withExclude(new PrismaClient());
 *
 * // Then use it in your queries
 * const users = await prisma.user.findMany({
 *  select: prisma.$exclude("user", ["password"]),
 * });
 * ```
 */
export const withExclude: WithExclude = (client) => {
  if (!client) {
    throw new PrismaExcludeError(ExcludeError.noClient);
  }

  if (!(client instanceof PrismaClient)) {
    throw new PrismaExcludeError(ExcludeError.badClient);
  }

  return Object.assign(client, { $exclude: prismaExclude(client) });
};
