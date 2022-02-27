import { Prisma, PrismaClient } from "@prisma/client";
import { prismaExclude } from "prisma-exclude";

// Initialize the Prisma Client
const prisma = new PrismaClient();

// Initialize the exclude function
const exclude = prismaExclude(prisma);

// Use it in you queries

(async () => {
  const userWithAddress = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    select: {
      ...exclude("user", ["password"]),
      addresses: {
        select: exclude("address", ["zipCode"]),
      },
    },
  });

  // With Prisma Validator

  const userSafeSelect = Prisma.validator<Prisma.UserSelect>()(
    exclude("user", ["password", "createdAt"])
  );

  const userSafe = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    select: userSafeSelect,
  });
})();
