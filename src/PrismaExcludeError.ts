import { ExcludeError } from "./types";

export class PrismaExcludeError extends Error {
  constructor(message: ExcludeError) {
    super(message);

    Object.setPrototypeOf(this, PrismaExcludeError.prototype);
  }
}
