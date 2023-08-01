export function createAvatarImageURL(username = "username") {
  return `https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`
}
