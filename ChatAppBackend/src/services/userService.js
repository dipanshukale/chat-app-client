import User from "../models/User.js";

export async function followUser({ loggedInUserId, userToFollowId }) {
  const loggedInUser = await User.findById(loggedInUserId);
  const userToFollow = await User.findById(userToFollowId);

  if (!userToFollow) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (!loggedInUser.following.includes(userToFollow._id)) {
    loggedInUser.following.push(userToFollow._id);
    await loggedInUser.save();
  }

  if (!userToFollow.followers.includes(loggedInUser._id)) {
    userToFollow.followers.push(loggedInUser._id);
    await userToFollow.save();
  }

  return { message: `You are now following ${userToFollow.username}` };
}

export async function updateProfilePicture({ userId, profilePictureUrl }) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  user.profilePicture = profilePictureUrl;
  await user.save();
  return { success: true, user };
}

export async function getProfile({ userId }) {
  const user = await User.findById(userId).select("-password");
  return user;
}

export async function getUsersForFeed({ excludeUserId }) {
  return await User.find({ _id: { $ne: excludeUserId } }).select("_id username profilePicture");
}

export async function getFollowingList({ followingIds }) {
  if (!followingIds || followingIds.length === 0) return { following: [] };
  const users = await User.find({ _id: { $in: followingIds } }).select("_id username profilePicture");
  return { following: users };
}

// Kept to match existing API shape (even though it's not a real "posts" model).
export async function getPostsByUserId({ userId }) {
  return await User.find({ userId });
}

