import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  AvatarAuto,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Debug,
  FormField,
  FormLabel,
  Input,
  Layout,
  SearchForm,
  Textarea,
} from "~/components"
import { schemaBroadcast } from "~/schemas"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const broadcasts = await prisma.broadcast.findMany({
      orderBy: { updatedAt: "asc" },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatars: { select: { url: true } },
          },
        },
      },
    })

    return json(
      { query, count: broadcasts.length, broadcasts },
      { headers: createCacheHeaders(request, 60) },
    )
  }

  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { updatedAt: "asc" },
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { body: { contains: query } },
        {
          user: {
            OR: [
              {
                name: { contains: query },
                username: { contains: query },
              },
            ],
          },
        },
      ],
    },
    include: {
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatars: { select: { url: true } },
        },
      },
    },
  })

  return json({ query, count: broadcasts.length, broadcasts })
}

export default function BroadcastsRoute() {
  const { userData } = useRootLoaderData()
  const { query, count, broadcasts } = useLoaderData<typeof loader>()
  const lastSubmission = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { title, description, body }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaBroadcast })
    },
  })

  return (
    <Layout className="flex justify-center">
      <div className="max-w-2xl space-y-8 px-4 py-4 sm:px-8">
        <header className="space-y-4">
          <h1 className="flex items-center justify-center gap-2 text-4xl text-brand">
            <span>Broadcasts</span>
          </h1>
          <p className="text-muted-foreground">
            Broadcasts are a small announcements or requests for everyone that
            you need a mentor or offering a mentorship service.
          </p>
          <SearchForm action="/broadcasts" placeholder="Search broadcasts" />
        </header>

        {userData?.id && (
          <section id="create-broadcast">
            <Form {...form.props} replace method="PUT" className="space-y-6">
              <fieldset
                disabled={isSubmitting}
                className="space-y-2 disabled:opacity-80"
              >
                <FormField>
                  <FormLabel htmlFor={title.id}>Title</FormLabel>
                  <Input
                    {...conform.input(title)}
                    type="text"
                    placeholder="Title of the request or offer"
                  />
                  {title.error && (
                    <Alert variant="destructive" id={title.errorId}>
                      {title.error}
                    </Alert>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor={description.id}>Description</FormLabel>
                  <Input
                    {...conform.input(description)}
                    type="text"
                    placeholder="Informative description about it"
                  />
                  {description.error && (
                    <Alert variant="destructive" id={description.errorId}>
                      {description.error}
                    </Alert>
                  )}
                </FormField>

                <FormField>
                  <FormLabel htmlFor={body.id}>Your Bio</FormLabel>
                  <Textarea
                    {...conform.input(body)}
                    placeholder="Tell more complete information about it..."
                    className="min-h-[100px]"
                  />
                  {body.error && (
                    <Alert variant="destructive" id={body.errorId}>
                      {body.error}
                    </Alert>
                  )}
                </FormField>

                <Button type="submit" name="intent" disabled={isSubmitting}>
                  Send Broadcast from {userData.nick}
                </Button>
              </fieldset>
            </Form>
          </section>
        )}

        {count > 0 && (
          <section className="space-y-2">
            {!query && <p>{count} broadcasts</p>}
            {query && (
              <p className="text-muted-foreground">
                Found {count} {formatPluralItems("broadcast", count)} with
                keyword "{query}"
              </p>
            )}

            <ul className="space-y-2 sm:space-y-4">
              {broadcasts.map(broadcast => {
                return (
                  <li key={broadcast.id} className="w-full">
                    <Link to={`/broadcasts/${broadcast.slug}`}>
                      <Card className="hover-opacity max-w-2xl space-y-2">
                        <CardHeader className="space-y-2 p-4">
                          <div>
                            <CardTitle className="text-2xl">
                              {broadcast.title}
                            </CardTitle>
                            <CardDescription>
                              {broadcast.description}
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-2">
                            <AvatarAuto
                              className="h-10 w-10"
                              src={broadcast.user.avatars[0]?.url}
                              alt={broadcast.user.username}
                              fallback={broadcast.user.username[0].toUpperCase()}
                            />
                            <div className="space-y-0">
                              <h6>{broadcast.user.name}</h6>
                              <p className="text-sm text-muted-foreground">
                                @{broadcast.user.username}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        {broadcast.body && (
                          <CardContent className="space-y-4 px-4 pb-4">
                            {broadcast.body && (
                              <p className="prose dark:prose-invert whitespace-pre-wrap">
                                {broadcast.body}
                              </p>
                            )}
                          </CardContent>
                        )}

                        {broadcast.tags?.length > 0 && (
                          <CardContent className="space-y-4 px-4 pb-4">
                            <ul className="flex flex-wrap gap-1 sm:gap-2">
                              {broadcast.tags.map(tag => {
                                return (
                                  <li key={tag.id}>
                                    <Badge size="sm" variant="secondary">
                                      {tag.name}
                                    </Badge>
                                  </li>
                                )
                              })}
                            </ul>
                          </CardContent>
                        )}
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <Debug>{broadcasts}</Debug>
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaBroadcast })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  // Do something

  return json(submission)
}
