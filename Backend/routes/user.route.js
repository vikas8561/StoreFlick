const express = require("express");
const {
  logoutRoute,
  refreshTokenRoute,
  loginRoute,
  signupRoute,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const UserRouter = express.Router();

UserRouter.get("/check-auth", verifyToken, checkAuth);

UserRouter.post("/signup", signupRoute);

UserRouter.post("/login", loginRoute);

UserRouter.post("/refresh-token", refreshTokenRoute);

UserRouter.post("/logout", logoutRoute);

UserRouter.post("/verify-email", verifyEmail);

UserRouter.post("/forgot-password", forgotPassword);

UserRouter.post("/reset-password/:token", resetPassword);

module.exports = UserRouter;
