import express from "express";
import passport from "passport";
import userController from "../controllers/user.controller";
import auth from "../middlewares/auth.middlewares";
require("../configs/passport");
const router = express.Router();

router.route("/checktokenexpired/:id").get(userController.checkTokenExpired);

router.route("/verify").post(userController.verifyEmail);

router.route("/register").post(userController.register);

router.route("/login").post(userController.login);

router.route("/users").get(auth.verifyToken, userController.listUsers);

router.route("/users/:id").get(userController.viewProfile);

router.route("/users/:id").post(userController.updateProfile);

//Login with google
router
  .route("/login/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureMessage: "Cannot login to Google, please try again latery!",
    failureRedirect: process.env.ERROR_CALLBACK_URL,
    session: false,
  }),
  auth.authGoogleSuccess
);
//Login with facebook
router
  .route("/login/facebook")
  .get(
    passport.authenticate("facebook", { scope: ["public_profile", "email"] })
  );

router.route("/facebook/callback").get(
  passport.authenticate("facebook", {
    failureMessage: "Cannot login to Facebook, please try again latery!",
    failureRedirect: process.env.ERROR_CALLBACK_URL,
    session: false,
  }),
  auth.authGoogleSuccess
);

export const userRouter = router;
