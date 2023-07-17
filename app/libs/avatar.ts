export function createAvatarImageURL(username: string) {
  return `https://api.dicebear.com/6.x/thumbs/svg?seed=${username}`
}
