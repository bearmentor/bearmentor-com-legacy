# Data for Credentials

Create `users-credentials.json` with this format. You can focus on certain users
who want to be able to login in development, so it doesn't have to be everyone.
For example, only create for `admin`, `test`, or `yourname` which also available
in [`data/users.ts`](./users.ts)

```json
[
  {
    "username": "username",
    "email": "user1@example.com",
    "password": "set_the_password_1"
  },
  {
    "username": "username2",
    "email": "user2@example.com",
    "password": "set_the_password_2"
  }
  // ...
]
```
