import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { authenticator } from "~/services/auth.server"
import { cn, prisma } from "~/libs"
import { stringify } from "~/utils"
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  toast,
} from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  const user = await prisma.user.findFirst({
    where: { id: userSession?.id },
    select: {
      id: true,
      name: true,
      nick: true,
      username: true,
      email: true,
      avatars: { select: { url: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      profiles: true,
    },
  })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Profile</h2>
        <p className="text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </header>

      <ProfileForm user={user as any} />
    </div>
  )
}

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(30, { message: "Name must not be longer than 30 characters." }),
  nick: z
    .string()
    .min(2, { message: "Nick must be at least 1 character." })
    .max(30, { message: "Nick must not be longer than 30 characters." }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z
    .string({ required_error: "Please select an email to display." })
    .email(),
  bio: z.string().max(160).min(4),
  links: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({
  user,
}: {
  user: Pick<User, "name" | "nick" | "username" | "email"> & {
    profiles: {
      id: string
      bio: string
      links: any
    }[]
  }
}) {
  const firstProfile = user.profiles[0]

  const defaultValues: Partial<ProfileFormValues> = {
    name: user.name || "",
    nick: user.nick || "",
    username: user.username || "",
    email: user.email || "",
    bio: firstProfile.bio || "This is my default bio.",
    links: firstProfile.links || [
      { value: "https://yourname.com" },
      { value: "http://twitter.com/yourname" },
    ],
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const { fields, append } = useFieldArray({
    name: "links",
    control: form.control,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function toastOnSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-40 rounded bg-stone-950 p-4">
          <code className="text-stone-50">{stringify(data)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Full Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nick"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nick name</FormLabel>
              <FormControl>
                <Input placeholder="nick" {...field} />
              </FormControl>
              <FormDescription>
                This is your nick name when being called
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="yourname" {...field} />
              </FormControl>
              <FormDescription>
                This is your public username as @username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@yourname.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your default email to communicate with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="you@yourname.com">
                    you@yourname.com
                  </SelectItem>
                  <SelectItem value="you@gmail.com">you@gmail.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link to="/settings/email">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`links.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Links
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links or URLs to your website, blog, or social media
                    profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div>

        <Button type="submit" size="lg">
          Save Profile
        </Button>
      </form>
    </Form>
  )
}
