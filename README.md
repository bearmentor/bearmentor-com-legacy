# 🐻 Bearmentor

> Brilliant mentoring

The mentoring platform for people and organization. Free to use and open source. Still in early and active development.

Check out:

- Web: <https://bearmentor.com>
- Repo: <https://github.com/bearmentor>
- Progress: <https://github.com/orgs/bearmentor/projects/2>

![Bearmentor](public/images/bearmentor.png)

## Getting Started

Read the [Remix Docs](https://remix.run/docs) to understand about Remix.

Tips:

- If you're new, focus on Remix basics, don't use the Stacks yet.
- If you're experienced, can already use various integration such as Prisma ORM and database.

## Tech Stack

1. [TypeScript](https://typescriptlang.org): Typed language
2. [React](https://react.dev): UI library
3. [Remix](https://remix.run): Web framework
4. [Tailwind CSS](https://tailwindcss.com): Styling
5. [Radix UI](https://radix-ui.com): Interactive components
6. [Prisma](https://prisma.io): Database ORM
7. [PlanetScale](https://planetscale.com): Database management system and deployment, with MySQL
8. [Vercel](https://vercel.com): App deployment

## Setup

Create a [PlanetScale](https://planetscale.com) account to have a production-ready MySQL instance. After the database has been created, copy the full `DATABASE_URL`.

Generate a random string for the `SESSION_SECRET` using `openssl rand -base64 32`.

Configure the environment variables in the `.env` file if local, otherwise in the project settings.

```sh
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/bearmentor?sslaccept=strict"
SESSION_SECRET="random_secret_text"
```

## Development

To run the app locally, make sure the project's local dependencies are installed:

```sh
pnpm install
```

Check the build:

```sh
pnpm build
```

If everything works fine, start the Remix development server like so:

```sh
pnpm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and it should be ready to go!

The `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) can also be used.

## Deployment

> **Notice**  
> The `@remix-run/vercel` runtime adapter has been deprecated in favor of out of
> the box Vercel functionality and will be removed in Remix v2.  
> This means no more using the Vercel template & can just use the Remix
> template instead.

After having run the `create-remix` command and selected "Vercel" as a deployment target, [import the Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If want to avoid using a Git repository, deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```sh
pnpm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).
