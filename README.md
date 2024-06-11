<h1 align="center">Prisma Exclude</h1>
<p align="center">Exclude fields from your Prisma queries</p>

```ts
prisma.user.findMany({
  select: prisma.$exclude("user", ["password"]),
})
```

[![codecov](https://codecov.io/gh/ajmnz/prisma-exclude/branch/main/graph/badge.svg?token=4YHPCUVW75)](https://codecov.io/gh/ajmnz/prisma-exclude)

---

### ❗ This project is no longer maintained

Prisma has released native exclude support, addressing exactly what this project aimed to solve. More info:

- `omitApi` preview feature: https://github.com/prisma/prisma/discussions/23924

Thank you!

<hr>

## Table of contents
- [Table of contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
    - [Using `withExclude`](#using-withexclude)
    - [Using `prismaExclude`](#using-prismaexclude)

## Installation

> It is assumed that both `prisma` and `@prisma/client` packages are installed
> and that the Prisma Client has been generated.

```shell
$ yarn add prisma-exclude
```
or
```shell
$ npm install prisma-exclude
```

## Usage

**prisma-exclude** can be used in two different ways. You can wrap your instance of the Prisma Client with `withExclude` or directly pass your client to the `prismaExclude` function.

Both ways give you access to the `exclude` function which accepts a model name and an array of fields to exclude, all while maintaining type safety. This means that both model names and fields will have access to autocompletion (depending on your IDE).

#### Using `withExclude`

Wrap your Prisma Client with `withExclude` when initializing your instance.

```ts
import { PrismaClient } from "@prisma/client";
import { withExclude } from "prisma-exclude";

export const prisma = withExclude(new PrismaClient());
```

Then use the new available method `$exclude` to omit fields from your queries

```ts
import { prisma } from "./instance";

const users = await prisma.user.findMany({
  select: prisma.$exclude("user", ["password"]);
});
```

#### Using `prismaExclude`

If you don't want an extra method in your Prisma Client instance, you can initialize your own `exclude` function by providing the instance to `prismaExclude`

```ts
import { PrismaClient } from "@prisma/client";
import { prismaExclude } from "prisma-exclude";

export const prisma = new PrismaClient();
export const exclude = prismaExclude(prisma); 
```

Then you can use it in your queries

```ts
import { prisma, exclude } from "./instance";

const addresses = await prisma.address.findMany({
  where: {
    active: true,
  },
  include: {
    user: {
      select: exclude("user", ["password"]);
    }
  }
});
```






