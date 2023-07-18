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
  filterSymbol?: string[]
}

export function UserCard({ user, filterSymbol }: Props) {
  return (
    <Card className="max-w-2xl transition hover:opacity-80">
      <CardHeader className="flex gap-4">
        <AvatarAuto
          className="h-24 w-24"
          src={user.avatars[0]?.url}
          alt={user.username}
          fallback={user.username[0].toUpperCase()}
        />

        <div className="flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <CardDescription>{user.profiles[0]?.headline}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="flex flex-wrap gap-1 sm:gap-2">
          {user.tags
            .filter(tag => {
              return !filterSymbol || !filterSymbol.includes(tag.symbol)
            })
            .map(tag => {
              return (
                <li key={tag.id}>
                  <Badge size="sm">{tag.name}</Badge>
                </li>
              )
            })}
        </ul>
      </CardContent>
    </Card>
  )
}
