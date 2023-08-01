import * as userPassword from "./user-password.server"
import * as userProfile from "./user-profile.server"
import * as userRole from "./user-role.server"
import * as userTag from "./user-tag.server"
import * as user from "./user.server"

export const model = {
  user,
  userTag,
  userPassword,
  userProfile,
  userRole,
}
