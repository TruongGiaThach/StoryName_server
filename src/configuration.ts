export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  storyRpc: process.env.STORY_RPC_URL,
});
