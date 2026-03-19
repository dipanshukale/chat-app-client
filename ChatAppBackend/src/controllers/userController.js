import { asyncHandler } from "../utils/asyncHandler.js";
import {
  followUser,
  getFollowingList,
  getPostsByUserId,
  getProfile,
  getUsersForFeed,
  updateProfilePicture,
} from "../services/userService.js";

export const followController = asyncHandler(async (req, res) => {
  const result = await followUser({
    loggedInUserId: req.user.id,
    userToFollowId: req.params.id,
  });
  res.json(result);
});

export const uploadProfilePicController = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    const err = new Error("No file uploaded");
    err.statusCode = 400;
    throw err;
  }

  const result = await updateProfilePicture({
    userId: req.user.id,
    profilePictureUrl: req.file.path,
  });
  res.json(result);
});

export const profileController = asyncHandler(async (req, res) => {
  const user = await getProfile({ userId: req.user._id });
  res.json(user);
});

export const usersController = asyncHandler(async (req, res) => {
  const users = await getUsersForFeed({ excludeUserId: req.user.id });
  res.json(users);
});

export const followingListController = asyncHandler(async (req, res) => {
  const result = await getFollowingList({ followingIds: req.user.following });
  res.json(result);
});

export const postsController = asyncHandler(async (req, res) => {
  const posts = await getPostsByUserId({ userId: req.params.userId });
  res.json(posts);
});

