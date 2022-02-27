import { Prisma, PrismaClient } from "@prisma/client";
import { withExclude } from "prisma-exclude";

// Initialize the Prisma Client and wrap it with withExclude

const prisma = withExclude(new PrismaClient());

// Use it in you queries

(async () => {
  const userWithAddress = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    select: {
      ...prisma.$exclude("user", ["password"]),
      addresses: {
        select: prisma.$exclude("address", ["zipCode"]),
      },
    },
  });

  // With Prisma Validator

  const userSafeSelect = Prisma.validator<Prisma.UserSelect>()(
    prisma.$exclude("user", ["password", "createdAt"])
  );

  const userSafe = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    select: userSafeSelect,
  });
})();
