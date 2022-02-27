import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaExcludeError } from "./PrismaExcludeError";
import { ExcludeError, GetScalarKey, PrismaExclude } from "./types";
import { capitalize } from "./utils";

/**
 * Returns an exclude function based on the given
 * Prisma Client.
 *
 * ```ts
 * // Pass your client to `prismaExclude`
 * const prisma = new PrismaClient();
 * const exclude = prismaExclude(prisma);
 *
 * // Then use it in your queries
 * const users = await prisma.user.findMany({
 *   select: exclude("user", ["password"])
 * });
 * ```
 */
export const prismaExclude: PrismaExclude = (client) => {
  return (model, omit) => {
    if (!client) {
      throw new PrismaExcludeError(ExcludeError.noClient);
    }

    if (!(client instanceof PrismaClient)) {
      throw new PrismaExcludeError(ExcludeError.badClient);
    }

    if (!model) {
      throw new PrismaExcludeError(ExcludeError.noModel);
    }

    if (!(model in client)) {
      throw new PrismaExcludeError(ExcludeError.modelMismatch);
    }

    const modelFields =
      Prisma[
        `${capitalize(String(model))}ScalarFieldEnum` as GetScalarKey<
          typeof client,
          typeof model
        >
      ];

    // In case omit is not given
    const toExclude = omit || [];

    const result = {} as { [K in keyof typeof modelFields]: true };

    for (const key in modelFields) {
      if (!toExclude.includes(key as any)) {
        result[key] = true;
      }
    }

    // @todo
    // This fails because prop names are not assignable to `string`,
    // but to the prop name itself (password: "password" != password: string)
    // Caused by the Exclude in the return type.
    return result as any;
  };
};
