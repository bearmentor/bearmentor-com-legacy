# 🐻 Bearmentor

> Brilliant mentoring

The open mentoring platform for people and organization. Open source, free to
use, with premium options. 🐻 Bearmentor is a place for tech and creating
professionals to mentor each others.

Check out:

- Web: <https://bearmentor.com>
- Repo: <https://github.com/bearmentor>
- Progress: <https://github.com/orgs/bearmentor/projects/2>

> 🚧 Still in early and active development

![Bearmentor](public/images/bearmentor.png)

## Concept

> men·tor·ship (noun): the guidance provided by a mentor, especially an
> experienced person in a company or educational institution.

A true mentorship should enable to teach, guide, and share that can be for long
term growth.

🐻 Bearmentor allow you to:

- Connect to people, rospective mentors and mentees
- Explore various learning programs- Filter out for serious commitment
- Design custom mentorship experience
- Set achievable goals
- Get paid to mentor people
- Adjust your compensation rate, public or private
- Prefer between live/sync or recorded/async communication
- Link your social profiles, portfolios, projects, products, and more

[Read more about the features]()

## Getting Started

1. Read the [Remix Docs](https://remix.run/docs) to understand about Remix.
2. If you're new, focus on Remix basics, don't use the Stacks yet. Read
   [Super Simple Start to Remix](https://kentcdodds.com/blog/super-simple-start-to-remix).
3. If you're experienced, can already use various integration such as Prisma ORM
   and database like MySQL. Read
   [Blog Tutorial (short)](http://remix.run/docs/en/main/tutorials/blog) and
   [App Tutorial (long)](http://remix.run/docs/en/main/tutorials/jokes).

## Tech Stack

1. [TypeScript](https://typescriptlang.org): Typed language
   - Related to JavaScript, HTML, CSS
2. [React](https://react.dev): UI library
3. [Remix](https://remix.run): Web framework
   - [React Router](https://reactrouter.com)
4. [Tailwind CSS](https://tailwindcss.com): Styling
5. [Radix UI](https://radix-ui.com): Interactive components
   - [shadcn UI](https://ui.shadcn.com): Styled interactive components
6. [Prisma](https://prisma.io): Database ORM
7. [PlanetScale](https://planetscale.com): MySQL-compatible serverless database
   platform
   - [MySQL](https://mysql.com): Database management system
8. [Vercel](https://vercel.com): App deployment

## Setup

Create the `.env` file from the example `.env` file.

```sh
cp -i .env.example .env
```

> This .env file is only for local development, not production

Let's configure the required environment variables in the `.env` file if local,
otherwise in the project settings, for:

- `DATABASE_URL`
- `SESSION_SECRET`

Create a [PlanetScale](https://planetscale.com) account to have a MySQL instance
for development. After the database has been created, "Get the connection
string" and select "Prisma", then copy the full `DATABASE_URL`.

> Keep in mind the free plan only allow for 1 database. So either later you keep
> it, delete it when unused, or upgrade your plan.

Generate a random string for the `SESSION_SECRET` using
`openssl rand -base64 32` on the terminal or you can put any long random text.

```sh
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/bearmentor?sslaccept=strict"
SESSION_SECRET="random_secret_text"
```

## Development

### Dependencies

To run the app locally, make sure the project's local dependencies are
installed:

```sh
pnpm install
```

### Code

Format, lint, and build to check your setup is fine:

```sh
pnpm check
# run: format lint stylelint build

pnpm check:fix # to fix most cases if there's an issue
# run: format:fix lint:fix stylelint:fix
```

> Note: Ignore non-critical warning about ESLint and TypeScript

### Database

Sync between the schema of Prisma and the database, which we can do regularly
while updating the Prisma schema:

```sh
pnpm db:push
```

Then seed the initial data when needed:

```sh
pnpm db:seed
```

Check if the data is fine:

```sh
pnpm db:check
```

### Build

Check if the build is fine:

```sh
pnpm build
```

### Develop Locally

If everything works fine, start the Remix development server like so:

```sh
pnpm dev
```

Open up [http://localhost:3000](http://localhost:3000) and it should be ready to
go!

The `vercel dev` command provided by [Vercel CLI](https://vercel.com/cli) can
also be used when necessary.

## Deployment

This repo has been setup to autodeploy to Vercel automatically on Git push.

> The `@remix-run/vercel` runtime adapter has been deprecated in favor of out of
> the box Vercel functionality and will be removed in Remix v2.  
> No more using the Vercel template & can just use the Remix template instead.
> Will be changed after the upgrade to v2.

After having run the `create-remix` command and selected "Vercel" as a
deployment target, [import the Git repository](https://vercel.com/new) into
Vercel, and it will be deployed.

If want to avoid using a Git repository, deploy the directory by running
[Vercel CLI](https://vercel.com/cli):

```sh
pnpm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will
then automatically be deployed by Vercel, through its
[Git Integration](https://vercel.com/docs/concepts/git).

## References

### Related

- [🐱 Catamyst](https://catamyst.com) ⭐
- [🦌 Antelapp](https://github.com/mhaidarhanif/antelapp) ⭐

### Mentoring Platforms

- [ADPList](https://adplist.org) ⭐
  - [Top 11 Online Mentoring Platforms - ADPList Blog](https://blog.adplist.org/post/top-10-online-mentoring-platforms)
- [Codementor](https://codementor.io) ⭐
- [Superpeer](https://superpeer.com) ⭐
- [MentorCruise](https://mentorcruise.com)
- [Growthmentor](https://growthmentor.com)
- [Mentorpass](https://mentorpass.co)
- [Pair Up](https://pair-up.org) ⭐
- [Clarity](https://clarity.fm)
- [Designlab](https://designlab.com)
- [Sparrowstartup](https://sparrowstartup.com)
- [RookieUp](https://rookieup.com)
- [The Muse Coaching](https://themuse.com/coaching)

### Learning Management System (LMS)

- [Google Classroom](https://edu.google.com/intl/en_ALL/workspace-for-education/classroom)
- [GitHub Classroom](https://classroom.github.com) ⭐
- [Frappe LMS](https://frappelms.com)
- [Pupil First](https://pupilfirst.com)
- [Noodle](https://noodle.run)
  - [ixahmedxi/noodle](https://github.com/ixahmedxi/noodle)

### Online Courses

- [edX](https://edx.org)
- [SkillShare](https://skillshare.com)
- [Udacity](https://udacity.com)
- [Thinkific](https://thinkific.com)
- [Teachable](https://teachable.com)
- [Podia](https://podia.com)
- [Courselit](https://courselit.app)

### Business Platforms

- [Gumroad](https://gumroad.com)
- [Lemon](https://lemonsqueezy.com)

### Work Platforms

- [Upwork](https://upwork.com)
- [Fiverr](https://fiverr.com)

### Misc Tools

- [Read.cv](https://read.cv)
- [Calendly](https://calendly.com)
- [Around](https://around.co)
- [Mayar](https://mayar.id)
