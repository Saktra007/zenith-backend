import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  deleteUser,
  getUsers,
  getUserStats,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", upload.single("avatar"), registerUser);
router.post("/register", protect, upload.single("avatar"), registerUser);
router.get("/stats", protect, getUserStats);
router.get("/", protect, getUsers);
router.put("/:id", protect, upload.single("avatar"), updateUser);
router.delete("/:id", protect, deleteUser);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=failed`,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
  },
);

export default router;
