import mongoose from "mongoose";
import passport from "passport";
import { Router } from "express";
import { genPassword, issueJWT, validPassword } from "../lib/utils";

const router = Router();
const User = mongoose.model("User");

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
  },
);

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  try {
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "could not find user" });
    }
    const isValid = validPassword(req.body.password, user.hash, user.salt);
    if (isValid) {
      const tokenObject = issueJWT(user);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: "you entered the wrong password" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  const { salt, hash } = genPassword(req.body.password);
  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
  });
  try {
    const user = await newUser.save();
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

export default router;
