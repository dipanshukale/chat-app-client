import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  followController,
  followingListController,
  postsController,
  profileController,
  uploadProfilePicController,
  usersController,
} from "../controllers/userController.js";
import { upload } from "../config/upload.js";

const router = Router();

router.post("/follow/:id", protect, followController);
router.post("/upload-profile-pic", protect, upload.single("profilePic"), uploadProfilePicController);
router.get("/profile", protect, profileController);
router.get("/posts/:userId", postsController);
router.get("/users", protect, usersController);
router.get("/following-list", protect, followingListController);

export default router;

