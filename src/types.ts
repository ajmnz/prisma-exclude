import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Check if a string starts with `$`
 */
type IsDollar<T> = T extends `$${infer ignore}` ? T : never;

/**
 * Exclude all keys from the PrismaClient that start
 * with `$`, leaving only the model names.
 *
 * T = keyof PrismaClient
 */
export type ModelNames<T> = Exclude<T, IsDollar<T>>;

/**
 * Get those keys that are compatible with `{modelName}ScalarFieldEnum`,
 * so we can later get all props for a model.
 */
type MatchKeys<T extends string> =
  `${Capitalize<T>}ScalarFieldEnum` extends keyof typeof Prisma
    ? `${Capitalize<T>}ScalarFieldEnum`
    : never;

/**
 * Extract from the PrismaClient those keys that will
 * get us the properties for each model.
 */
export type GetScalarKey<
  T extends PrismaClient,
  M extends ModelNames<keyof T>
> = Extract<keyof typeof Prisma, MatchKeys<string & M>>;

/**
 * Get the props for a given model name.
 */
export type GetModelProps<
  T extends PrismaClient,
  M extends ModelNames<keyof T>
> = typeof Prisma[GetScalarKey<T, M>];

/**
 * The exclude function.
 *
 * C = client
 * M = model
 * P = model props
 * O = props to omit
 */
type PrismaExcludeFunction<C extends PrismaClient> = <
  M extends ModelNames<keyof C>,
  P extends GetModelProps<C, M>,
  O extends (keyof P)[]
>(
  model: M,
  omit: O
) => {
  [Key in Exclude<keyof P, O[number]>]: true;
};

/**
 * Takes a PrismaClient as the only argument and outputs
 * the exclude function.
 *
 * C = client
 */
export type PrismaExclude = <C extends PrismaClient>(
  client: C
) => PrismaExcludeFunction<C>;

/**
 * Wraps a PrismaClient and returns it with the extra
 * method `$exclude`.
 *
 * C = client
 */
export interface WithExclude {
  <C extends PrismaClient>(client: C): C & {
    $exclude: PrismaExcludeFunction<C>;
  };
}

/**
 * Collection of all possible errors
 */
export enum ExcludeError {
  noClient = "A Prisma Client must be provided",
  badClient = "The provided client must be an instance of PrismaClient",
  noModel = "A model name must be provided",
  modelMismatch = "The model provided does not exist within this Prisma Client instance",
}
