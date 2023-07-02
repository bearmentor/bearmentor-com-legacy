# 🐻 Bearmentor

> Brilliant mentoring

The mentoring platform for people and organization. Free to use and open source. Still in early and active development.

Check out:

- Web: <https://bearmentor.com>
- Repo: <https://github.com/bearmentor>

![Bearmentor](public/images/bearmentor.png)

## Getting Started

Read the [Remix Docs](https://remix.run/docs) to understand about Remix.

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
