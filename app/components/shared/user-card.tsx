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
        <AvatarAuto className="h-24 w-24" user={user} />

        <div className="flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          {user?.profiles?.length > 0 && (
            <CardDescription>{user.profiles[0].headline}</CardDescription>
          )}
        </div>
      </CardHeader>

      {user.tags?.length > 0 && (
        <CardContent>
          <div>
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {user.tags.map(tag => {
                return (
                  <li key={`${tag.id}-${tag.symbol}`}>
                    <Badge size="sm" variant="secondary">
                      {tag.name}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
