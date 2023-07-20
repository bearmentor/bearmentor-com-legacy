import type { User } from "@prisma/client"

import {
  AvatarAuto,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components"

interface Props {
  user: User & {
    avatars: { url: string }[]
    tags: { id: string; symbol: string; name: string }[]
    profiles: { headline: string; links: string }[]
  }
}

export function UserCard({ user }: Props) {
  return (
    <Card className="hover-opacity max-w-2xl">
      <CardHeader className="flex gap-4">
        {user?.avatars[0]?.url && (
          <AvatarAuto
            className="h-24 w-24"
            src={user.avatars[0]?.url}
            alt={user.username}
            fallback={user.username[0].toUpperCase()}
          />
        )}

        <div className="flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <CardDescription>{user.profiles[0]?.headline}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          {user.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {user.tags.map(tag => {
                return (
                  <li key={tag.id}>
                    <Badge size="sm">{tag.name}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
