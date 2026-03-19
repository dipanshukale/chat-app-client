import { Router } from "express";
import { body } from "express-validator";
import {
  loginController,
  logoutController,
  refreshController,
  signupController,
} from "../controllers/authController.js";

const router = Router();

router.post(
  "/signup",
  [
    body("username").isString().notEmpty().withMessage("username is required"),
    body("email").isEmail().withMessage("valid email is required"),
    body("password").isString().isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
  ],
  signupController
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("valid email is required"),
    body("password").isString().notEmpty().withMessage("password is required"),
  ],
  loginController
);

router.post("/logout", logoutController);
router.post("/refresh", refreshController);

export default router;

